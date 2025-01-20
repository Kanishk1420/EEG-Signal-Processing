import numpy as np
from sklearn.preprocessing import StandardScaler

def preprocess_input(features):
    scaler = StandardScaler()
    scaled_features = scaler.fit_transform(features)
    return np.expand_dims(scaled_features, axis=0)
