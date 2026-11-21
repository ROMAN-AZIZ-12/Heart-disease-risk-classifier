# HeartWise

A React and FastAPI university demo for exploring heart-risk estimates with **fictional inputs only**. The model was trained on synthetic data. Predictions and optional Gemini explanations are educational, not medical advice.

## Run the app

The dependencies have been installed in the existing project environment. Keep both terminals open while using the app. Open **http://127.0.0.1:5173** in your browser.

**Terminal 1 — backend (PowerShell):**

```powershell
cd C:\Users\HP\Desktop\AIES_CPP
.\.setup\venv313\Scripts\python.exe -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
```

**Terminal 2 — frontend (PowerShell):**

```powershell
cd C:\Users\HP\Desktop\AIES_CPP\frontend
npm.cmd run dev
```

Press `Ctrl+C` in a terminal to stop its server. If a port is already in use, stop the previous server before starting another one. Use `http://127.0.0.1:8000/docs` for the API documentation.

## Install dependencies again if needed

Use the existing Python environment to preserve the model's scikit-learn version:

```powershell
cd C:\Users\HP\Desktop\AIES_CPP
.\.setup\venv313\Scripts\python.exe -m pip install -r requirements.txt
cd frontend
npm.cmd ci
```

Node.js and npm are required for the frontend. The package lock records the installed dependency versions. To create a frontend production build, run `npm.cmd run build` inside `frontend`. For a local preview of that build, use `npm.cmd run preview` while the backend is running. Development and preview both proxy `/api` to port 8000; a deployed version would need an equivalent reverse proxy.

## Gemini setup

Keep the API key in the existing `.env` at the project root:

```dotenv
GEMINI_API_KEY=your_key_here
```

Replace the placeholder locally. Do not share or commit the real key. No frontend environment variable is needed. The server reads the key only when an explanation is requested.

After calculating an estimate, confirm that the inputs are fictional, check consent, and press **Explain this result with Gemini**. Ordinary page renders do not call Gemini. The existing fixed instructions are loaded from `prompts/gemini_explanation.txt`. An API error leaves the local prediction visible. The configured Gemini model is `gemini-3.5-flash-lite`; account availability and free-tier limits are controlled by Google.

## Project structure

```text
frontend/src/
  pages/          Landing page and assessment workspace
  components/     Navigation, form fields, illustration, results
  lib/            Input definitions, defaults, API calls
  styles/         Tailwind theme and responsive styles
backend/
  main.py         API routes and startup
  schemas.py      Input and response validation
  services/       Saved-model prediction and Gemini requests
  test_api.py     Offline migration checks with mocked Gemini
prompts/          Existing fixed Gemini instructions
notebook/         Preserved training notebook
extras/App.py     Archived Streamlit source
heart_model_18_features.pkl
extras/heart_model.pkl
```

The FastAPI service asks for the same 18 raw inputs, calculates `age_group` and `bmi_category` on the server, orders all 20 columns from the saved bundle, and uses the unchanged threshold. `/api/explain` calculates the model result itself and rejects requests without consent. Input edits clear results and abort pending frontend requests; an already submitted Gemini request may still finish on Google's server, but its outdated response is not displayed.

The frontend keeps the current assessment in memory. There is no patient database or account system. The landing page's metrics come from the saved notebook and are explicitly labeled as synthetic-data test results.

## Offline checks

```powershell
cd C:\Users\HP\Desktop\AIES_CPP
.\.setup\venv313\Scripts\python.exe -m unittest backend.test_api -v
```

These checks cover notebook feature boundaries, exact saved-model probabilities, validation, consent, and Gemini failure handling. They do not run the notebook or send a live Gemini request.

The original Streamlit source is preserved in `extras/App.py`. It is an archive of the previous root-level app; its relative file paths still assume that original location. Use the React/FastAPI launch commands above for the current application.
