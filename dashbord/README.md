# Dashboard Mobilis - Réseau Analytics

Dashboard décisionnel pour le monitoring des performances réseau Mobilis avec visualisations géospatiales et analyses en temps réel.

## 🏗️ Architecture

- **Frontend**: React + Vite avec Recharts et Leaflet
- **Backend**: Node.js + Express
- **Base de données**: MySQL

## 📋 Prérequis

- Node.js (v18+)
- MySQL (v8+)
- Python 3 (pour le script de génération de données)

## 🚀 Installation

### 1. Configuration de la base de données

```bash
# Créer la base de données et les tables
mysql -u root -p < database/schema.sql

# Insérer des données de test
mysql -u root -p < database/seed.sql

# Ou utiliser le script Python pour générer plus de données
cd scripts
python generate_data.py
mysql -u root -p mobilis_dashboard < ../insert_fake_data.sql
```

### 2. Configuration du serveur

```bash
cd server
npm install

# Créer un fichier .env avec les informations de connexion
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=votre_mot_de_passe
# DB_NAME=mobilis_dashboard
# DB_PORT=3306
# PORT=5000
```

### 3. Configuration du client

```bash
cd client
npm install
```

## 🏃 Exécution

### Démarrer le serveur backend

```bash
cd server
node index.js
# Le serveur démarre sur http://localhost:5000
```

### Démarrer le client frontend

```bash
cd client
npm run dev
# L'application démarre sur http://localhost:5173
```

## 📊 Fonctionnalités

- **KPIs en temps réel**: Débit moyen, latence, nombre de tests
- **Carte géospatiale**: Visualisation des tests sur une carte interactive
- **Graphiques de performance**: Tendances temporelles et distribution des technologies
- **Tableau détaillé**: Logs complets de tous les tests avec filtres

## 🔧 Corrections apportées

1. ✅ Ajout des colonnes manquantes dans le schéma (`test_id`, `operator`, `device_type`)
2. ✅ Correction de l'import manquant `Legend` dans Dashboard.jsx
3. ✅ Mise à jour de `seed.sql` pour inclure les nouvelles colonnes
4. ✅ Vérification de la compatibilité MySQL dans le code serveur

## 📁 Structure du projet

```
dashbord/
├── client/              # Application React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── server/              # API Express backend
│   ├── index.js
│   ├── db.js
│   └── package.json
├── database/            # Scripts SQL
│   ├── schema.sql
│   └── seed.sql
├── scripts/             # Scripts utilitaires
│   └── generate_data.py
└── README.md
```

## 🔌 API Endpoints

- `GET /api/data` - Récupère tous les tests de vitesse
- `GET /api/stats` - Récupère les statistiques agrégées

## 🐛 Dépannage

### Erreur de connexion à la base de données
- Vérifiez que MySQL est démarré
- Vérifiez les credentials dans le fichier `.env` du serveur
- Assurez-vous que la base de données `mobilis_dashboard` existe

### Erreur CORS
- Le serveur est configuré avec CORS activé
- Vérifiez que le serveur backend tourne sur le port 5000

### Données manquantes
- Exécutez `seed.sql` ou `insert_fake_data.sql` pour insérer des données de test

