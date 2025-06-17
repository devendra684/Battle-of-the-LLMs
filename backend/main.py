from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
from openai import OpenAI
from transformers import pipeline
import os
from dotenv import load_dotenv
import json
import pandas as pd
import plotly.express as px
import plotly.io as pio

# Load environment variables
load_dotenv()

app = FastAPI(title="LLM Summarizer Showdown")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models configuration
MODELS = {
    "openai": ["gpt-3.5-turbo", "gpt-4"],
    "huggingface": ["facebook/bart-large-cnn", "google/pegasus-xsum", "mistralai/Mistral-7B-v0.1"]
}

# Request models
class SummaryRequest(BaseModel):
    text: str
    model1: str
    model2: str

class RatingRequest(BaseModel):
    model_name: str
    clarity: int
    accuracy: int
    conciseness: int
    preference: bool

# In-memory storage for ratings
ratings = []

@app.get("/api/models")
async def get_models():
    return {"models": MODELS}

@app.post("/api/summarize")
async def generate_summary(request: SummaryRequest):
    summaries = {}
    
    try:
        # Generate summary from first model
        if request.model1 in MODELS["openai"]:
            response = client.chat.completions.create(
                model=request.model1,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes text concisely."},
                    {"role": "user", "content": f"Please summarize the following text concisely:\n\n{request.text}"}
                ]
            )
            summaries[request.model1] = response.choices[0].message.content
        else:
            # Use HuggingFace model
            summarizer = pipeline("summarization", model=request.model1)
            summary = summarizer(request.text, max_length=130, min_length=30, do_sample=False)
            summaries[request.model1] = summary[0]['summary_text']
        
        # Generate summary from second model
        if request.model2 in MODELS["openai"]:
            response = client.chat.completions.create(
                model=request.model2,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant that summarizes text concisely."},
                    {"role": "user", "content": f"Please summarize the following text concisely:\n\n{request.text}"}
                ]
            )
            summaries[request.model2] = response.choices[0].message.content
        else:
            # Use HuggingFace model
            summarizer = pipeline("summarization", model=request.model2)
            summary = summarizer(request.text, max_length=130, min_length=30, do_sample=False)
            summaries[request.model2] = summary[0]['summary_text']
            
        return {"summaries": summaries}
    except Exception as e:
        print(f"Error: {str(e)}")  # Add logging
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/rate")
async def rate_summary(rating: RatingRequest):
    try:
        rating_dict = rating.dict()
        ratings.append(rating_dict)
        return {"status": "success", "message": "Rating saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ratings")
async def get_ratings():
    try:
        if not ratings:
            return {"ratings": [], "message": "No ratings yet"}
            
        df = pd.DataFrame(ratings)
        # Convert to JSON-serializable format
        return {
            "ratings": df.to_dict(orient='records'),
            "stats": {
                "total_ratings": len(ratings),
                "avg_clarity": df['clarity'].mean(),
                "avg_accuracy": df['accuracy'].mean(),
                "avg_conciseness": df['conciseness'].mean(),
                "preferred_model": df['model_name'].mode()[0] if not df.empty else None
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
