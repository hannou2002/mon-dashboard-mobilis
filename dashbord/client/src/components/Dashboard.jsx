import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker, Circle } from 'react-leaflet';
import { Activity, Wifi, MapPin, Database, Server, AlertTriangle, Radio } from 'lucide-react';
import L from 'leaflet';
import '../index.css';

const Dashboard = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [criticalZones, setCriticalZones] = useState([]);
    const [btsAntennas, setBtsAntennas] = useState([]);
    const [selectedBTS, setSelectedBTS] = useState(null);

    // Custom BTS icon
    const btsIcon = new L.DivIcon({
        className: 'bts-marker',
        html: `<div style="background: linear-gradient(135deg, #8b5cf6, #6366f1); width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3);">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/>
                <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/>
                <circle cx="12" cy="12" r="2"/>
                <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/>
                <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>
            </svg>
        </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [dataRes, statsRes, criticalRes, btsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/data'),
                axios.get('http://localhost:5000/api/stats'),
                axios.get('http://localhost:5000/api/critical-zones-with-bts'),
                axios.get('http://localhost:5000/api/bts')
            ]);
            setData(dataRes.data);
            setStats(statsRes.data);
            setCriticalZones(criticalRes.data);
            setBtsAntennas(btsRes.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loader"></div>;

    // Process data for charts
    const techDistribution = data.reduce((acc, curr) => {
        acc[curr.network_type] = (acc[curr.network_type] || 0) + 1;
        return acc;
    }, {});

    const pieData = Object.keys(techDistribution).map(key => ({
        name: key,
        value: techDistribution[key]
    }));

    const COLORS = ['#eab308', '#38bdf8', '#22c55e']; // 3G, 4G, 5G

    // Format Date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="dashboard-container">
            <div className="header">
                <h1>Mobilis Network Analytics</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
                    Real-time performance monitoring & detailed logs
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid-container">
                <div className="card">
                    <div className="section-title"><Activity size={20} color="var(--accent-color)" /> Avg Download</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {Number(stats?.avg_download).toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Mbps</span>
                    </div>
                </div>
                <div className="card">
                    <div className="section-title"><Server size={20} color="#22c55e" /> Avg Upload</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {Number(stats?.avg_upload).toFixed(2)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>Mbps</span>
                    </div>
                </div>
                <div className="card">
                    <div className="section-title"><Wifi size={20} color="#eab308" /> Avg Latency</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {Number(stats?.avg_latency).toFixed(0)} <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>ms</span>
                    </div>
                </div>
                <div className="card">
                    <div className="section-title"><Database size={20} color="#ef4444" /> Total Tests</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                        {stats?.total_tests}
                    </div>
                </div>
            </div>

            {/* Critical Zones Alerts with Responsible BTS */}
            {criticalZones.length > 0 && (
                <div className="card" style={{ marginBottom: '30px', borderColor: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}>
                    <div className="section-title" style={{ color: 'var(--danger)' }}>
                        <AlertTriangle size={20} /> Zones Critiques Détectées ({criticalZones.length})
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {criticalZones.map((zone, idx) => (
                            <div key={idx} style={{
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid var(--danger)',
                                borderRadius: '8px',
                                padding: '12px 16px',
                                minWidth: '280px'
                            }}>
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                    📍 {zone.commune}, {zone.wilaya}
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                    Débit moyen: <span style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{Number(zone.avg_download).toFixed(2)} Mbps</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                                    Tests: {zone.test_count} | Latence: {Number(zone.avg_latency).toFixed(0)} ms
                                </div>
                                {zone.responsible_bts && zone.responsible_bts.length > 0 && (
                                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '5px' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', marginBottom: '5px' }}>
                                            📡 Antennes BTS Responsables:
                                        </div>
                                        {zone.responsible_bts.map((bts, bIdx) => (
                                            <div key={bIdx} style={{ fontSize: '0.8rem', marginLeft: '10px', marginBottom: '3px' }}>
                                                <strong>{bts.nom}</strong> ({Number(bts.distance_km).toFixed(1)} km)
                                                <span style={{ marginLeft: '5px' }}>
                                                    A:<span style={{ color: bts.etatA === 'actif' ? '#22c55e' : bts.etatA === 'maintenance' ? '#eab308' : '#ef4444' }}>●</span>
                                                    B:<span style={{ color: bts.etatB === 'actif' ? '#22c55e' : bts.etatB === 'maintenance' ? '#eab308' : '#ef4444' }}>●</span>
                                                    C:<span style={{ color: bts.etatC === 'actif' ? '#22c55e' : bts.etatC === 'maintenance' ? '#eab308' : '#ef4444' }}>●</span>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Map Section */}
            <div className="card" style={{ marginBottom: '30px', height: '500px' }}>
                <div className="section-title"><MapPin size={20} color="var(--accent-color)" /> Geospatial Coverage</div>
                <MapContainer center={[36.75, 3.05]} zoom={10} style={{ height: 'calc(100% - 40px)', width: '100%', borderRadius: '8px' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    {/* Critical Zone Circles (Red) */}
                    {criticalZones.map((zone, idx) => (
                        <CircleMarker
                            key={`critical-${idx}`}
                            center={[zone.lat, zone.lng]}
                            radius={25}
                            fillColor="#ef4444"
                            color="#ef4444"
                            weight={3}
                            fillOpacity={0.3}
                        >
                            <Popup>
                                <div style={{ color: '#000' }}>
                                    <strong style={{ color: '#ef4444' }}>⚠️ ZONE CRITIQUE</strong><br />
                                    {zone.commune}, {zone.wilaya}<br />
                                    Débit Moyen: {Number(zone.avg_download).toFixed(2)} Mbps<br />
                                    Latence: {Number(zone.avg_latency).toFixed(0)} ms
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                    {/* Regular Data Points */}
                    {data.map((point, idx) => (
                        <CircleMarker
                            key={idx}
                            center={[point.latitude, point.longitude]}
                            radius={5}
                            fillColor={point.network_type === '5G' ? '#22c55e' : point.network_type === '4G' ? '#38bdf8' : '#eab308'}
                            color="transparent"
                            fillOpacity={0.7}
                        >
                            <Popup>
                                <div style={{ color: '#000' }}>
                                    <strong>{point.network_type}</strong><br />
                                    DL: {point.download_mbps} Mbps<br />
                                    Lat: {point.latency_ms} ms
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                    {/* BTS Antennas */}
                    {btsAntennas.map((bts, idx) => (
                        <React.Fragment key={`bts-${idx}`}>
                            {/* Coverage Circle (40km radius) */}
                            <Circle
                                center={[bts.latitude, bts.longitude]}
                                radius={40000}
                                pathOptions={{
                                    color: '#8b5cf6',
                                    weight: 1,
                                    fillColor: '#8b5cf6',
                                    fillOpacity: 0.05,
                                    dashArray: '5, 5'
                                }}
                            />
                            {/* BTS Marker */}
                            <Marker
                                position={[bts.latitude, bts.longitude]}
                                icon={btsIcon}
                            >
                                <Popup>
                                    <div style={{ color: '#000', minWidth: '180px' }}>
                                        <strong style={{ color: '#8b5cf6' }}>📡 {bts.nom}</strong><br />
                                        <span style={{ fontSize: '0.85rem' }}>{bts.commune}, {bts.wilaya}</span>
                                        <hr style={{ margin: '5px 0', borderColor: '#ddd' }} />
                                        <div style={{ fontSize: '0.85rem' }}>
                                            <strong>État des sous-antennes:</strong><br />
                                            <span style={{ marginRight: '10px' }}>
                                                A: <span style={{ color: bts.etatA === 'actif' ? '#22c55e' : bts.etatA === 'maintenance' ? '#eab308' : '#ef4444', fontWeight: 'bold' }}>{bts.etatA}</span>
                                            </span><br />
                                            <span style={{ marginRight: '10px' }}>
                                                B: <span style={{ color: bts.etatB === 'actif' ? '#22c55e' : bts.etatB === 'maintenance' ? '#eab308' : '#ef4444', fontWeight: 'bold' }}>{bts.etatB}</span>
                                            </span><br />
                                            <span>
                                                C: <span style={{ color: bts.etatC === 'actif' ? '#22c55e' : bts.etatC === 'maintenance' ? '#eab308' : '#ef4444', fontWeight: 'bold' }}>{bts.etatC}</span>
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '5px' }}>
                                            Couverture: 40 km (120° par secteur)
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        </React.Fragment>
                    ))}
                </MapContainer>
            </div>

            {/* Charts Row */}
            <div className="grid-container" style={{ gridTemplateColumns: '2fr 1fr' }}>
                <div className="card" style={{ height: '400px' }}>
                    <div className="section-title">Network Performance Trend</div>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.slice(0, 50).reverse()}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                            <XAxis dataKey="timestamp" tickFormatter={(t) => new Date(t).toLocaleDateString()} stroke="var(--text-secondary)" />
                            <YAxis stroke="var(--text-secondary)" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="download_mbps" stroke="var(--accent-color)" strokeWidth={2} dot={false} name="Download" />
                            <Line type="monotone" dataKey="upload_mbps" stroke="#22c55e" strokeWidth={2} dot={false} name="Upload" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="card" style={{ height: '400px' }}>
                    <div className="section-title">Technology Distribution</div>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
                                itemStyle={{ color: 'var(--text-primary)' }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Detailed Data Table */}
            <div className="card">
                <div className="section-title"><Database size={20} /> Detailed Logs (All Fields)</div>
                <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                    <table>
                        <thead>
                            <tr>
                                <th>Time</th>
                                <th>ID</th>
                                <th>Operator</th>
                                <th>Network</th>
                                <th>Device</th>
                                <th>Download</th>
                                <th>Upload</th>
                                <th>Latency</th>
                                <th>Signal</th>
                                <th>Location</th>
                                <th>Coords</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((row, index) => (
                                <tr key={index}>
                                    <td>{formatDate(row.timestamp)}</td>
                                    <td><span style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>{row.test_id?.substring(0, 8)}...</span></td>
                                    <td>{row.operator}</td>
                                    <td>
                                        <span className={`badge badge-${row.network_type}`}>
                                            {row.network_type}
                                        </span>
                                    </td>
                                    <td>{row.device_type}</td>
                                    <td style={{ fontWeight: 'bold', color: row.download_mbps > 50 ? 'var(--success)' : row.download_mbps < 10 ? 'var(--danger)' : 'var(--text-primary)' }}>
                                        {row.download_mbps} Mbps
                                    </td>
                                    <td>{row.upload_mbps} Mbps</td>
                                    <td>{row.latency_ms} ms</td>
                                    <td>{row.signal_strength_dbm} dBm</td>
                                    <td>{row.wilaya} - {row.commune}</td>
                                    <td style={{ fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                        {Number(row.latitude).toFixed(4)}, {Number(row.longitude).toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
