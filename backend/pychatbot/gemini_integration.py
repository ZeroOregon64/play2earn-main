import google.generativeai as genai
from load_creds import load_creds
from google.generativeai.types import HarmCategory, HarmBlockThreshold

creds = load_creds()

# Configure Generative AI with credentials
genai.configure(credentials=creds)

# Get the tuned model
tuned_model_name = "tunedModels/play2earnai070820242-zxz98qxycwz3"
tuned_model = genai.get_tuned_model(tuned_model_name)

generation_config = {
    "temperature": 0.85,
    "top_p": 1,
    "top_k": 0,
    "max_output_tokens": 2048,
    "response_mime_type": "text/plain",
}

safety_settings = {
    HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
}

model = genai.GenerativeModel(
    model_name=tuned_model_name,
    generation_config=generation_config,
    safety_settings=safety_settings
)

def gemini_response(question):
    question = question.lower().strip()
    response = model.generate_content(question)
    
    if response.candidates[0].finish_reason == 3:
        return "Please refrain from asking irrelevant questions😊"
    else:
        # Debug: Print the response structure
        print(response.candidates[0])
        
        # Extract the text from parts
        parts = response.candidates[0].content.parts
        content = " ".join([part.text for part in parts])
        return content if content else "I am not sure how to respond to that."

