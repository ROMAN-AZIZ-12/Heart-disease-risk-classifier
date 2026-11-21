from functools import lru_cache
from pathlib import Path

import joblib
import pandas as pd

from backend.schemas import HeartInputs, Prediction

PROJECT_DIR = Path(__file__).resolve().parents[2]
BINARY_COLUMNS = (
    "diabetes", "hypertension", "family_history",
    "previous_heart_event", "exercise_angina",
)


@lru_cache(maxsize=1)
def load_bundle():
    return joblib.load(PROJECT_DIR / "heart_model_18_features.pkl")


def make_model_row(inputs: HeartInputs) -> dict:
    row = inputs.model_dump()
    for name in BINARY_COLUMNS:
        row[name] = int(row[name])

    # Match the notebook's right-inclusive pd.cut boundaries.
    age = inputs.age
    if age <= 40:
        row["age_group"] = "under40"
    elif age <= 50:
        row["age_group"] = "40s"
    elif age <= 60:
        row["age_group"] = "50s"
    elif age <= 70:
        row["age_group"] = "60s"
    else:
        row["age_group"] = "70plus"

    bmi = inputs.bmi
    if bmi <= 18.5:
        row["bmi_category"] = "underweight"
    elif bmi <= 25:
        row["bmi_category"] = "normal"
    elif bmi <= 30:
        row["bmi_category"] = "overweight"
    else:
        row["bmi_category"] = "obese"
    return row


def predict(inputs: HeartInputs) -> Prediction:
    bundle = load_bundle()
    frame = pd.DataFrame([make_model_row(inputs)])[bundle["columns"]]
    probability = float(bundle["model"].predict_proba(frame)[0, 1])
    threshold = float(bundle["threshold"])
    return Prediction(
        probability=probability,
        risk_label="High risk" if probability >= threshold else "Lower risk",
        threshold=threshold,
    )
