"""Offline migration checks. Gemini is mocked; no key or API call is needed."""
import json
import unittest
from unittest.mock import MagicMock, patch

import pandas as pd
from fastapi.testclient import TestClient

from backend.main import app
from backend.schemas import HeartInputs
from backend.services.prediction import load_bundle, make_model_row

PROFILE = dict(
    age=53, sex="Female", bmi=28.0, smoking_status="Never", sleep_hours=7.0,
    stress_level=6, diabetes=False, hypertension=False, family_history=False,
    previous_heart_event=False, resting_bp=141, cholesterol=218, max_heart_rate=174,
    resting_ecg="Normal", exercise_angina=False, st_depression=1.1,
    st_slope="Upsloping", hrv_score=53.0,
)


class ApiChecks(unittest.TestCase):
    def setUp(self):
        self.client = self.enterContext(TestClient(app))

    def test_derived_boundaries_match_notebook(self):
        for age in [29, 40, 41, 50, 51, 60, 61, 70, 71, 80]:
            for bmi in [15, 18.5, 18.6, 25, 25.1, 30, 30.1, 54.6]:
                row = make_model_row(HeartInputs(**(PROFILE | {"age": age, "bmi": bmi})))
                age_group = pd.cut([age], [0, 40, 50, 60, 70, 100], labels=["under40", "40s", "50s", "60s", "70plus"])[0]
                bmi_group = pd.cut([bmi], [0, 18.5, 25, 30, 100], labels=["underweight", "normal", "overweight", "obese"])[0]
                self.assertEqual(row["age_group"], age_group)
                self.assertEqual(row["bmi_category"], bmi_group)

    def test_prediction_matches_saved_pipeline(self):
        bundle = load_bundle()
        for changes in [{}, {"age": 80, "previous_heart_event": True, "diabetes": True}, {"age": 29, "bmi": 18.5}]:
            profile = PROFILE | changes
            frame = pd.DataFrame([profile])
            for name in ["diabetes", "hypertension", "family_history", "previous_heart_event", "exercise_angina"]:
                frame[name] = frame[name].astype(int)
            frame["age_group"] = pd.cut(frame.age, [0, 40, 50, 60, 70, 100], labels=["under40", "40s", "50s", "60s", "70plus"]).astype(str)
            frame["bmi_category"] = pd.cut(frame.bmi, [0, 18.5, 25, 30, 100], labels=["underweight", "normal", "overweight", "obese"]).astype(str)
            expected = float(bundle["model"].predict_proba(frame[bundle["columns"]])[0, 1])
            response = self.client.post("/api/predict", json=profile)
            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json(), {"probability": expected, "threshold": bundle["threshold"], "risk_label": "High risk" if expected >= bundle["threshold"] else "Lower risk"})

    def test_invalid_inputs_and_untrusted_score_are_rejected(self):
        for invalid in [{}, PROFILE | {"age": 28}, PROFILE | {"age": 53.5}, PROFILE | {"sex": "Unknown"}, PROFILE | {"bmi": 55}, PROFILE | {"diabetes": "yes"}, PROFILE | {"probability": 0.99}]:
            self.assertEqual(self.client.post("/api/predict", json=invalid).status_code, 422)

    def test_explanation_requires_consent(self):
        with patch("backend.main.explain") as explain:
            response = self.client.post("/api/explain", json={"inputs": PROFILE, "consent": False})
            self.assertEqual(response.status_code, 400)
            explain.assert_not_called()

    def test_mocked_gemini_payload_and_failures(self):
        expected = self.client.post("/api/predict", json=PROFILE).json()
        fake = MagicMock()
        fake.__enter__.return_value = fake
        fake.models.generate_content.return_value.text = json.dumps({"meaning": "Educational estimate from synthetic data.", "relevant_factors": ["Age is a global model association."], "questions_for_professional": ["What do these factors mean?"]})
        with patch("backend.services.gemini.dotenv_values", return_value={"GEMINI_API_KEY": "fictional-test-key"}), patch("backend.services.gemini.genai.Client", return_value=fake):
            response = self.client.post("/api/explain", json={"inputs": PROFILE, "consent": True})
            self.assertEqual(response.status_code, 200)
            sent = json.loads(fake.models.generate_content.call_args.kwargs["contents"])
            self.assertEqual(len(sent["fictional_inputs"]), 18)
            self.assertEqual(sent["model_probability"], expected["probability"])
            fake.models.generate_content.side_effect = RuntimeError("SECRET_MUST_NOT_LEAK")
            failed = self.client.post("/api/explain", json={"inputs": PROFILE, "consent": True})
            self.assertEqual(failed.status_code, 503)
            self.assertNotIn("SECRET_MUST_NOT_LEAK", failed.text)
        with patch("backend.services.gemini.dotenv_values", return_value={}):
            self.assertEqual(self.client.post("/api/explain", json={"inputs": PROFILE, "consent": True}).status_code, 503)
        self.assertEqual(self.client.post("/api/predict", json=PROFILE).json(), expected)


if __name__ == "__main__":
    unittest.main()
