# Heart disease prediction project summary

The new results below come from the saved code and outputs in `notebook/AIES_CPP_updated.ipynb`. The older full-feature results come from the previous project summary and are clearly marked. The dataset file is now present at `dataset/heart_disease_prediction_2026.csv`.

## 1. Data and cleaning

- The dataset had 100,000 rows, 25 original feature columns, and one target column, `heart_disease`.
- The positive class had 46,082 rows (46.082%). The classes were close enough in size that SMOTE was not used.
- The notebook found 0 missing values and 0 duplicate rows. Its checked values were within the expected ranges, and all binary columns contained only 0 and 1. No rows were removed.
- The IQR check counted 389 BMI, 260 cholesterol, 257 maximum heart rate, and 1,956 ST depression outliers. These were kept because a statistical outlier is not automatically an invalid patient value.

## 2. Exploration and feature engineering

The notebook plotted the target distribution, numeric histograms, boxplots, category and binary disease rates, a correlation heatmap, and disease rate by age group. Age, hypertension, blood pressure, ST depression, exercise angina, and maximum heart rate showed relationships with the target. Disease rate increased from about 13.4% for ages up to 40 to about 85.6% for ages above 70.

The original notebook created three derived features: `age_group` from age, `bmi_category` from BMI, and `hr_reserve` from maximum heart rate minus average resting heart rate. It dropped `region` because disease rate was about 46% in every region. This gave 27 model columns: 24 raw inputs and 3 derived features.

## 3. Original preprocessing and model comparison

The original pipeline used median imputation and scaling for 12 numeric columns, most-frequent imputation for 6 binary columns, and most-frequent imputation plus one-hot encoding for 9 categorical columns. Preprocessing was inside each model pipeline, so cross-validation did not fit it on validation folds.

The stratified 80/20 split gave 80,000 training rows and 20,000 test rows. The majority-class baseline accuracy on training data was 0.5392.

The following are the **original 27-column notebook results**, using 5-fold cross-validation on the training set:

| Model | Mean CV ROC-AUC | Mean CV accuracy | Mean CV recall |
| --- | ---: | ---: | ---: |
| Logistic Regression | 0.8539 | 0.7729 | 0.7325 |
| Gradient Boosting | 0.8484 | 0.7679 | 0.7212 |
| Random Forest | 0.8389 | 0.7599 | 0.7083 |
| Decision Tree | 0.8072 | 0.7348 | 0.6893 |

Logistic Regression performed best in this run. Its cross-validated training predictions had 9,860 false negatives and 8,309 false positives at the default threshold.

## 4. Original tuning and final test

Grid search chose Logistic Regression with `C=0.1` and no class weighting. Mean CV ROC-AUC stayed at 0.8539, so tuning did not improve it. On out-of-fold training probabilities, the notebook chose a 0.40 threshold: it gave the highest precision among the tested thresholds with recall at least 0.80.

The original final test results were:

| Threshold | ROC-AUC | Accuracy | Precision | Recall | F1 |
| --- | ---: | ---: | ---: | ---: | ---: |
| 0.50 | 0.8545 | 0.7738 | 0.7653 | 0.7342 | 0.7494 |
| 0.40 | 0.8545 | 0.7645 | 0.7143 | 0.8150 | 0.7613 |

At threshold 0.40, there were 1,705 false negatives and 3,004 false positives. Lowering the threshold found more positive cases but caused more false alarms. The saved `extras/heart_model.pkl` contains this original 27-column Logistic Regression pipeline and threshold 0.40.

## 5. Why the input list was reduced

The new notebook removes six raw inputs: `income_level`, `fasting_blood_sugar`, `avg_resting_hr`, `diet_quality`, `alcohol_intake`, and `physical_activity`. Earlier feature-selection work supplied for this project found train CV AUC of about 0.854 with all 24 raw inputs and 0.852 after removing these six. This is a small loss for six fewer questions. Those earlier feature-selection experiments are not cells in the updated notebook.

`hr_reserve` was also removed because it needs `avg_resting_hr`. The model still uses `age_group` and `bmi_category`, calculated from the user's age and BMI with right-inclusive cut points. It has **18 raw inputs plus 2 derived columns = 20 model columns**. The app asks for the 18 raw inputs.

Earlier tests supplied outside the notebook found AUC of 0.825 without clinical tests, 0.821 with 10 easy inputs, 0.823 with those 10 plus blood pressure and cholesterol, and 0.850 with a 17-input set including stress-test results. PCA was rejected because it does not reduce the number of values a user must enter. The current 18-input model still asks for clinical test values.

## 6. New 18-input model comparison

The updated notebook uses the same stratified 80/20 split and 5-fold cross-validation on the training set. The following are its **new saved CV outputs**:

Its preprocessing pipeline imputes and scales 9 numeric columns, imputes 5 binary columns, and imputes and one-hot encodes 6 categorical columns. Preprocessing stays inside each model pipeline.

| Model | Mean CV ROC-AUC | Mean CV accuracy | Mean CV recall |
| --- | ---: | ---: | ---: |
| Logistic Regression | 0.8520 | 0.7722 | 0.7303 |
| CatBoost | 0.8508 | 0.7706 | 0.7299 |
| LightGBM | 0.8479 | 0.7688 | 0.7301 |
| Gradient Boosting | 0.8477 | 0.7684 | 0.7220 |
| Random Forest | 0.8394 | 0.7615 | 0.7120 |
| Decision Tree | 0.8071 | 0.7346 | 0.6883 |

Logistic Regression had the highest mean CV ROC-AUC. The gap to CatBoost was small (0.0012), so the simple Logistic Regression model is a reasonable choice. Its cross-validated training predictions at the default threshold had 9,942 false negatives and 8,278 false positives.

Grid search selected `C=0.3` and `class_weight=None`, with CV AUC still 0.8520. Tuning did not improve the rounded AUC. Out-of-fold training probabilities gave recall 0.813 and precision 0.715 at threshold 0.40. Among the tested thresholds meeting recall at least 0.80, 0.40 had the highest precision.

## 7. New final test and saved model

The updated notebook reports these results on the held-out test set:

| Threshold | ROC-AUC | Accuracy | Precision | Recall | F1 | TN | FP | FN | TP |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 0.50 | 0.8523 | 0.7718 | 0.7630 | 0.7320 | 0.7472 | 8,689 | 2,095 | 2,470 | 6,746 |
| 0.40 | 0.8523 | 0.7636 | 0.7138 | 0.8129 | 0.7601 | 7,780 | 3,004 | 1,724 | 7,492 |

At 0.40, the model misses 746 fewer positive cases than at 0.50, while false alarms increase by 909. Compared with the older full-feature model, test AUC decreased from 0.8545 to 0.8523. The saved `heart_model_18_features.pkl` contains the new fitted Logistic Regression pipeline, its 20 ordered columns, and threshold 0.40. The Streamlit app uses this bundle for predictions.

## 8. Limits

The project brief describes this dataset as synthetic. These scores do not show performance on real patients, and the app is an educational demo, not medical advice. Values are clipped at some range edges, and `previous_heart_event` makes the target interpretation less clear. A real-world version would need patient data, probability calibration, and subgroup checks before clinical use.

## 9. Gemini explanation in the app

The local Logistic Regression model still makes the prediction. After a user confirms the inputs are fictional and presses a separate button, the app sends Gemini the 18 raw inputs, the model probability and risk label, and the saved 0.40 threshold. The prompt also includes the notebook's global Logistic Regression associations. Gemini returns a short explanation of the result, supplied factors to discuss, and general questions for a healthcare professional. It cannot change the model result.

This feature is for fictional demo inputs only. The synthetic-data estimate and Gemini's explanation are educational, not a diagnosis or medical advice. Do not enter real patient information.

## 10. React and FastAPI application

HeartWise now has a React, TypeScript, and Vite frontend styled with Tailwind CSS. The landing page introduces the project, explains its three steps, and shows the actual saved test metrics. The assessment page groups the same 18 inputs into personal details, lifestyle, medical history, and clinical values. It uses a white and light blue layout that adapts to desktop, tablet, and phone screens.

The Python FastAPI backend loads the existing Logistic Regression bundle once. It validates the inputs, calculates the same two derived columns, orders the DataFrame using the bundle, and returns the unchanged probability, label, and threshold. No model was retrained and no ML metrics were changed. The original source is preserved at `extras/App.py`, the notebook is in `notebook/`, and both model files are preserved.

The API provides `/api/health`, `/api/predict`, and `/api/explain`. Gemini still needs separate consent and a button click. Its endpoint calculates the model result on the server instead of accepting a score from the browser. The API key stays in the root `.env`, and the fixed prompt stays in `prompts/gemini_explanation.txt`. Changing inputs clears old results and explanations; outdated request responses are ignored. Local prediction stays available if Gemini fails. There is no chat, patient database, or login system.

See `README.md` for the two Windows PowerShell commands used to run the backend and frontend.
