import requests
import json

# Gemini API configuration
API_KEY = "AIzaSyDKv7dyAGykiSW9HWUSM5uJq1rtySDUBe8"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}"

def chat_with_gemini(prompt):
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [
            {
                "parts": [{"text": prompt}]
            }
        ]
    }

    try:
        response = requests.post(API_URL, headers=headers, data=json.dumps(data))
        response_json = response.json()

        # Extract and return the AI's response
        if "candidates" in response_json:
            return response_json["candidates"][0]["content"]["parts"][0]["text"]
        else:
            return f"Error: {response_json}"
    
    except Exception as e:
        return f"Request failed: {e}"

if __name__ == "__main__":
    prompt = input("You: ")
    response = chat_with_gemini(prompt)
    print(f"Gemini: {response}") 