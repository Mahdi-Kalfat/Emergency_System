import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

# Charger les données
data = pd.read_csv('diabetes.csv')

# Afficher les colonnes pour vérification (optionnel)
print("Colonnes du dataset :", data.columns.tolist())

# Séparer les variables explicatives et la cible
X = data.drop('Outcome', axis=1)
y = data['Outcome']

# Division en jeu d'entraînement/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Entraînement du modèle
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Évaluation
y_pred = model.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.2f}")

# Sauvegarde du modèle
joblib.dump(model, 'model.joblib')
print("✅ Modèle sauvegardé sous 'model.joblib'")
