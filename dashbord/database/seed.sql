USE mobilis_dashboard;

-- Insertion de données fictives (Mock Data) pour tester le dashboard
INSERT INTO speed_tests (test_id, operator, device_type, download_mbps, upload_mbps, latency_ms, jitter_ms, network_type, signal_strength_dbm, wilaya, commune, latitude, longitude, timestamp) VALUES
-- Alger (5G / 4G performant)
(UUID(), 'Mobilis', 'Android', 120.5, 45.2, 15, 3, '5G', -75, 'Alger', 'Alger Centre', 36.752887, 3.042048, NOW() - INTERVAL 1 HOUR),
(UUID(), 'Mobilis', 'iOS', 85.3, 30.1, 22, 5, '5G', -80, 'Alger', 'Bab Ezzouar', 36.7262, 3.1930, NOW() - INTERVAL 2 HOUR),
(UUID(), 'Mobilis', 'Android', 45.0, 15.5, 28, 4, '4G', -85, 'Alger', 'Kouba', 36.723, 3.061, NOW() - INTERVAL 3 HOUR),
(UUID(), 'Mobilis', 'iOS', 150.2, 55.4, 12, 2, '5G', -70, 'Alger', 'Hydra', 36.738, 3.039, NOW() - INTERVAL 30 MINUTE),

-- Oran (Mix 4G/3G)
(UUID(), 'Mobilis', 'Android', 35.5, 10.2, 45, 8, '4G', -90, 'Oran', 'Oran Centre', 35.6971, -0.6300, NOW() - INTERVAL 5 HOUR),
(UUID(), 'Mobilis', 'iOS', 12.8, 3.5, 65, 12, '3G', -102, 'Oran', 'Es Senia', 35.642, -0.612, NOW() - INTERVAL 1 DAY),
(UUID(), 'Mobilis', 'Android', 55.6, 18.0, 32, 6, '4G', -88, 'Oran', 'Bir El Djir', 35.720, -0.565, NOW() - INTERVAL 4 HOUR),

-- Constantine (Problèmes de latence simulés)
(UUID(), 'Mobilis', 'Android', 22.4, 5.8, 120, 25, '4G', -95, 'Constantine', 'Constantine', 36.3650, 6.6147, NOW() - INTERVAL 6 HOUR),
(UUID(), 'Mobilis', 'iOS', 8.2, 1.2, 150, 40, '3G', -105, 'Constantine', 'El Khroub', 36.262, 6.696, NOW() - INTERVAL 12 HOUR),

-- Setif
(UUID(), 'Mobilis', 'Android', 65.4, 22.1, 35, 7, '4G', -82, 'Setif', 'Setif', 36.1898, 5.4107, NOW() - INTERVAL 2 DAY),
(UUID(), 'Mobilis', 'iOS', 70.1, 25.5, 30, 5, '4G', -78, 'Setif', 'El Eulma', 36.152, 5.688, NOW() - INTERVAL 2 DAY),

-- Sud (Ouargla - Simulation connectivité faible)
(UUID(), 'Mobilis', 'Android', 4.5, 0.8, 200, 80, '3G', -110, 'Ouargla', 'Hassi Messaoud', 31.670, 6.062, NOW() - INTERVAL 3 DAY),
(UUID(), 'Mobilis', 'iOS', 15.2, 2.5, 85, 15, '4G', -98, 'Ouargla', 'Ouargla', 31.952, 5.326, NOW() - INTERVAL 3 DAY);

-- Génération de plus de données aléatoires (Optionnel si besoin de volume)
-- ...
