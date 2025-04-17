# CrownKing AI Chatbot

A FastAPI-based AI chatbot using Cache-Augmented Generation with LangGraph.

## Default Models

This application comes with the following pre-configured LLM defaults:

- Groq (Default): `llama-3.3-70b-versatile`
- OpenAI: `gpt-3.5-turbo`
- Gemini: `gemini-1.5-flash`

## Setup

1. Create a virtual environment and activate it:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure the environment:
```bash
copy .env.example .env  # Windows
cp .env.example .env  # Linux/Mac
```

4. Edit the `.env` file with your preferred LLM type and API keys.

## Running the Application

Start the application by navigating to the ai-pipeline directory first:
```bash
cd ai-pipeline
python main.py
```

The API will be available at http://localhost:8000/docs

## API Endpoints

- `/chat`: Send a query to the chatbot
- `/add_sample_document`: Add sample context
- `/reload`: Reload the model with new documents 