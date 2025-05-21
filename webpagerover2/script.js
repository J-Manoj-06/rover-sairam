// Utility function to draw a line chart
function drawLineChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    const padding = 20;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = '#3d3d3d';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding + (height - 2 * padding) * (1 - i / 5);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Draw line
    ctx.strokeStyle = options.color || '#ff6b00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((point, i) => {
        const x = padding + (width - 2 * padding) * (i / (data.length - 1));
        const y = padding + (height - 2 * padding) * (1 - point);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();
}

// Utility function to draw a circular gauge
function drawCircularGauge(canvasId, percentage, options = {}) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    const radius = Math.min(width, height) / 2 - 10;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#3d3d3d';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw progress circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * percentage / 100));
    ctx.strokeStyle = options.color || '#ff6b00';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Draw percentage text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${percentage}%`, centerX, centerY);
}

// Utility function to draw a vertical temperature gauge
function drawVerticalGauge(canvasId, temperature, options = {}) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    const padding = 20;
    const gaugeWidth = 30;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    const gradient = ctx.createLinearGradient(0, height - padding, 0, padding);
    gradient.addColorStop(0, '#4CAF50');  // Green (cold)
    gradient.addColorStop(0.5, '#FFC107'); // Yellow (medium)
    gradient.addColorStop(1, '#F44336');  // Red (hot)

    ctx.fillStyle = gradient;
    ctx.fillRect((width - gaugeWidth) / 2, padding, gaugeWidth, height - 2 * padding);

    // Draw temperature indicator
    const tempPosition = padding + (height - 2 * padding) * (1 - temperature / 100);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo((width - gaugeWidth) / 2 - 10, tempPosition);
    ctx.lineTo((width + gaugeWidth) / 2 + 10, tempPosition);
    ctx.lineTo((width + gaugeWidth) / 2, tempPosition - 5);
    ctx.lineTo((width - gaugeWidth) / 2 - 10, tempPosition);
    ctx.fill();

    // Draw temperature text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(`${temperature}°C`, width / 2, tempPosition - 15);
}

// Utility function to draw a pH gauge
function drawPHGauge(canvasId, pH, options = {}) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = canvas.offsetHeight;
    const padding = 20;
    const gaugeHeight = 30;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw rainbow background
    const gradient = ctx.createLinearGradient(padding, height / 2, width - padding, height / 2);
    gradient.addColorStop(0, '#FF0000');  // Red
    gradient.addColorStop(0.2, '#FFA500'); // Orange
    gradient.addColorStop(0.4, '#FFFF00'); // Yellow
    gradient.addColorStop(0.6, '#00FF00'); // Green
    gradient.addColorStop(0.8, '#0000FF'); // Blue
    gradient.addColorStop(1, '#800080');  // Purple

    ctx.fillStyle = gradient;
    ctx.fillRect(padding, (height - gaugeHeight) / 2, width - 2 * padding, gaugeHeight);

    // Draw pH indicator
    const pHPosition = padding + (width - 2 * padding) * (pH / 14);
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(pHPosition, (height - gaugeHeight) / 2 - 10);
    ctx.lineTo(pHPosition, (height + gaugeHeight) / 2 + 10);
    ctx.lineTo(pHPosition - 5, (height + gaugeHeight) / 2);
    ctx.lineTo(pHPosition, (height - gaugeHeight) / 2 - 10);
    ctx.fill();

    // Draw pH text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(`pH ${pH}`, pHPosition, (height - gaugeHeight) / 2 - 20);
}

// Initialize all charts and gauges
document.addEventListener('DOMContentLoaded', () => {
    // Hydrogen Concentration Chart
    const hydrogenData = Array.from({length: 10}, () => Math.random() * 0.5 + 0.5);
    drawLineChart('hydrogenChart', hydrogenData, {color: '#4CAF50'});

    // Combustible Gases Gauge
    drawCircularGauge('gasesGauge', 16, {color: '#F44336'});

    // Air Quality Chart
    const airQualityData = Array.from({length: 10}, (_, i) => i / 10 + 0.3);
    drawLineChart('airQualityChart', airQualityData, {color: '#2196F3'});

    // Soil Moisture Gauge
    drawCircularGauge('soilMoistureGauge', 50, {color: '#2196F3'});

    // Soil Temperature Gauge
    drawVerticalGauge('soilTempGauge', 34);

    // pH Level Gauge
    drawPHGauge('phGauge', 3);

    // Handle window resize
    window.addEventListener('resize', () => {
        drawLineChart('hydrogenChart', hydrogenData, {color: '#4CAF50'});
        drawCircularGauge('gasesGauge', 16, {color: '#F44336'});
        drawLineChart('airQualityChart', airQualityData, {color: '#2196F3'});
        drawCircularGauge('soilMoistureGauge', 50, {color: '#2196F3'});
        drawVerticalGauge('soilTempGauge', 34);
        drawPHGauge('phGauge', 3);
    });
}); 