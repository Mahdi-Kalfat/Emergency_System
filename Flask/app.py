from flask import Flask, request, jsonify
from flask_cors import CORS  # Importez CORS ici
import joblib

app = Flask(__name__)

# Appliquez CORS pour autoriser les requêtes provenant de votre frontend React (localhost:5173)
CORS(app, origins="http://localhost:5173")  # Remplacez par l'URL de votre frontend React si nécessaire

# Charger le modèle préalablement enregistré
model_path = "model.joblib"  # Mettez à jour avec le chemin correct si nécessaire
model = joblib.load(model_path)

@app.route('/predict', methods=['POST'])
def predict():
    # Récupérer les données envoyées dans la requête
    data = request.get_json()  # On attend des données JSON

    # Convertir les données en un format adapté pour le modèle
    input_data = [
        data['Pregnancies'],
        data['Glucose'],
        data['BloodPressure'],
        data['SkinThickness'],
        data['Insulin'],
        data['BMI'],
        data['DiabetesPedigreeFunction'],
        data['Age']
    ]

    # Effectuer la prédiction
    prediction = model.predict([input_data])

    # Retourner la prédiction dans la réponse
    return jsonify({'prediction': int(prediction[0])})

if __name__ == '__main__':
    app.run(debug=True)