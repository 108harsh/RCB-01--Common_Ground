import google.generativeai as genai
import json
from config import config

genai.configure(api_key=config.GEMINI_API_KEY)

model = genai.GenerativeModel('gemini-2.5-flash', generation_config={"response_mime_type": "application/json"})
streaming_model = genai.GenerativeModel('gemini-2.5-flash')

async def generate_json(prompt: str) -> dict:
    try:
        response = model.generate_content(prompt)
        return json.loads(response.text)
    except Exception as e:
        print(f"Error calling Gemini: {e}")
        # Return fallback json to not crash
        return {"error": str(e)}

async def generate_stream(prompt: str):
    response = streaming_model.generate_content(prompt, stream=True)
    for chunk in response:
        yield chunk.text
