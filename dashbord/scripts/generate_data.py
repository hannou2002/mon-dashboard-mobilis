import random
import datetime
import uuid

# Configuration
NUM_RECORDS = 1000  # Nombre de tests à générer
FILENAME = "insert_fake_data.sql"

# Données de référence
OPERATOR = "Mobilis"
WILAYAS = {
    "Alger": {"lat_min": 36.6, "lat_max": 36.8, "lon_min": 2.9, "lon_max": 3.2, "communes": ["Alger-Centre", "Bab Ezzouar", "Kouba", "Hydra"]},
    "Oran": {"lat_min": 35.6, "lat_max": 35.8, "lon_min": -0.7, "lon_max": -0.5, "communes": ["Oran", "Es Senia", "Bir El Djir"]},
    "Constantine": {"lat_min": 36.2, "lat_max": 36.4, "lon_min": 6.5, "lon_max": 6.7, "communes": ["Constantine", "El Khroub", "Hamma Bouziane"]},
    "Ouargla": {"lat_min": 31.9, "lat_max": 32.1, "lon_min": 5.2, "lon_max": 5.4, "communes": ["Ouargla", "Hassi Messaoud"]}
}

NETWORKS = ["3G", "4G", "5G"]
DEVICES = ["Android", "iOS"]

def generate_metrics(network):
    """Génère des métriques réalistes selon le réseau."""
    if network == "3G":
        download = random.uniform(0.5, 15.0)
        upload = random.uniform(0.1, 5.0)
        latency = random.uniform(60, 200)
        signal = random.randint(-110, -80)
    elif network == "4G":
        download = random.uniform(10.0, 100.0)
        upload = random.uniform(5.0, 40.0)
        latency = random.uniform(30, 80)
        signal = random.randint(-100, -70)
    else: # 5G
        download = random.uniform(100.0, 800.0)
        upload = random.uniform(40.0, 100.0)
        latency = random.uniform(10, 30)
        signal = random.randint(-90, -60)
    
    return round(download, 2), round(upload, 2), round(latency, 2), signal

def generate_sql():
    with open(FILENAME, "w", encoding="utf-8") as f:
        f.write("-- Données générées automatiquement pour le dashboard Mobilis\n")
        f.write("INSERT INTO speed_tests (test_id, timestamp, operator, network_type, download_mbps, upload_mbps, latency_ms, signal_strength_dbm, device_type, wilaya, commune, latitude, longitude) VALUES\n")
        
        values_list = []
        for _ in range(NUM_RECORDS):
            test_id = str(uuid.uuid4())
            
            # Temps aléatoire dans les 30 derniers jours
            days_offset = random.randint(0, 30)
            seconds_offset = random.randint(0, 86400)
            timestamp = datetime.datetime.now() - datetime.timedelta(days=days_offset, seconds=seconds_offset)
            ts_str = timestamp.strftime("%Y-%m-%d %H:%M:%S")
            
            # Localisation aléatoire
            wilaya_name = random.choice(list(WILAYAS.keys()))
            w_data = WILAYAS[wilaya_name]
            lat = random.uniform(w_data["lat_min"], w_data["lat_max"])
            lon = random.uniform(w_data["lon_min"], w_data["lon_max"])
            commune = random.choice(w_data["communes"])
            
            # Technologie réseau (pondération : plus de 4G, un peu de 5G, un peu de 3G)
            network = random.choices(NETWORKS, weights=[20, 60, 20], k=1)[0]
            
            dl, ul, lat_ms, signal = generate_metrics(network)
            device = random.choice(DEVICES)
            
            values_list.append(
                f"('{test_id}', '{ts_str}', '{OPERATOR}', '{network}', {dl}, {ul}, {lat_ms}, {signal}, '{device}', '{wilaya_name}', '{commune}', {lat:.6f}, {lon:.6f})"
            )
        
        f.write(",\n".join(values_list) + ";\n")
        
    print(f"Fichier SQL généré : {FILENAME} ({NUM_RECORDS} enregistrements)")

if __name__ == "__main__":
    generate_sql()
