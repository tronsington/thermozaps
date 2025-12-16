// Configuration
const CONFIG = {
    // This will be your Vercel function URL after deployment
    // For local testing: http://localhost:3000/api/thermostat
    // For production: https://your-project.vercel.app/api/thermostat
    API_URL: '/api/thermostat',
    REFRESH_INTERVAL: 30000, // 30 seconds
    QR_CODES: [
        'lightning:lnurl1dp68gurn8ghj7mtexfekzarn9eu8j730gf2yxt64f9xyu42jfshhqcte9ashqup0x395sn25g9znxjjkf3t9j5n9wpjnxe2vd4rrxunc2yunxtmfde3hyetpwdjj6arnw3shghwcntu',
        'lightning:lnurl1dp68gurn8ghj7mtexfekzarn9eu8j730gf2yxt64f9xyu42jfshhqcte9ashqup0x395sn25g9znxjjkf3t9j5n9wpjnxe2vd4rrxunc2yunxtmvdamk2u3dw3ehgct5rtdm63'
    ]
};

// DOM Elements
const elements = {
    currentTemp: document.getElementById('currentTemp'),
    targetTemp: document.getElementById('targetTemp'),
    hvacMode: document.getElementById('hvacMode'),
    hvacState: document.getElementById('hvacState'),
    activityBar: document.getElementById('activityBar'),
    status: document.getElementById('status'),
    statusText: document.querySelector('.status-text'),
    lastUpdate: document.getElementById('lastUpdate')
};

// Initialize QR Codes
function initQRCodes() {
    CONFIG.QR_CODES.forEach((code, index) => {
        const qrElement = document.getElementById(`qr${index + 1}`);
        new QRCode(qrElement, {
            text: code,
            width: 180,
            height: 180,
            colorDark: '#0a0e12',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
        });
    });
}

// Fetch thermostat data from Vercel API
async function fetchThermostatData() {
    try {
        const response = await fetch(CONFIG.API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateUI(data);
        setStatus('online', 'ONLINE');
    } catch (error) {
        console.error('Error fetching thermostat data:', error);
        setStatus('offline', 'OFFLINE');
    }
}

// Update UI with thermostat data
function updateUI(data) {
    const attributes = data.attributes || {};
    const state = data.state || 'unknown';
    
    // Update current temperature
    const currentTemp = attributes.current_temperature;
    if (currentTemp !== undefined) {
        elements.currentTemp.textContent = Math.round(currentTemp);
        
        // Apply color based on HVAC action
        const hvacAction = attributes.hvac_action || 'idle';
        elements.currentTemp.className = 'temp-value';
        if (hvacAction === 'heating') {
            elements.currentTemp.classList.add('heating');
        } else if (hvacAction === 'cooling') {
            elements.currentTemp.classList.add('cooling');
        }
    }
    
    // Update target temperature
    const targetTemp = attributes.temperature;
    if (targetTemp !== undefined) {
        elements.targetTemp.textContent = `${Math.round(targetTemp)}°F`;
    }
    
    // Update HVAC mode
    const hvacMode = attributes.hvac_mode || state;
    elements.hvacMode.textContent = hvacMode.toUpperCase();
    
    // Update HVAC state/action
    const hvacAction = attributes.hvac_action || 'idle';
    elements.hvacState.textContent = hvacAction.toUpperCase();
    
    // Update activity bar
    updateActivityBar(hvacAction);
    
    // Update last update time
    updateLastUpdateTime();
}

// Update activity bar based on HVAC action
function updateActivityBar(hvacAction) {
    elements.activityBar.className = 'activity-bar';
    
    if (hvacAction === 'heating') {
        elements.activityBar.classList.add('active');
        elements.activityBar.style.background = 'linear-gradient(90deg, #ff6b35, #ff8c42)';
        elements.activityBar.style.width = '100%';
    } else if (hvacAction === 'cooling') {
        elements.activityBar.classList.add('active');
        elements.activityBar.style.background = 'linear-gradient(90deg, #4ecdc4, #00d9ff)';
        elements.activityBar.style.width = '100%';
    } else if (hvacAction === 'idle') {
        elements.activityBar.style.width = '0%';
    }
}

// Set connection status
function setStatus(status, text) {
    elements.status.className = `status-indicator ${status}`;
    elements.statusText.textContent = text;
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    elements.lastUpdate.textContent = timeString;
}

// Initialize the application
function init() {
    // Generate QR codes
    initQRCodes();
    
    // Initial fetch
    fetchThermostatData();
    
    // Set up periodic refresh
    setInterval(fetchThermostatData, CONFIG.REFRESH_INTERVAL);
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
// Manual refresh button handler
document.getElementById('refreshButton').addEventListener('click', async function() {
    const button = this;
    
    // Add refreshing state
    button.classList.add('refreshing');
    button.textContent = 'REFRESHING...';
    
    // Fetch new data
    await fetchThermostatData();
    
    // Remove refreshing state after a brief delay
    setTimeout(() => {
        button.classList.remove('refreshing');
        button.innerHTML = '<span class="refresh-icon">↻</span>REFRESH DATA';
    }, 500);
});
// Manual refresh button handler
document.getElementById('refreshButton').addEventListener('click', async function() {
    const button = this;
    
    // Add refreshing state
    button.classList.add('refreshing');
    const originalContent = button.innerHTML;
    button.innerHTML = '<span class="refresh-icon">↻</span>REFRESHING...';
    
    // Fetch new data
    await fetchThermostatData();
    
    // Remove refreshing state after a brief delay
    setTimeout(() => {
        button.classList.remove('refreshing');
        button.innerHTML = originalContent;
    }, 500);
});
