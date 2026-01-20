const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all speed tests
app.get('/api/data', async (req, res) => {
    try {
        // Select all columns to satisfy user requirement "all information possible"
        const result = await db.query('SELECT * FROM speed_tests ORDER BY timestamp DESC');
        res.json(result.rows); // MySQL returns rows directly in the array
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Stats (Aggregated)
app.get('/api/stats', async (req, res) => {
    try {
        const statsQuery = `
            SELECT 
                COUNT(*) as total_tests,
                AVG(download_mbps) as avg_download,
                AVG(upload_mbps) as avg_upload,
                AVG(latency_ms) as avg_latency
            FROM speed_tests
        `;
        const result = await db.query(statsQuery);
        res.json(result.rows[0]); // MySQL returns rows directly in the array
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get Critical Zones (Poor performance areas)
app.get('/api/critical-zones', async (req, res) => {
    try {
        // Threshold: zones with average download < 10 Mbps are critical
        const criticalQuery = `
            SELECT 
                commune,
                wilaya,
                AVG(download_mbps) as avg_download,
                AVG(upload_mbps) as avg_upload,
                AVG(latency_ms) as avg_latency,
                AVG(latitude) as lat,
                AVG(longitude) as lng,
                COUNT(*) as test_count
            FROM speed_tests
            GROUP BY commune, wilaya
            HAVING AVG(download_mbps) < 10
            ORDER BY avg_download ASC
        `;
        const result = await db.query(criticalQuery);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all BTS antennas
app.get('/api/bts', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM bts_antennas ORDER BY wilaya, commune');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get BTS antennas covering a specific point (within 40km radius)
// Uses Haversine formula to calculate distance
app.get('/api/bts/coverage', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        if (!lat || !lng) {
            return res.status(400).json({ error: 'lat and lng parameters required' });
        }

        // 40km coverage radius
        const coverageRadius = 40;

        // Haversine formula in SQL (approximate for small distances)
        const query = `
            SELECT *,
                (6371 * acos(
                    cos(radians(?)) * cos(radians(latitude)) * 
                    cos(radians(longitude) - radians(?)) + 
                    sin(radians(?)) * sin(radians(latitude))
                )) AS distance_km
            FROM bts_antennas
            HAVING distance_km <= ?
            ORDER BY distance_km ASC
        `;

        const result = await db.query(query, [lat, lng, lat, coverageRadius]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get critical zones with responsible BTS antennas
app.get('/api/critical-zones-with-bts', async (req, res) => {
    try {
        // First get critical zones
        const criticalQuery = `
            SELECT 
                commune,
                wilaya,
                AVG(download_mbps) as avg_download,
                AVG(upload_mbps) as avg_upload,
                AVG(latency_ms) as avg_latency,
                AVG(latitude) as lat,
                AVG(longitude) as lng,
                COUNT(*) as test_count
            FROM speed_tests
            GROUP BY commune, wilaya
            HAVING AVG(download_mbps) < 10
            ORDER BY avg_download ASC
        `;
        const zonesResult = await db.query(criticalQuery);
        const zones = zonesResult.rows;

        // For each zone, find BTS within 40km
        const zonesWithBTS = await Promise.all(zones.map(async (zone) => {
            const btsQuery = `
                SELECT id, nom, wilaya, commune, latitude, longitude, etatA, etatB, etatC,
                    (6371 * acos(
                        cos(radians(?)) * cos(radians(latitude)) * 
                        cos(radians(longitude) - radians(?)) + 
                        sin(radians(?)) * sin(radians(latitude))
                    )) AS distance_km
                FROM bts_antennas
                HAVING distance_km <= 40
                ORDER BY distance_km ASC
                LIMIT 5
            `;
            const btsResult = await db.query(btsQuery, [zone.lat, zone.lng, zone.lat]);
            return {
                ...zone,
                responsible_bts: btsResult.rows
            };
        }));

        res.json(zonesWithBTS);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
