// Constants
const API_BASE_URL = 'http://localhost:8080/api';
const UPDATE_INTERVAL = 5000; // 5 seconds

// Camera feed URLs (replace with your actual camera URLs)
const CAMERA_URLS = {
    front: 'http://your-camera-ip/front',
    rear: 'http://your-camera-ip/rear',
    left: 'http://your-camera-ip/left',
    right: 'http://your-camera-ip/right'
};

// Initialize map
const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create rover icon
const roverIcon = L.divIcon({
    className: 'rover-icon',
    html: `<svg width="24" height="24" viewBox="0 0 24 24">
            <path fill="#ff6b00" d="M12 2L4 12h16L12 2zm0 3l4.5 5.5h-9L12 5z"/>
           </svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

let roverMarker = L.marker([51.505, -0.09], { icon: roverIcon }).addTo(map);

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
    right: document.getElementById('video4')
};

// Initialize video feeds
function initializeVideoFeeds() {
    Object.entries(videoElements).forEach(([camera, element]) => {
        const video = document.createElement('video');
        video.autoplay = true;
        video.muted = true;
        video.playsInline = true;
        video.src = CAMERA_URLS[camera];
        
        // Replace placeholder with video element
        element.innerHTML = '';
        element.appendChild(video);
        
        // Add error handling
        video.onerror = () => {
            element.innerHTML = `
                <i class="fas fa-video-slash fa-3x mb-2"></i>
                <div>${camera.charAt(0).toUpperCase() + camera.slice(1)} Camera Offline</div>
            `;
        };
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

// Handle refresh button
document.querySelector('.btn-outline-warning .fa-sync-alt').closest('button').addEventListener('click', () => {
    // Reinitialize video feeds
    initializeVideoFeeds();
    
    // Update telemetry data
    const mockData = getMockTelemetryData();
    updateTelemetryData(mockData);
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeDataFetching();
});

// Handle window resize
window.addEventListener('resize', () => {
    map.invalidateSize();
}); 