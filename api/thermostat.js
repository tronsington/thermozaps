// Vercel Serverless Function to proxy Home Assistant API requests
// This keeps your API token secure and never exposes it to the browser

export default async function handler(req, res) {
    // Enable CORS for your frontend
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Get environment variables (set these in Vercel dashboard)
    const HA_URL = process.env.HA_URL;
    const HA_TOKEN = process.env.HA_TOKEN;
    const ENTITY_ID = process.env.ENTITY_ID;
    
    // Validate environment variables
    if (!HA_URL || !HA_TOKEN || !ENTITY_ID) {
        console.error('Missing environment variables');
        return res.status(500).json({ 
            error: 'Server configuration error',
            message: 'Required environment variables are not set'
        });
    }
    
    try {
        // Fetch data from Home Assistant
        const homeAssistantUrl = `${HA_URL}/api/states/${ENTITY_ID}`;
        
        const response = await fetch(homeAssistantUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${HA_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`Home Assistant API returned ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Return the data to the frontend
        return res.status(200).json(data);
        
    } catch (error) {
        console.error('Error fetching from Home Assistant:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch thermostat data',
            message: error.message
        });
    }
}
