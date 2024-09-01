import sqlite3

def create_annotation_db():
    conn = sqlite3.connect('annotation.db')
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sentences (
        id INTEGER PRIMARY KEY,
        level INTEGER NOT NULL,
        sentence TEXT NOT NULL
    )
    ''')

    sentences = [
        (1, 'Apple Inc. is an American multinational technology company headquartered in Cupertino, California.'),
        (2, 'Yesterday, the European Union allocated €10 million for rebuilding the Notre Dame Cathedral. The new cybersecurity law was enacted at 2 PM, ensuring data protection for all citizens.'),
        (3, 'On Tuesday, the United Nations declared a state of emergency, allocating $5 million to aid the refugees in Syria. The Eiffel Tower in Paris will be closed for renovations. The new healthcare bill, known as the Health and Care Act 2024, was signed into law by President Biden at 3 PM.'),
        (4, 'The Federal Reserve announced an interest rate hike yesterday, impacting the financial markets significantly. Apple Inc. launched the new iPhone 15 in San Francisco, California. Elon Musk\'s SpaceX successfully completed a mission to the International Space Station.'),
        (5, 'Google, headquartered in Mountain View, California, unveiled its latest AI technology. The World Health Organization declared a global health emergency due to the new virus outbreak. Amazon announced a new partnership with the United Nations to deliver aid to remote areas.'),
        (6, 'Microsoft, based in Redmond, Washington, reported a significant increase in quarterly profits. The European Space Agency launched a new satellite from French Guiana. The International Monetary Fund released its global economic outlook report, highlighting growth in developing countries.'),
        (7, 'Tesla, led by CEO Elon Musk, announced the opening of a new Gigafactory in Berlin, Germany. The United Nations Security Council held an emergency meeting to address the escalating conflict in the Middle East. The Nobel Prize in Physics was awarded to researchers from MIT for their groundbreaking work in quantum mechanics.'),
        (8, 'IBM, headquartered in Armonk, New York, revealed its latest advancements in quantum computing. The World Bank approved a $500 million loan to support infrastructure development in Africa. NASA\'s Mars Rover sent back new images from the red planet, providing valuable data for future missions.'),
        (9, 'The United States Senate passed a comprehensive climate change bill aimed at reducing carbon emissions. The European Union implemented new data protection regulations to safeguard citizens\' privacy. The International Olympic Committee announced the host city for the next Summer Games.'),
        (10, 'The Federal Communications Commission introduced new regulations to improve internet access in rural areas. The United Nations General Assembly adopted a resolution to promote global peace and security. The World Health Organization launched a new initiative to combat antibiotic resistance.'),
    ]

    cursor.executemany('INSERT INTO sentences (level, sentence) VALUES (?, ?)', sentences)
    conn.commit()
    conn.close()

if __name__ == "__main__":
    create_annotation_db()
