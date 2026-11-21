from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas import ExplainRequest, Explanation, HeartInputs, Prediction
from backend.services.gemini import ExplanationUnavailable, explain
from backend.services.prediction import load_bundle, predict


@asynccontextmanager
async def lifespan(app: FastAPI):
    load_bundle()  # Reuse the fitted pipeline; no training happens here.
    yield


app = FastAPI(title="HeartWise API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "model": "Logistic Regression"}


@app.post("/api/predict", response_model=Prediction)
def predict_result(inputs: HeartInputs):
    return predict(inputs)


@app.post("/api/explain", response_model=Explanation)
def explain_result(request: ExplainRequest):
    if not request.consent:
        raise HTTPException(400, "Please confirm that the inputs are fictional and consent to sharing them with Gemini.")
    # Always compute the result ourselves, never trust a browser-supplied score.
    result = predict(request.inputs)
    try:
        return explain(request.inputs, result)
    except ExplanationUnavailable as error:
        raise HTTPException(error.status_code, error.message) from None
