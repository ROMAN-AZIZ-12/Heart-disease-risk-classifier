import json

from dotenv import dotenv_values
from google import genai
from google.genai import errors, types
from pydantic import ValidationError

from backend.schemas import Explanation, HeartInputs, Prediction
from backend.services.prediction import BINARY_COLUMNS, PROJECT_DIR

GEMINI_MODEL = "gemini-3.5-flash-lite"


class ExplanationUnavailable(Exception):
    def __init__(self, message: str, status_code: int = 503):
        self.message = message
        self.status_code = status_code


def explain(inputs: HeartInputs, result: Prediction) -> Explanation:
    # Read only on an explicit explanation request. Never return the key.
    api_key = (dotenv_values(PROJECT_DIR / ".env").get("GEMINI_API_KEY") or "").strip()
    if not api_key or api_key == "your_key_here":
        raise ExplanationUnavailable("Gemini is not configured. Add GEMINI_API_KEY to the project .env file.")

    raw_inputs = inputs.model_dump()
    for name in BINARY_COLUMNS:
        raw_inputs[name] = int(raw_inputs[name])
    payload = {
        "fictional_inputs": raw_inputs,
        "model_probability": result.probability,
        "model_probability_percent": round(result.probability * 100, 1),
        "model_risk_label": result.risk_label,
        "saved_threshold": result.threshold,
    }
    schema = {
        "type": "OBJECT",
        "properties": {
            "meaning": {"type": "STRING"},
            "relevant_factors": {"type": "ARRAY", "items": {"type": "STRING"}},
            "questions_for_professional": {"type": "ARRAY", "items": {"type": "STRING"}},
        },
        "required": ["meaning", "relevant_factors", "questions_for_professional"],
    }
    try:
        instructions = (PROJECT_DIR / "prompts" / "gemini_explanation.txt").read_text(encoding="utf-8")
        with genai.Client(api_key=api_key, http_options=types.HttpOptions(timeout=30000)) as client:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=json.dumps(payload),
                config=types.GenerateContentConfig(
                    system_instruction=instructions,
                    response_mime_type="application/json",
                    response_schema=schema,
                ),
            )
        return Explanation.model_validate_json(response.text or "")
    except errors.APIError as error:
        if error.code == 429:
            raise ExplanationUnavailable("Gemini's request limit has been reached. Please try again later.", 429) from None
        raise ExplanationUnavailable("Gemini is unavailable. Check the server's API key or try again later.") from None
    except (ValidationError, ValueError):
        raise ExplanationUnavailable("Gemini did not return a usable explanation. Please try again.", 502) from None
    except Exception:
        # Do not expose SDK errors, request contents, or credentials.
        raise ExplanationUnavailable("Gemini could not be reached. Please try again later.") from None
