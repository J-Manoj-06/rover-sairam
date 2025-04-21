# Ad Astra Rover Control Interface

A web-based control interface for the Ad Astra Rover Team's URC 2025 System Acceptance Review (SAR).

## Features

- Real-time video feeds from rover cameras
- Live telemetry data display
- Interactive map with rover location tracking
- Arm and pitch control monitoring
- Responsive design for both desktop and mobile devices

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- MySQL 8.0 or higher
- Node.js (optional, for development)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/rover.git
cd rover
```

2. Create MySQL database:
```sql
CREATE DATABASE rover_db;
```

3. Configure database connection:
Edit `src/main/resources/application.properties` with your MySQL credentials.

4. Build the project:
```bash
mvn clean install
```

## Running the Application

1. Start the Spring Boot backend:
```bash
mvn spring-boot:run
```

2. Open the frontend:
Open `index.html` in your web browser or serve it using a local web server.

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8080/api

## API Endpoints

- `GET /api/telemetry` - Get current telemetry data
- `GET /api/video-feeds` - Get video feed URLs
- `POST /api/data` - Submit new telemetry data

## Development

The project uses:
- Spring Boot 3.2.3 for the backend
- HTML5, CSS3, and JavaScript for the frontend
- Leaflet.js for mapping
- Bootstrap 5 for UI components

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 