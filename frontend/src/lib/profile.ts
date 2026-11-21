export interface Profile {
  age: number; sex: 'Female' | 'Male'; bmi: number
  smoking_status: 'Never' | 'Former' | 'Current'; sleep_hours: number; stress_level: number
  diabetes: boolean; hypertension: boolean; family_history: boolean; previous_heart_event: boolean
  resting_bp: number; cholesterol: number; max_heart_rate: number
  resting_ecg: 'Normal' | 'ST-T Abnormality' | 'Left Ventricular Hypertrophy'
  exercise_angina: boolean; st_depression: number; st_slope: 'Upsloping' | 'Flat' | 'Downsloping'; hrv_score: number
}

export type FormValues = { [K in keyof Profile]: Profile[K] extends number ? string : Profile[K] }
export type NumericKey = { [K in keyof Profile]: Profile[K] extends number ? K : never }[keyof Profile]
export type BinaryKey = { [K in keyof Profile]: Profile[K] extends boolean ? K : never }[keyof Profile]

// Defaults, ranges, and category spellings match App.py.
export const defaults: FormValues = {
  age: '53', sex: 'Female', bmi: '28', smoking_status: 'Never', sleep_hours: '7', stress_level: '6',
  diabetes: false, hypertension: false, family_history: false, previous_heart_event: false,
  resting_bp: '141', cholesterol: '218', max_heart_rate: '174', resting_ecg: 'Normal',
  exercise_angina: false, st_depression: '1.1', st_slope: 'Upsloping', hrv_score: '53',
}

export const numericFields: Record<NumericKey, { label: string; min: number; max: number; step: number; unit: string }> = {
  age: { label: 'Age', min: 29, max: 80, step: 1, unit: 'years' },
  bmi: { label: 'Body mass index', min: 15, max: 54.6, step: 0.1, unit: 'BMI' },
  sleep_hours: { label: 'Sleep per night', min: 4, max: 10, step: 0.1, unit: 'hours' },
  stress_level: { label: 'Stress level', min: 1, max: 10, step: 1, unit: '/ 10' },
  resting_bp: { label: 'Resting blood pressure', min: 80, max: 200, step: 1, unit: 'mmHg' },
  cholesterol: { label: 'Cholesterol', min: 100, max: 400, step: 1, unit: 'mg/dl' },
  max_heart_rate: { label: 'Max heart rate in stress test', min: 107, max: 202, step: 1, unit: 'bpm' },
  st_depression: { label: 'ST depression', min: 0, max: 6.2, step: 0.1, unit: '' },
  hrv_score: { label: 'Heart rate variability', min: 5, max: 100, step: 0.5, unit: 'score' },
}

export function toProfile(values: FormValues): Profile {
  const profile = { ...values } as unknown as Profile
  for (const key of Object.keys(numericFields) as NumericKey[]) profile[key] = Number(values[key])
  return profile
}

export interface Prediction { probability: number; risk_label: 'High risk' | 'Lower risk'; threshold: number }
export interface Explanation { meaning: string; relevant_factors: string[]; questions_for_professional: string[] }
