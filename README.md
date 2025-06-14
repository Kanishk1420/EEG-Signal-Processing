# Real-Time EEG Signal Processing and Seizure Detection

This project implements a real-time EEG (Electroencephalogram) signal processing and visualization system with epileptic seizure detection capabilities. The system combines machine learning for seizure detection with an interactive web interface for real-time signal monitoring and analysis.

## Project Overview

The system processes EEG signals in real-time, breaking them down into different frequency bands (Delta, Theta, Alpha, Beta, and Gamma) and uses a trained decision tree model to detect potential seizure activity. The frontend provides an interactive dashboard for monitoring both raw EEG signals and their frequency components, while the backend handles signal processing and seizure detection.

### Key Features

- Real-time EEG signal visualization
- Frequency band decomposition and analysis
- Machine learning-based seizure detection
- Interactive controls for signal monitoring
- Dark/Light mode toggle with theme persistence
- Responsive design for mobile, tablet, and desktop screens
- Card-based UI with gradient backgrounds and shadow effects

## Technical Architecture

### Frontend (React.js)
The frontend is built using React.js (v19) and provides a responsive, interactive interface for EEG monitoring. Key components include:

- Real-time signal charts using Recharts library
- Interactive controls for playback and visualization
- Frequency band analysis displays with custom tooltips
- Status monitoring with color-coded alerts
- Theme system with Sun/Moon icon toggle
- Custom UI components (Card, CardHeader, CardTitle, CardContent)

### Backend (Flask)
The backend service handles:

- EEG signal processing
- Machine learning model integration (Decision Tree)
- Real-time predictions via REST API
- Cross-Origin Resource Sharing (CORS) support for GitHub Pages and localhost
- Health check endpoint (/healthz)

### Machine Learning
The system uses a Decision Tree model trained on epileptic seizure recognition data to classify EEG patterns and detect potential seizure activity.

## Required Packages

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.3",
    "recharts": "^2.15.0",
    "lucide-react": "^0.473.0",
    "tailwindcss": "^3.4.17"
  }
}
```

### Backend Dependencies
```python
flask==2.2.3
flask-cors==3.0.10
werkzeug==2.2.3
numpy==1.22.4  
pandas==1.3.3
scikit-learn==0.24.2 
joblib==1.1.0
gunicorn==20.1.0
```

## Setup and Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Running the Application

1. Start the Flask backend:
   ```bash
   cd backend
   python app.py
   ```
   The server will start on http://localhost:5000

2. Start the React frontend:
   ```bash
   cd frontend
   npm start
   ```
   The application will open in your browser at http://localhost:3000

3. Deployment:
   The application is configured for GitHub Pages deployment:
   ```bash
   npm run deploy
   ```
   The deployed application is available at https://kanishk1420.github.io/EEG-Signal-Processing

## System Components

### Signal Processing
The system processes EEG signals into five frequency bands:
- Delta (0.5-4 Hz): Slow-wave activity, high amplitude
- Theta (4-8 Hz): Associated with drowsiness, moderate amplitude
- Alpha (8-13 Hz): Relaxed wakefulness, medium-low amplitude
- Beta (13-30 Hz): Active thinking, low amplitude, faster
- Gamma (30-100 Hz): Complex cognitive processing, very low amplitude, fastest

### Machine Learning Model
The decision tree model is trained on epileptic seizure recognition data and processes 178-dimensional feature vectors to classify EEG patterns. The model provides binary classification:
- Normal activity
- Possible Seizure Activity

### User Interface
The interface provides:
- Real-time EEG waveform display with time and amplitude axes
- Individual frequency band visualizations with custom color schemes
- Playback controls (Play/Pause, Speed adjustment, Clear)
- Color-coded status indicators (Red: Seizure, Green: Normal, Yellow: Error)
- Dark/Light theme toggle with Sun/Moon icon
- Information cards showing system status, signal info, and analysis results

## Data Flow

1. Raw EEG data is captured or simulated in the frontend
2. Data is processed in window sizes of 20 samples
3. Frequency bands are extracted and visualized
4. Every 5 time steps, data is sent to the backend API
5. The backend preprocesses the data and feeds it to the model
6. The model predicts whether the pattern indicates seizure activity
7. Results are returned to the frontend
8. The UI updates with visualization and status information

## Error Handling

The system includes comprehensive error handling for:
- Backend connection failures with status display
- Data processing errors with graceful UI feedback
- Model prediction issues with fallback to "Normal" status
- Invalid input data handling with appropriate error messages

## Theme System

The application features a complete dark/light mode theme system:
- Toggle between modes with the Sun/Moon button
- Theme affects all UI components including:
  - Charts background and foreground colors
  - Card backgrounds and borders
  - Text colors and contrast
  - Information card gradients
- Theme preference persists during the session

## Future Improvements

Potential areas for enhancement include:
- Real-time data export capabilities
- Additional machine learning models
- Advanced filtering options
- Historical data analysis
- User authentication system
- Custom alert thresholds
- Saving theme preference to local storage
- Direct connection to EEG hardware devices
