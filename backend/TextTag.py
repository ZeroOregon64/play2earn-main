import spacy
import json
import string
import sqlite3

def load_model():
    return spacy.load("en_core_web_sm")

def extract_company_names():
    conn = sqlite3.connect('annotation.db')
    cursor = conn.cursor()

    cursor.execute('SELECT sentence FROM sentences')
    sentences = cursor.fetchall()

    company_names = set()

    # Common company suffixes to help identify company names
    company_suffixes = ['Inc.', 'Ltd.', 'Corp.', 'LLC', 'GmbH', 'S.A.', 'Pvt. Ltd.', 'Co.']

    for (sentence,) in sentences:
        for suffix in company_suffixes:
            # Basic pattern: any word followed by a company suffix is likely a company name
            words = sentence.split()
            for i, word in enumerate(words):
                if word.endswith(suffix) and i > 0:
                    # Join previous words that are likely part of the company name
                    company_name = ' '.join(words[i-1:i+1]).strip(string.punctuation)
                    company_names.add(company_name)

    conn.close()

    # Explicitly add known company names that might not be detected automatically
    known_companies = ['Apple Inc.', 'SpaceX', 'Google', 'Amazon', 'Microsoft', 'Tesla', 'IBM', 'NASA']
    company_names.update(known_companies)

    return company_names

def get_predicted_tags(sentence):
    nlp = load_model()
    doc = nlp(sentence)
    predicted_tags = []

    # Get company names from the database
    company_names = extract_company_names()

    # Create a mapping for canonical company names
    canonical_company_names = {name.strip(string.punctuation): name for name in company_names}

    # Set to track added canonical company names
    added_companies = set()

    # Add company names to predicted tags as ORG
    for company_name in company_names:
        company_name_clean = company_name.strip(string.punctuation)
        if company_name_clean in sentence and company_name_clean not in added_companies:
            predicted_tags.append({
                'key': company_name,
                'tag': 'ORG'
            })
            added_companies.add(company_name_clean)

    # Use SpaCy's NER
    for ent in doc.ents:
        entity_name = ent.text.strip(string.punctuation)
        entity_name_clean = entity_name.strip(string.punctuation)

        # If the entity is already recognized as a company, skip it
        if entity_name_clean in canonical_company_names:
            continue

        predicted_tags.append({
            'key': entity_name,
            'tag': ent.label_
        })

    # Set of words from entities, stripping trailing punctuation
    predicted_words = set(ent.text.strip(string.punctuation) for ent in doc.ents)

    # Use SpaCy's tokenization to get all words, stripping trailing punctuation
    all_words = set(token.text.strip(string.punctuation) for token in doc)

    # Calculate undefined words
    undefined_words = all_words - predicted_words

    for word in undefined_words:
        # Ensure no word from company names gets marked as undefined
        if word not in canonical_company_names:
            predicted_tags.append({
                'key': word,
                'tag': 'undefined'
            })

    return predicted_tags


if __name__ == "__main__":
    import sys
    input_sentence = sys.argv[1]
    predicted_tags = get_predicted_tags(input_sentence)
    print(json.dumps(predicted_tags))
