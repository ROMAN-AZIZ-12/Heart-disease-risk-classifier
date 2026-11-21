from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, StrictBool


class HeartInputs(BaseModel):
    """The same 18 raw values accepted by the original Streamlit app."""

    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)

    age: int = Field(ge=29, le=80, strict=True)
    sex: Literal["Female", "Male"]
    bmi: float = Field(ge=15, le=54.6)
    smoking_status: Literal["Never", "Former", "Current"]
    sleep_hours: float = Field(ge=4, le=10)
    stress_level: int = Field(ge=1, le=10, strict=True)
    diabetes: StrictBool
    hypertension: StrictBool
    family_history: StrictBool
    previous_heart_event: StrictBool
    resting_bp: int = Field(ge=80, le=200, strict=True)
    cholesterol: int = Field(ge=100, le=400, strict=True)
    max_heart_rate: int = Field(ge=107, le=202, strict=True)
    resting_ecg: Literal["Normal", "ST-T Abnormality", "Left Ventricular Hypertrophy"]
    exercise_angina: StrictBool
    st_depression: float = Field(ge=0, le=6.2)
    st_slope: Literal["Upsloping", "Flat", "Downsloping"]
    hrv_score: float = Field(ge=5, le=100)


class Prediction(BaseModel):
    probability: float
    risk_label: Literal["High risk", "Lower risk"]
    threshold: float


class ExplainRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    inputs: HeartInputs
    consent: StrictBool


class Explanation(BaseModel):
    meaning: str = Field(min_length=1, max_length=2000)
    relevant_factors: list[str] = Field(min_length=1, max_length=6)
    questions_for_professional: list[str] = Field(min_length=1, max_length=4)
