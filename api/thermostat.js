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
    const HASHRATE_ENTITY_ID = process.env.HASHRATE_ENTITY_ID;
    
    // Validate environment variables
    if (!HA_URL || !HA_TOKEN || !ENTITY_ID) {
        console.error('Missing environment variables');
        return res.status(500).json({ 
            error: 'Server configuration error',
            message: 'Required environment variables are not set'
        });
    }
    
    try {
        // Prepare fetch requests for both climate and hashrate entities
        const climateFetch = fetch(`${HA_URL}/api/states/${ENTITY_ID}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${HA_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        // Only fetch hashrate if entity ID is configured
        const hashrateFetch = HASHRATE_ENTITY_ID
            ? fetch(`${HA_URL}/api/states/${HASHRATE_ENTITY_ID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${HA_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            })
            : Promise.resolve(null);

        // Execute both fetches in parallel
        const [climateResponse, hashrateResponse] = await Promise.all([
            climateFetch,
            hashrateFetch
        ]);

        // Check climate response (required)
        if (!climateResponse.ok) {
            throw new Error(`Home Assistant API returned ${climateResponse.status}: ${climateResponse.statusText}`);
        }

        const climateData = await climateResponse.json();

        // Parse hashrate response (optional)
        let hashrateData = null;
        if (hashrateResponse && hashrateResponse.ok) {
            hashrateData = await hashrateResponse.json();
        }

        // Return aggregated response
        return res.status(200).json({
            climate: climateData,
            hashrate: hashrateData
        });
        
    } catch (error) {
        console.error('Error fetching from Home Assistant:', error);
        return res.status(500).json({ 
            error: 'Failed to fetch thermostat data',
            message: error.message
        });
    }
}
