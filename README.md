# Real-Time EEG Signal Processing and Seizure Detection

This project implements a real-time EEG (Electroencephalogram) signal processing and visualization system with epileptic seizure detection capabilities. The system combines machine learning for seizure detection with an interactive web interface for real-time signal monitoring and analysis.

## Project Overview

The system processes EEG signals in real-time, breaking them down into different frequency bands (Delta, Theta, Alpha, Beta, and Gamma) and uses a trained decision tree model to detect potential seizure activity. The frontend provides an interactive dashboard for monitoring both raw EEG signals and their frequency components, while the backend handles signal processing and seizure detection.

### Key Features

- Real-time EEG signal visualization
- Frequency band decomposition and analysis
- Machine learning-based seizure detection
- Interactive controls for signal monitoring
- Dark/Light mode support
- Responsive design for various screen sizes

## Technical Architecture

### Frontend (React.js)
The frontend is built using React.js and provides a responsive, interactive interface for EEG monitoring. Key components include:

- Real-time signal charts using Recharts
- Interactive controls for playback and visualization
- Frequency band analysis displays
- Status monitoring and alerts
- Adaptive theme system (dark/light mode)

### Backend (Flask)
The backend service handles:

- EEG signal processing
- Machine learning model integration
- Real-time predictions
- RESTful API endpoints for frontend communication

### Machine Learning
The system uses a Decision Tree model trained on epileptic seizure recognition data to classify EEG patterns and detect potential seizure activity.

## Required Packages

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "recharts": "^2.x",
    "lucide-react": "^0.263.1",
    "tailwindcss": "^3.x"
  }
}
```

### Backend Dependencies
```python
flask==2.x
flask-cors==4.x
numpy==1.x
pandas==1.x
scikit-learn==1.x
joblib==1.x
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
   python app.py
   ```
   The server will start on http://localhost:5000

2. Start the React frontend:
   ```bash
   npm start
   ```
   The application will open in your browser at https://kanishk1420.github.io/EEG-Signal-Processing/

## System Components

### Signal Processing
The system processes EEG signals into five frequency bands:
- Delta (0.5-4 Hz): Slow-wave activity
- Theta (4-8 Hz): Associated with drowsiness
- Alpha (8-13 Hz): Relaxed wakefulness
- Beta (13-30 Hz): Active thinking
- Gamma (30-100 Hz): Complex cognitive processing

### Machine Learning Model
The decision tree model is trained on epileptic seizure recognition data and processes 178-dimensional feature vectors to classify EEG patterns. The model provides binary classification:
- Normal activity
- Possible seizure activity

### User Interface
The interface provides:
- Real-time EEG waveform display
- Frequency band visualizations
- Playback controls (Play/Pause, Speed adjustment)
- Status indicators
- Theme switching
- Information cards showing system status

## Data Flow

1. Raw EEG data is captured and sent to the backend
2. The backend processes the signal and extracts features
3. The machine learning model analyzes the features
4. Results are sent back to the frontend
5. The frontend updates visualizations and status indicators

## Performance Considerations

- The system uses windowed processing with a 20-sample window size
- Update speeds can be adjusted (Fast: 20ms, Normal: 90ms, Slow: 150ms)
- The frontend implements efficient rendering using React's virtual DOM
- The backend includes error handling and response validation

## Error Handling

The system includes comprehensive error handling for:
- Backend connection failures
- Data processing errors
- Model prediction issues
- Invalid input data

## Future Improvements

Potential areas for enhancement include:
- Real-time data export capabilities
- Additional machine learning models
- Advanced filtering options
- Historical data analysis
- User authentication system
- Custom alert thresholds
