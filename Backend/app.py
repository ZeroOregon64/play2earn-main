# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import MarianTokenizer, MarianMTModel
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# Load the tokenizer and model
model_path = 'model/french_to_english_translation_model'
tokenizer_path = 'model/french_to_english_tokenizer'

try:
    tokenizer = MarianTokenizer.from_pretrained(tokenizer_path)
    model = MarianMTModel.from_pretrained(model_path)
    print("Model and tokenizer loaded successfully.")
except Exception as e:
    print(f"Error loading model or tokenizer: {e}")
    exit()

# Example French sentences categorized by level
texts = {
    1: [
        {"french": "Bonjour", "english": "Hello"},
        {"french": "Au revoir", "english": "Goodbye"},
        {"french": "S'il vous plaît", "english": "Please"},
        {"french": "Merci", "english": "Thank you"},
        {"french": "Oui", "english": "Yes"},
        {"french": "Non", "english": "No"},
        {"french": "Excusez-moi", "english": "Excuse me"},
        {"french": "Je suis désolé", "english": "I am sorry"},
        {"french": "Pouvez-vous m'aider?", "english": "Can you help me?"},
        {"french": "Je ne comprends pas", "english": "I don't understand"},
    ],
    2: [
        {"french": "Je suis heureux", "english": "I am happy"},
        {"french": "Elle est mon amie", "english": "She is my friend"},
        {"french": "Nous allons au marché", "english": "We are going to the market"},
        {"french": "Il aime lire des livres", "english": "He likes to read books"},
        {"french": "Le temps est agréable aujourd'hui", "english": "The weather is nice today"},
        {"french": "Il y a beaucoup de monde ici", "english": "There are a lot of people here"},
        {"french": "Je vais à l'école tous les jours", "english": "I go to school every day"},
        {"french": "Nous avons mangé au restaurant hier", "english": "We ate at the restaurant yesterday"},
        {"french": "Ils jouent à des jeux de société", "english": "They are playing board games"},
        {"french": "Elle est très gentille", "english": "She is very kind"},
    ],
    3: [
        {"french": "J'ai besoin d'aide avec mes devoirs", "english": "I need help with my homework"},
        {"french": "Ils jouent dans le parc", "english": "They are playing in the park"},
        {"french": "Pouvez-vous me passer le sel, s'il vous plaît?", "english": "Can you pass me the salt, please?"},
        {"french": "Le chat est sous la table", "english": "The cat is under the table"},
        {"french": "Nous allons rendre visite à nos grands-parents ce week-end", "english": "We will visit our grandparents this weekend"},
        {"french": "Il pleut beaucoup aujourd'hui", "english": "It is raining a lot today"},
        {"french": "Je dois finir ce projet avant demain", "english": "I have to finish this project by tomorrow"},
        {"french": "Elle a acheté un nouveau téléphone", "english": "She bought a new phone"},
        {"french": "Nous avons vu un film intéressant hier soir", "english": "We watched an interesting movie last night"},
        {"french": "Le repas était délicieux", "english": "The meal was delicious"},
    ],
    4: [
        {"french": "Je voudrais commander un café", "english": "I would like to order a coffee"},
        {"french": "Il travaille dans une entreprise de logiciels", "english": "He works at a software company"},
        {"french": "Le film commence à 19h", "english": "The movie starts at 7 PM"},
        {"french": "Pouvez-vous recommander un bon restaurant?", "english": "Can you recommend a good restaurant?"},
        {"french": "Elle apprend l'espagnol depuis deux ans", "english": "She has been learning Spanish for two years"},
        {"french": "Le train part à 8h30", "english": "The train leaves at 8:30"},
        {"french": "Nous devons réserver les billets à l'avance", "english": "We need to book the tickets in advance"},
        {"french": "Ils ont déménagé dans une nouvelle maison", "english": "They moved to a new house"},
        {"french": "Je vais au gymnase trois fois par semaine", "english": "I go to the gym three times a week"},
        {"french": "La réunion a été annulée", "english": "The meeting was canceled"},
    ],
    5: [
        {"french": "Je prévois un voyage en Espagne l'année prochaine", "english": "I am planning a trip to Spain next year"},
        {"french": "La conférence se tiendra à l'université", "english": "The conference will be held at the university"},
        {"french": "Il a demandé si vous participeriez à la réunion", "english": "He asked if you would join the meeting"},
        {"french": "Nous devrions commencer à préparer la présentation", "english": "We should start preparing for the presentation"},
        {"french": "Le livre que vous m'avez prêté était très intéressant", "english": "The book you lent me was very interesting"},
        {"french": "Les nouvelles directives entreront en vigueur le mois prochain", "english": "The new guidelines will come into effect next month"},
        {"french": "Il est essentiel de respecter les délais de livraison", "english": "It is essential to meet the delivery deadlines"},
        {"french": "La campagne publicitaire sera lancée la semaine prochaine", "english": "The advertising campaign will be launched next week"},
        {"french": "Je dois préparer un rapport détaillé pour vendredi", "english": "I need to prepare a detailed report by Friday"},
        {"french": "Le projet a nécessité plusieurs mois de recherche", "english": "The project required several months of research"},
    ],
    6: [
        {"french": "La nouvelle politique sera mise en œuvre le mois prochain", "english": "The new policy will be implemented next month"},
        {"french": "Elle a été promue gestionnaire la semaine dernière", "english": "She was promoted to manager last week"},
        {"french": "Ils travaillent sur ce projet depuis plusieurs mois", "english": "They have been working on this project for several months"},
        {"french": "L'entreprise étend ses opérations à l'international", "english": "The company is expanding its operations internationally"},
        {"french": "Il a promis de finir le rapport pour vendredi", "english": "He promised to finish the report by Friday"},
        {"french": "La stratégie de marketing doit être révisée avant la fin du trimestre", "english": "The marketing strategy needs to be revised before the end of the quarter"},
        {"french": "Nous avons organisé une séance de formation pour les nouveaux employés", "english": "We organized a training session for new employees"},
        {"french": "L'équipe a présenté ses résultats lors de la réunion annuelle", "english": "The team presented its results at the annual meeting"},
        {"french": "Le budget pour le projet a été approuvé par la direction", "english": "The budget for the project was approved by management"},
        {"french": "Des améliorations sont nécessaires pour le produit avant son lancement", "english": "Improvements are needed for the product before its launch"},
    ],
    7: [
        {"french": "Nous devons réviser notre stratégie marketing pour le prochain trimestre", "english": "We need to revise our marketing strategy for the upcoming quarter"},
        {"french": "L'équipe collabore avec des partenaires internationaux sur le nouveau projet", "english": "The team is collaborating with international partners on the new project"},
        {"french": "Elle a une compréhension approfondie des marchés financiers", "english": "She has a deep understanding of the financial markets"},
        {"french": "L'événement aura lieu au centre de congrès en centre-ville", "english": "The event will take place at the convention center downtown"},
        {"french": "La nouvelle mise à jour logicielle inclut plusieurs fonctionnalités importantes", "english": "The new software update includes several important features"},
        {"french": "Les résultats de l'enquête ont été publiés aujourd'hui", "english": "The survey results were published today"},
        {"french": "Nous prévoyons une augmentation des ventes pour le prochain trimestre", "english": "We are forecasting an increase in sales for the next quarter"},
        {"french": "L'analyse des données a révélé des tendances intéressantes", "english": "The data analysis revealed interesting trends"},
        {"french": "La nouvelle politique de l'entreprise vise à améliorer la transparence", "english": "The new company policy aims to improve transparency"},
        {"french": "Le rapport final sera soumis à la fin du mois", "english": "The final report will be submitted by the end of the month"},
    ],
    8: [
        {"french": "Les récents changements dans les régulations ont impacté nos opérations commerciales", "english": "The recent changes in the regulations have impacted our business operations"},
        {"french": "Nous négocions un nouveau contrat avec nos fournisseurs pour de meilleures conditions", "english": "We are negotiating a new contract with our suppliers for better terms"},
        {"french": "L'étude explore les effets du changement climatique sur l'agriculture", "english": "The study explores the effects of climate change on agriculture"},
        {"french": "La nouvelle politique vise à améliorer la satisfaction et la productivité des employés", "english": "The new policy aims to enhance employee satisfaction and productivity"},
        {"french": "L'organisation lance une campagne pour sensibiliser aux problèmes environnementaux", "english": "The organization is launching a campaign to raise awareness about environmental issues"},
        {"french": "Les avancées technologiques influencent les tendances du marché", "english": "Technological advancements are influencing market trends"},
        {"french": "Le gouvernement met en œuvre des initiatives pour promouvoir l'innovation", "english": "The government is implementing initiatives to promote innovation"},
        {"french": "La collaboration entre les entreprises et les universités est cruciale pour la recherche", "english": "Collaboration between businesses and universities is crucial for research"},
        {"french": "L'impact des politiques environnementales sur les entreprises est significatif", "english": "The impact of environmental policies on businesses is significant"},
        {"french": "Les entreprises adoptent des pratiques plus durables pour réduire leur empreinte carbone", "english": "Companies are adopting more sustainable practices to reduce their carbon footprint"},
    ],
    9: [
        {"french": "Le gouvernement met en œuvre des mesures pour stimuler la croissance économique et l'innovation", "english": "The government is implementing measures to boost economic growth and innovation"},
        {"french": "L'équipe de recherche développe de nouvelles technologies pour relever les défis mondiaux de la santé", "english": "The research team is developing new technologies to address global health challenges"},
        {"french": "Nous analysons l'impact des politiques économiques récentes sur les petites entreprises", "english": "We are analyzing the impact of recent economic policies on small businesses"},
        {"french": "L'initiative vise à améliorer l'accès à l'éducation et aux soins de santé dans les communautés mal desservies", "english": "The initiative aims to improve access to education and healthcare in underserved communities"},
        {"french": "Les objectifs de durabilité de l'entreprise se concentrent sur la réduction des émissions de carbone et l'augmentation de l'utilisation des énergies renouvelables", "english": "The company's sustainability goals focus on reducing carbon emissions and increasing renewable energy use"},
        {"french": "Les nouvelles stratégies de développement durable sont mises en place pour réduire les déchets", "english": "New sustainable development strategies are being implemented to reduce waste"},
        {"french": "Les investissements dans l'éducation technologique favorisent l'innovation", "english": "Investments in technological education foster innovation"},
        {"french": "Les politiques de soutien aux startups stimulent la croissance économique", "english": "Support policies for startups stimulate economic growth"},
        {"french": "La recherche sur les énergies renouvelables est cruciale pour l'avenir", "english": "Research on renewable energy is crucial for the future"},
        {"french": "L'intégration des technologies vertes dans les entreprises est en augmentation", "english": "The integration of green technologies in businesses is increasing"},
    ],
    10: [
        {"french": "Le partenariat stratégique entre les deux organisations devrait stimuler l'innovation et la croissance dans l'industrie", "english": "The strategic partnership between the two organizations is expected to drive innovation and growth in the industry"},
        {"french": "Le projet de recherche avancé vise à développer des solutions durables pour les problèmes mondiaux de rareté de l'eau", "english": "The advanced research project aims to develop sustainable solutions for global water scarcity issues"},
        {"french": "L'analyse complète fournit des informations sur les effets des avancées technologiques sur les marchés du travail et les économies", "english": "The comprehensive analysis provides insights into the effects of technological advancements on job markets and economies"},
        {"french": "Le nouveau cadre définit des stratégies pour améliorer la coopération internationale et la résolution des conflits", "english": "The new framework outlines strategies for enhancing international cooperation and conflict resolution"},
        {"french": "L'effort collaboratif entre les scientifiques, les décideurs et les communautés vise à lutter contre le changement climatique à l'échelle mondiale", "english": "The collaborative effort between scientists, policymakers, and communities aims to tackle climate change on a global scale"},
        {"french": "La création de partenariats public-privé favorise l'innovation dans les infrastructures", "english": "The creation of public-private partnerships fosters innovation in infrastructure"},
        {"french": "Les initiatives mondiales visent à réduire les inégalités économiques", "english": "Global initiatives aim to reduce economic inequalities"},
        {"french": "Les politiques de soutien à la recherche scientifique encouragent les découvertes révolutionnaires", "english": "Policies supporting scientific research encourage groundbreaking discoveries"},
        {"french": "Les stratégies de développement durable intègrent des solutions pour la gestion des ressources naturelles", "english": "Sustainable development strategies include solutions for natural resource management"},
        {"french": "Les collaborations internationales sur les technologies de l'information facilitent la diffusion des connaissances", "english": "International collaborations on information technology facilitate knowledge sharing"},
    ],
}

# Track user progress and hearts
user_progress = {}
user_hearts = {}
user_shuffled_texts = {}

# Endpoint to generate paragraph
@app.route('/generate_paragraph', methods=['GET'])
def generate_paragraph():
    level = request.args.get('level', '1')
    user_id = request.args.get('user_id', 'default')  # Unique user identifier
    try:
        level = int(level)
        if level < 1 or level > 10:
            return jsonify({'error': 'Invalid level. Choose a number between 1 and 10.'}), 400

        # Initialize user progress if not already
        if user_id not in user_progress:
            user_progress[user_id] = {i: 0 for i in range(1, 11)}
            user_hearts[user_id] = {
                'hearts': 5,
                'last_lost': None
            }

        # Shuffle the questions for this level if not already shuffled for this session
        if user_id not in user_shuffled_texts or level not in user_shuffled_texts[user_id]:
            user_shuffled_texts.setdefault(user_id, {})[level] = random.sample(texts[level], len(texts[level]))
            
        user_progress_for_level = user_progress[user_id].get(level, 0)
        user_hearts_data = user_hearts[user_id]

        # Check for heart recharge
        if user_hearts_data['hearts'] < 5 and user_hearts_data['last_lost']:
            time_since_loss = datetime.now() - user_hearts_data['last_lost']
            if time_since_loss >= timedelta(hours=24):
                user_hearts[user_id]['hearts'] = 5

        if user_progress_for_level >= len(texts[level]):
            return jsonify({'level_completed': True, 'message': f'Level {level} completed!'}), 200

        # Select the next question from the shuffled list
        selected_text = user_shuffled_texts[user_id][level][user_progress_for_level]
        french_sentence = selected_text['french']
        english_sentence = selected_text['english']
        
        return jsonify({
            'french': french_sentence,
            'english': english_sentence,
            'next_index': user_progress_for_level + 1,
            'hearts': user_hearts_data['hearts']
        })
    except ValueError:
        return jsonify({'error': 'Invalid level format. Provide a number between 1 and 10.'}), 400
    except Exception as e:
        print(f"Error in /generate_paragraph: {str(e)}")
        return jsonify({'error': f"Failed to generate paragraph: {str(e)}"}), 500

# Endpoint to verify user translation
@app.route('/verify', methods=['POST'])
def verify():
    data = request.json
    user_translation = data.get('user_translation', '').strip().lower()
    correct_translation = data.get('correct_translation', '').strip().lower()
    user_id = data.get('user_id', 'default')  # Unique user identifier
    level = int(data.get('level', 1))

    if not user_translation or not correct_translation:
        return jsonify({'error': 'User translation or correct translation is missing.'}), 400

    try:
        is_correct = user_translation == correct_translation
        reward = 10 if is_correct else 0

        # Update user progress
        if user_id in user_progress and is_correct:
            user_progress[user_id][level] += 1

        # Update hearts if incorrect
        if not is_correct:
            if user_hearts[user_id]['hearts'] > 0:
                user_hearts[user_id]['hearts'] -= 1
                user_hearts[user_id]['last_lost'] = datetime.now()

        return jsonify({
            'is_correct': is_correct,
            'reward': reward,
            'next_index': user_progress[user_id][level],
            'hearts': user_hearts[user_id]['hearts']
        })
    except Exception as e:
        print(f"Error in /verify: {str(e)}")
        return jsonify({'error': f"Failed to verify translation: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
