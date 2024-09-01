import random
import json
import torch
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize
from gemini_integration import gemini_response
from spellchecker import SpellChecker
from fuzzywuzzy import process

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

with open('intents.json', 'r') as json_data:
    intents = json.load(json_data)

FILE = "data.pth"
data = torch.load(FILE)

input_size = data["input_size"]
hidden_size = data["hidden_size"]
output_size = data["output_size"]
all_words = data['all_words']
tags = data['tags']
model_state = data["model_state"]

model = NeuralNet(input_size, hidden_size, output_size).to(device)
model.load_state_dict(model_state)
model.eval()

spell = SpellChecker()

bot_name = "Play2Earn.ai Bot"

def correct_sentence(sentence):
    corrected_sentence = []
    for word in sentence:
        corrected_word = spell.correction(word)
        if corrected_word not in all_words:
            # Use fuzzy matching if the corrected word is not in vocabulary
            corrected_word = process.extractOne(word, all_words)[0]
        corrected_sentence.append(corrected_word)
    return corrected_sentence

def get_response(msg):
    sentence = tokenize(msg)
    corrected_sentence = correct_sentence(sentence)
    X = bag_of_words(corrected_sentence, all_words)
    X = X.reshape(1, X.shape[0])
    X = torch.from_numpy(X).to(device)

    output = model(X)
    _, predicted = torch.max(output, dim=1)

    tag = tags[predicted.item()]

    probs = torch.softmax(output, dim=1)
    prob = probs[0][predicted.item()]
    if prob.item() > 0.999:
        for intent in intents['intents']:
            if tag == intent["tag"]:
                return random.choice(intent['responses'])

    # Fallback to Gemini model
    return gemini_response(msg)

if __name__ == "__main__":
    print("Let's chat! (type 'quit' to exit)")
    while True:
        sentence = input("You: ")
        if sentence == "quit":
            break

        resp = get_response(sentence)
        print(resp)
