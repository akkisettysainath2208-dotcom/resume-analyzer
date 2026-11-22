# AI Resume Analyzer & ATS Score Checker

A beginner-friendly Streamlit prototype matching the assignment:
- Upload a resume PDF
- Paste a job description
- Call the Gemini API
- Show an estimated match score out of 100
- Show matching skills, missing skills/keywords, and five improvement suggestions

## 1. Requirements
- Python 3.10 or newer
- Internet connection
- A Gemini API key from Google AI Studio

## 2. Run on Windows
Open Command Prompt or the VS Code terminal in this folder:

```bash
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

Create `.streamlit/secrets.toml` by copying `.streamlit/secrets.toml.example`, then replace the placeholder with your real key:

```toml
GEMINI_API_KEY = "YOUR_REAL_API_KEY"
```

Start the app:

```bash
streamlit run app.py
```

## 3. Run on macOS / Linux
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `.streamlit/secrets.toml` with your API key (same TOML format as above), then:

```bash
streamlit run app.py
```

## 4. Get a Gemini API key
1. Open Google AI Studio (https://aistudio.google.com/).
2. Sign in and create an API key.
3. Put the key in `.streamlit/secrets.toml`.
4. Never paste the key into `app.py`, upload it to GitHub, or share it publicly.

The default model is `gemini-3.8-flash`. If your account does not have access, change the model in the app's sidebar to a model enabled for your API key.

## 5. Test it
1. Prepare a text-based PDF resume (not just a scanned image).
2. Copy a real job description.
3. Upload the PDF and paste the job description.
4. Click **Analyze my resume**.
5. Check the score, matched skills, missing skills, keyword gaps, and suggestions.

## 6. Deploy for a presentation (optional)
1. Push this project to a GitHub repository, excluding `.streamlit/secrets.toml`.
2. Open Streamlit Community Cloud and create a new app from that repository.
3. Set the main file path to `app.py`.
4. In the app's Advanced settings / Secrets area, add:
   `GEMINI_API_KEY = "YOUR_REAL_API_KEY"`
5. Deploy.

Do not commit the real key. The included `.gitignore` excludes the local secrets file.

## 7. How the prototype works
1. Streamlit receives the PDF and job description.
2. pypdf extracts text from up to 30 PDF pages.
3. The app sends the extracted resume text and job description to Gemini.
4. Gemini returns structured JSON.
5. Streamlit displays the score and feedback.

## Limitations and responsible use
- The score is an AI estimate, not a real ATS score or hiring prediction.
- Different employers use different ATS products and screening rules.
- pypdf cannot read image-only scanned PDFs. OCR the PDF first or use a text-based PDF.
- Resume contents are sent to Google's Gemini API. Do not upload documents unless you are comfortable with that processing.
- This prototype does not save resumes or analysis results to a database.
- Always verify the AI feedback. Never add skills or experience you do not actually have.
