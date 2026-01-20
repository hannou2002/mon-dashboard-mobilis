-- Insérer des tests avec mauvaise connexion à Bab Ezzouar
-- Adapté à la structure exacte de votre base de données (vue dans la capture)
-- Colonnes : id, download_mbps, upload_mbps, latency_ms, jitter_ms, network_type, signal_strength_dbm, wilaya, commune, latitude, longitude, timestamp

INSERT INTO speed_tests (download_mbps, upload_mbps, latency_ms, jitter_ms, network_type, signal_strength_dbm, wilaya, commune, latitude, longitude, timestamp) VALUES
-- Point 1 : Très mauvaise 4G
(1.5, 0.5, 120, 45, '4G', -115, 'Alger', 'Bab Ezzouar', 36.7210, 3.1810, NOW() - INTERVAL 10 MINUTE),

-- Point 2 : 3G saturée
(0.8, 0.2, 250, 80, '3G', -95, 'Alger', 'Bab Ezzouar', 36.7190, 3.1790, NOW() - INTERVAL 35 MINUTE),

-- Point 3 : 4G instable
(2.1, 1.0, 95, 30, '4G', -108, 'Alger', 'Bab Ezzouar', 36.7225, 3.1820, NOW() - INTERVAL 1 HOUR),

-- Point 4 : Zone morte presque
(0.5, 0.1, 400, 150, '3G', -105, 'Alger', 'Bab Ezzouar', 36.7185, 3.1805, NOW() - INTERVAL 2 HOUR),

-- Point 5 : Mauvaise réception indoor
(3.2, 0.8, 88, 25, '4G', -112, 'Alger', 'Bab Ezzouar', 36.7205, 3.1795, NOW() - INTERVAL 15 MINUTE),

-- Point 6 : Bordure de cellule
(1.2, 0.4, 150, 50, '4G', -118, 'Alger', 'Bab Ezzouar', 36.7215, 3.1815, NOW() - INTERVAL 45 MINUTE);
