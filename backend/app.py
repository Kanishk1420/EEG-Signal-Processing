from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import joblib

app = Flask(__name__)
# Update CORS to include both GitHub Pages and localhost
CORS(app, origins=['https://kanishk1420.github.io', 'http://localhost:3000'])

model = joblib.load('decision_tree_model.joblib')
@app.route('/predict', methods=['POST'])
def predict():
    try:
        features = request.json['features']
        # Extend features to 178 values if needed
        if len(features) < 178:
            features.extend([0] * (178 - len(features)))
        features = np.array(features[:178]).reshape(1, -1)
        
        # Create DataFrame with proper feature names
        df = pd.DataFrame(features, columns=[f'X{i+1}' for i in range(178)])
        
        prediction = model.predict(df)[0]
        
        return jsonify({
    'prediction': int(prediction),
    'status': 'Possible Seizure Activity' if prediction == 1 else 'Normal'
})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/healthz', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0')