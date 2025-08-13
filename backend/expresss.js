const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors()); 
app.use(express.json());

const GOOGLE_API_KEY = 'AIzaSyAUbkZEu97uzwbl9IA4DNEMLlPg_gPlNTw'; 

app.get('/api/nearby-doctors', async (req, res) => {
    const { latitude, longitude } = req.query;
    const radius = 5000; 

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=doctor&key=${GOOGLE_API_KEY}`;

    try {
        const response = await axios.get(url);
        res.json(response.data); 
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).send('Error fetching doctors');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
