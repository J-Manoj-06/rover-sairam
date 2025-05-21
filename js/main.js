// Constants
const API_BASE_URL = 'http://localhost:8080/api';
const UPDATE_INTERVAL = 5000; // 5 seconds

// Camera feed URLs (replace with your actual webcam URLs)
const CAMERA_URLS = {
    front: 'http://192.168.245.126:8080/video',
    rear: 'http://192.0.0.2:8080/video',
    left: 'http://192.168.220.70:8080/video',
    right: 'http://192.168.220.70:8080/video',
    top: 'http://192.168.220.70:8080/video'  // Add URL for top camera
};

// Initialize map with default view set to Chennai
const map = L.map('map').setView([13.0827, 80.2707], 13);  // Chennai coordinates

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create rover icon with better visibility
const roverIcon = L.divIcon({
    className: 'rover-icon',
    html: `<svg width="32" height="32" viewBox="0 0 24 24">
            <path fill="#ff6b00" d="M12 2L4 12h16L12 2zm0 3l4.5 5.5h-9L12 5z"/>
            <circle cx="12" cy="12" r="3" fill="#fff"/>
           </svg>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
});

// Initialize tracking variables
let roverMarker = L.marker([13.0827, 80.2707], { icon: roverIcon }).addTo(map);
let trackingPolyline = L.polyline([], { 
    color: '#ff6b00',
    weight: 3,
    opacity: 0.8
}).addTo(map);
let isTracking = false;
let watchId = null;
let lastPosition = null;
let positionHistory = [];

// UI Elements
const xAxis = document.getElementById('xAxis');
const yAxis = document.getElementById('yAxis');
const zAxis = document.getElementById('zAxis');
const xCoord = document.getElementById('xCoord');
const yCoord = document.getElementById('yCoord');
const heading = document.getElementById('heading');
const compass = document.querySelector('.compass i');

// Video elements
const videoElements = {
    front: document.getElementById('video1'),
    rear: document.getElementById('video2'),
    left: document.getElementById('video3'),
    right: document.getElementById('video4'),
    top: document.getElementById('video5')
};

// Initialize video feeds
function initializeVideoFeeds() {
    Object.entries(videoElements).forEach(([camera, element]) => {
        const image = document.createElement('img');
        image.src = CAMERA_URLS[camera];
        image.alt = `${camera} camera feed`;
        image.style.width = '100%';
        image.style.height = 'auto';
        image.onerror = () => {
            element.innerHTML = `
                <i class="fas fa-video-slash fa-3x mb-2"></i>
                <div>${camera.charAt(0).toUpperCase() + camera.slice(1)} Camera Offline</div>
            `;
        };

        element.innerHTML = '';
        element.appendChild(image);
    });
}

// Update telemetry data
function updateTelemetryData(data) {
    // Update progress bars
    xAxis.style.width = `${data.xAxis}%`;
    yAxis.style.width = `${data.yAxis}%`;
    zAxis.style.width = `${data.zAxis}%`;
    
    // Update coordinate values
    xCoord.textContent = data.x.toFixed(1);
    yCoord.textContent = data.y.toFixed(1);
    heading.textContent = `${data.heading.toFixed(1)}°`;
    
    // Update compass rotation
    compass.style.transform = `rotate(${data.heading}deg)`;
    
    // Update map marker
    const newLatLng = [data.latitude, data.longitude];
    roverMarker.setLatLng(newLatLng);
    
    // Center map if rover is near the edge
    if (!map.getBounds().contains(newLatLng)) {
        map.panTo(newLatLng);
    }
}

// Mock data for demonstration
function getMockTelemetryData() {
    return {
        xAxis: Math.random() * 100,
        yAxis: Math.random() * 100,
        zAxis: Math.random() * 100,
        x: Math.random() * 500,
        y: Math.random() * 500,
        heading: Math.random() * 360,
        latitude: 51.505 + (Math.random() - 0.5) * 0.01,
        longitude: -0.09 + (Math.random() - 0.5) * 0.01
    };
}

// Initialize data fetching
function initializeDataFetching() {
    // Initialize video feeds
    initializeVideoFeeds();
    
    // Set up polling for telemetry data
    setInterval(() => {
        const mockData = getMockTelemetryData();
        updateTelemetryData(mockData);
    }, UPDATE_INTERVAL);
}

// Handle fullscreen toggle
document.querySelectorAll('.btn-outline-warning').forEach(button => {
    if (button.querySelector('.fa-expand')) {
        button.addEventListener('click', () => {
            const videoContainer = button.closest('.video-feed');
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                videoContainer.requestFullscreen();
            }
        });
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDataFetching();
});

// Handle window resize
window.addEventListener('resize', () => {
    map.invalidateSize();
});

// Start live tracking function
function startLiveTracking() {
    if (isTracking) {
        console.log('Tracking is already active');
        return;
    }

    if (!navigator.geolocation) {
        showError('Geolocation is not supported by your browser');
        return;
    }

    // Clear previous tracking data
    trackingPolyline.setLatLngs([]);
    positionHistory = [];
    lastPosition = null;

    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
        distanceFilter: 1 // Minimum distance (in meters) before triggering position update
    };

    watchId = navigator.geolocation.watchPosition(
        handlePositionUpdate,
        handlePositionError,
        options
    );

    isTracking = true;
    updateTrackingButton(true);
    showStatus('Tracking started', 'success');
}

// Handle position updates
function handlePositionUpdate(position) {
    const { latitude, longitude, accuracy, heading: deviceHeading, speed } = position.coords;
    const newPosition = [latitude, longitude];
    
    // Only update if position has changed significantly
    if (!lastPosition || 
        L.latLng(lastPosition).distanceTo(newPosition) > 1) {
        
        // Update marker with smooth animation
        roverMarker.setLatLng(newPosition);
        
        // Add to position history
        positionHistory.push(newPosition);
        
        // Update polyline
        trackingPolyline.setLatLngs(positionHistory);
        
        // Center map on new position if it's far from current view
        if (!map.getBounds().contains(newPosition)) {
            map.setView(newPosition, map.getZoom());
        }
        
        // Update coordinates display
        if (xCoord && yCoord) {
            xCoord.textContent = latitude.toFixed(6);
            yCoord.textContent = longitude.toFixed(6);
        }
        
        // Update heading if available
        if (heading && deviceHeading !== null) {
            heading.textContent = `${deviceHeading.toFixed(1)}°`;
            if (compass) {
                compass.style.transform = `rotate(${deviceHeading}deg)`;
            }
        }
        
        lastPosition = newPosition;
    }
}

// Handle position errors
function handlePositionError(error) {
    let errorMessage = 'Location error: ';
    switch (error.code) {
        case error.PERMISSION_DENIED:
            errorMessage += 'Location permission denied. Please enable location services.';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information unavailable. Please check your GPS.';
            break;
        case error.TIMEOUT:
            errorMessage += 'Location request timed out. Please try again.';
            break;
        default:
            errorMessage += 'Unknown error occurred.';
    }
    showError(errorMessage);
    stopTracking();
}

// Stop tracking function
function stopTracking() {
    if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    isTracking = false;
    updateTrackingButton(false);
    showStatus('Tracking stopped', 'info');
}

// Update tracking button state
function updateTrackingButton(isActive) {
    const button = document.getElementById('startTrackingBtn');
    if (button) {
        button.innerHTML = isActive ? 
            '<i class="fas fa-stop me-1"></i>Stop Tracking' : 
            '<i class="fas fa-location-arrow me-1"></i>Start Tracking';
        button.classList.toggle('btn-warning', isActive);
        button.classList.toggle('btn-outline-warning', !isActive);
    }
}

// Show status message
function showStatus(message, type = 'info') {
    console.log(`[${type}] ${message}`);
    // You can add a status display element here if needed
}

// Show error message
function showError(message) {
    console.error(message);
    alert(message);
}

// Add event listener for tracking button
document.getElementById('startTrackingBtn').addEventListener('click', () => {
    if (isTracking) {
        stopTracking();
    } else {
        startLiveTracking();
    }
});
