"""
Sleep Apnea Detection System - Streamlit Web Application

Main application file for the sleep apnea detection web interface.
"""

import glob
import io
import os
import warnings
from datetime import datetime

# Suppress sklearn InconsistentVersionWarning when loading older pickled models
try:
    from sklearn.exceptions import InconsistentVersionWarning
    warnings.filterwarnings("ignore", category=InconsistentVersionWarning)
except ImportError:
    pass
warnings.filterwarnings("ignore", message=".*InconsistentVersionWarning.*")

import db_handler
import os
import uuid
import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import streamlit as st
import wfdb
from sklearn.ensemble import RandomForestClassifier
from sklearn.manifold import TSNE
from sklearn.metrics import auc, confusion_matrix, roc_auc_score, roc_curve
from sklearn.preprocessing import StandardScaler

from chatbot import render_chatbot

# Configure matplotlib for dark theme
plt.rcParams['figure.facecolor'] = '#ffffff'
plt.rcParams['axes.facecolor'] = '#ffffff'
plt.rcParams['axes.edgecolor'] = '#e5e7eb'
plt.rcParams['axes.labelcolor'] = '#374151'
plt.rcParams['text.color'] = '#111827'
plt.rcParams['xtick.color'] = '#4b5563'
plt.rcParams['ytick.color'] = '#4b5563'
plt.rcParams['grid.color'] = '#e5e7eb'
plt.rcParams['grid.alpha'] = 0.5

# Page configuration
st.set_page_config(
    page_title="Sleep Apnea Detection System",
    page_icon="🏥",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Advanced Dark Tech Healthcare CSS
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    /* Global Theme - Zudoc Medical Light */
    .stApp {
        background: #ffffff !important;
        font-family: 'Inter', sans-serif;
        color: #030213;
    }
    
    /* Main Content Area */
    .main .block-container {
        padding-top: 2rem !important;
        padding-bottom: 2rem !important;
        max-width: 1000px;
        margin: 0 auto;
    }
    
    /* Header Section */
    .header-section {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.625rem;
        padding: 1.5rem;
        margin: 0 auto 1.5rem auto;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        max-width: 1000px;
    }
    
    .main-title {
        font-size: 1.8rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #030213;
        font-family: 'Inter', sans-serif;
    }
    
    .subtitle {
        font-size: 0.875rem;
        color: #717182;
        margin-bottom: 0.5rem;
    }
    
    .tech-badge {
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 500;
        display: inline-block;
        margin: 0.25rem;
        color: #4b5563;
    }
    
    /* Upload Section */
    .upload-section {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.625rem;
        padding: 1.5rem;
        margin: 1rem auto;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        max-width: 1000px;
    }
    
    .upload-area {
        border: 2px dashed #d1d5db;
        border-radius: 0.5rem;
        padding: 2.5rem;
        text-align: center;
        background: #f9fafb;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .upload-area:hover {
        border-color: #93c5fd;
        background: #eff6ff;
    }
    
    /* Medical Report Cards */
    .medical-report, .ecg-section {
        background: #ffffff;
        border: 1px solid #e5e7eb;
        border-radius: 0.625rem;
        padding: 2rem;
        margin: 1.5rem 0;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .report-header, .section-title {
        border-bottom: 1px solid #e5e7eb;
        padding-bottom: 1rem;
        margin-bottom: 1.5rem;
        font-size: 1.25rem;
        font-weight: 600;
        color: #030213;
    }
    
    .report-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #030213;
    }
    
    /* Diagnosis Cards */
    .diagnosis-card {
        background: #ffffff;
        border-radius: 0.625rem;
        padding: 2rem;
        margin: 1.5rem 0;
        text-align: center;
        border: 1px solid #e5e7eb;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    
    .normal-diagnosis {
        border-top: 4px solid #10b981;
    }
    
    .apnea-diagnosis {
        border-top: 4px solid #ef4444;
    }
    
    .diagnosis-title {
        font-size: 1.75rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
    }
    
    .normal-diagnosis .diagnosis-title { color: #059669; }
    .apnea-diagnosis .diagnosis-title { color: #dc2626; }
    
    .diagnosis-subtitle, .report-subtitle {
        font-size: 1rem;
        color: #4b5563;
        margin-bottom: 1rem;
    }
    
    .confidence-badge {
        background: #f3f4f6;
        color: #1f2937;
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        display: inline-block;
        border: 1px solid #e5e7eb;
    }
    
    .severity-badge {
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 0.875rem;
        display: inline-block;
        border: 1px solid transparent;
    }
    
    .severity-normal { background: #d1fae5; color: #065f46; border-color: #34d399; }
    .severity-mild { background: #fef3c7; color: #92400e; border-color: #fbbf24; }
    .severity-moderate { background: #ffedd5; color: #9a3412; border-color: #fb923c; }
    .severity-severe { background: #fee2e2; color: #991b1b; border-color: #f87171; }
    
    .medical-info {
        background: #f8fafc;
        border-left: 4px solid #3b82f6;
        border-radius: 0.375rem;
        padding: 1rem;
        margin: 1rem 0;
        color: #334155;
    }
    
    .tech-info {
        background: #f1f5f9;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        padding: 0.5rem;
        margin: 0.25rem 0;
        font-size: 0.75rem;
        color: #475569;
        text-align: center;
    }
    
    .disclaimer {
        background: #fffbeb;
        border: 1px solid #fde68a;
        border-radius: 0.375rem;
        padding: 1rem;
        margin: 1.5rem 0;
        color: #92400e;
        font-size: 0.875rem;
    }
    
    /* Buttons */
    .stButton > button {
        background: #ffffff;
        color: #374151;
        border: 1px solid #d1d5db;
        border-radius: 0.375rem;
        padding: 0.5rem 1rem;
        font-weight: 500;
        font-size: 0.875rem;
        transition: all 0.2s;
    }
    
    .stButton > button:hover {
        background: #f9fafb;
        border-color: #9ca3af;
    }
    
    button[kind="primary"] {
        background: #2563eb !important;
        color: white !important;
        border: none !important;
    }
    
    button[kind="primary"]:hover {
        background: #1d4ed8 !important;
    }
    
    /* Metrics */
    [data-testid="stMetricValue"] {
        color: #111827 !important;
        font-size: 1.875rem !important;
        font-weight: 600 !important;
    }
    [data-testid="stMetricLabel"] {
        color: #6b7280 !important;
    }
    
    /* Text Inputs */
    .stTextInput > div > div > input {
        background: #ffffff !important;
        border: 1px solid #d1d5db !important;
        color: #111827 !important;
        border-radius: 0.375rem !important;
    }
    .stTextInput > div > div > input:focus {
        border-color: #3b82f6 !important;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
    }
    
    /* File Uploader */
    .stFileUploader {
        background: #ffffff !important;
        border: 1px dashed #d1d5db !important;
        border-radius: 0.375rem !important;
    }
    
    /* Sidebar */
    .css-1d391kg, [data-testid="stSidebar"] {
        background: #f8fafc !important;
        border-right: 1px solid #e2e8f0 !important;
    }
    
    /* Progress Bars */
    .stProgress > div > div > div {
        background: #2563eb !important;
    }
    
    /* Info/Error/Success Messages */
    .stAlert {
        border-radius: 0.375rem !important;
    }
    
    /* Hide Streamlit Branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    .stDeployButton {display:none;}
    header {visibility: hidden;}
</style>
""", unsafe_allow_html=True)

# Clean up any existing temp files
temp_files = glob.glob("temp_*.dat")
for temp_file in temp_files:
    try:
        if os.path.exists(temp_file):
            os.remove(temp_file)
    except:
        pass  # Ignore cleanup errors

# Initialize session state
if 'analysis_done' not in st.session_state:
    st.session_state.analysis_done = False
if 'results' not in st.session_state:
    st.session_state.results = None
if 'file_hash' not in st.session_state:
    st.session_state.file_hash = None
if 'chat_messages' not in st.session_state:
    st.session_state.chat_messages = []
if 'chat_open' not in st.session_state:
    st.session_state.chat_open = False

# Import chatbot module (already imported at top)

# Feature extraction function
def extract_features(window):
    """Extract the same 12 features used in training"""
    features = []
    
    # Time domain features
    features.append(np.mean(window))
    features.append(np.std(window))
    features.append(np.min(window))
    features.append(np.max(window))
    features.append(np.median(window))
    features.append(np.percentile(window, 25))
    features.append(np.percentile(window, 75))
    
    # Signal energy
    features.append(np.sum(window**2))
    features.append(np.sqrt(np.mean(window**2)))  # RMS
    
    # Zero crossing rate
    zero_crossings = np.sum(np.diff(np.signbit(window)))
    features.append(zero_crossings)
    
    # Heart rate variability approximation
    diff = np.diff(window)
    features.append(np.std(diff))
    features.append(np.mean(np.abs(diff)))
    
    return np.array(features)

# Function to count apnea events from ECG signal (OPTIMIZED)
def count_apnea_events(ecg_signal, fs, model, scaler, window_size_sec=15, overlap=0.3, min_event_duration_sec=5, max_signal_duration_sec=300):
    """
    Count the number of apnea events in the ECG signal by analyzing it in smaller windows.
    OPTIMIZED VERSION - processes only first N seconds and uses fewer windows.
    
    Parameters:
    -----------
    ecg_signal : array-like
        Full ECG signal array
    fs : int
        Sampling frequency (Hz)
    model : sklearn model
        Trained apnea detection model
    scaler : sklearn scaler
        Feature scaler
    window_size_sec : float, default=15
        Size of analysis window in seconds (larger = fewer windows)
    overlap : float, default=0.3
        Overlap between windows (0-1) - reduced for speed
    min_event_duration_sec : float, default=5
        Minimum duration in seconds to consider as an apnea event
    max_signal_duration_sec : float, default=300
        Maximum signal duration to process (5 minutes) - for performance
        
    Returns:
    --------
    dict with keys:
        - num_events: Total number of apnea events
        - event_positions: List of (start_time, end_time) tuples for each event
        - event_durations: List of durations in seconds for each event
        - ahi: Apnea-Hypopnea Index (events per hour) - estimated
        - signal_duration_hours: Duration of the processed signal in hours
    """
    # Limit signal length for performance (process max 5 minutes)
    max_samples = int(max_signal_duration_sec * fs)
    processed_signal = ecg_signal[:min(len(ecg_signal), max_samples)]
    signal_duration_sec = len(processed_signal) / fs
    
    window_size_samples = int(window_size_sec * fs)
    step_size = int(window_size_samples * (1 - overlap))
    
    # Store predictions for each window
    apnea_predictions = []
    window_start_times = []
    
    # Batch process features for better performance
    windows = []
    valid_indices = []
    
    # Collect all windows first
    for start_idx in range(0, len(processed_signal) - window_size_samples, step_size):
        end_idx = start_idx + window_size_samples
        window = processed_signal[start_idx:end_idx]
        
        # Skip windows with invalid data
        if not (np.any(np.isnan(window)) or len(window) < window_size_samples):
            windows.append(window)
            valid_indices.append((start_idx, start_idx / fs))
    
    if len(windows) == 0:
        return {
            'num_events': 0,
            'event_positions': [],
            'event_durations': [],
            'ahi': 0,
            'signal_duration_hours': signal_duration_sec / 3600,
            'avg_event_duration': 0,
            'total_apnea_time_sec': 0,
            'apnea_percentage': 0
        }
    
    # Batch extract features
    features_list = []
    for window in windows:
        features = extract_features(window)
        features_list.append(features)
    
    # Batch scale and predict
    if len(features_list) > 0:
        features_array = np.array(features_list)
        features_scaled = scaler.transform(features_array)
        probabilities = model.predict_proba(features_scaled)[:, 1]
        
        # Consider as apnea if probability > 0.4
        for i, prob in enumerate(probabilities):
            apnea_predictions.append(1 if prob > 0.4 else 0)
            window_start_times.append(valid_indices[i][1])
    
    if len(apnea_predictions) == 0:
        return {
            'num_events': 0,
            'event_positions': [],
            'event_durations': [],
            'ahi': 0,
            'signal_duration_hours': signal_duration_sec / 3600,
            'avg_event_duration': 0,
            'total_apnea_time_sec': 0,
            'apnea_percentage': 0
        }
    
    apnea_timeline = np.array(apnea_predictions)
    window_start_times = np.array(window_start_times)
    
    # Find consecutive apnea windows (events)
    events = []
    in_event = False
    event_start = None
    
    for i, is_apnea in enumerate(apnea_timeline):
        if is_apnea and not in_event:
            # Start of new event
            in_event = True
            event_start = window_start_times[i]
        elif not is_apnea and in_event:
            # End of event
            event_end = window_start_times[i-1] + window_size_sec
            event_duration = event_end - event_start
            # Only count events longer than minimum duration
            if event_duration >= min_event_duration_sec:
                events.append((event_start, event_end))
            in_event = False
            event_start = None
    
    # Handle event that extends to the end of signal
    if in_event:
        event_end = window_start_times[-1] + window_size_sec
        event_duration = event_end - event_start
        if event_duration >= min_event_duration_sec:
            events.append((event_start, event_end))
    
    # Calculate statistics
    num_events = len(events)
    event_durations = [end - start for start, end in events]
    avg_event_duration = np.mean(event_durations) if event_durations else 0
    
    # Calculate AHI (Apnea-Hypopnea Index) - events per hour
    # Scale to full signal duration if we only processed part of it
    signal_duration_hours = signal_duration_sec / 3600
    if len(ecg_signal) > max_samples:
        # Extrapolate AHI based on processed portion
        scaling_factor = (len(ecg_signal) / fs) / signal_duration_sec
        estimated_events = num_events * scaling_factor
        full_duration_hours = (len(ecg_signal) / fs) / 3600
        ahi = estimated_events / full_duration_hours if full_duration_hours > 0 else 0
    else:
        ahi = num_events / signal_duration_hours if signal_duration_hours > 0 else 0
    
    return {
        'num_events': num_events,
        'event_positions': events,
        'event_durations': event_durations,
        'ahi': ahi,
        'signal_duration_hours': signal_duration_sec / 3600,
        'avg_event_duration': avg_event_duration,
        'total_apnea_time_sec': sum(event_durations),
        'apnea_percentage': (sum(event_durations) / signal_duration_sec * 100) if signal_duration_sec > 0 else 0
    }

def _patch_sklearn_estimator(estimator):
    """
    Patch a scikit-learn estimator loaded from an older version (<1.4)
    to add attributes introduced in newer versions. This prevents errors
    like: 'DecisionTreeClassifier' object has no attribute 'monotonic_cst'
    when unpickling models trained with sklearn 1.3.x and running on 1.4+.
    """
    if estimator is None:
        return estimator

    # Attributes added in sklearn 1.4+ that older pickles may be missing
    missing_attrs = {
        'monotonic_cst': None,
    }

    def _patch_one(obj):
        for attr, default in missing_attrs.items():
            if not hasattr(obj, attr):
                try:
                    setattr(obj, attr, default)
                except Exception:
                    pass

    # Patch the estimator itself
    _patch_one(estimator)

    # Patch any sub-estimators (e.g. trees inside RandomForest)
    sub_estimators = getattr(estimator, 'estimators_', None)
    if sub_estimators is not None:
        try:
            for sub in sub_estimators:
                _patch_one(sub)
                # Patch the underlying tree object too
                tree = getattr(sub, 'tree_', None)
                if tree is not None:
                    _patch_one(tree)
        except TypeError:
            pass

    # For single tree models
    tree = getattr(estimator, 'tree_', None)
    if tree is not None:
        _patch_one(tree)

    return estimator


# Create a proper model
@st.cache_data
def load_trained_model():
    """Load the actual trained model from file"""
    try:
        # Load the trained model and scaler
        model_data = joblib.load('best_sleep_apnea_model.pkl')
        
        if isinstance(model_data, dict):
            # If it's a dictionary with model and scaler
            model = model_data.get('model')
            scaler = model_data.get('scaler')
        else:
            # If it's just the model, create a new scaler
            model = model_data
            scaler = None

        # Patch model for compatibility with newer sklearn versions
        model = _patch_sklearn_estimator(model)
        
        # Create a new scaler and fit it with representative data
        scaler = StandardScaler()
        
        # Generate representative training data to fit the scaler
        # This mimics the actual training data distribution
        np.random.seed(42)
        n_samples = 1000
        
        # Normal ECG patterns (lower variability, regular patterns)
        normal_data = []
        for _ in range(n_samples // 2):
            t = np.linspace(0, 30, 3000)
            signal = np.sin(2 * np.pi * 1.2 * t) + 0.3 * np.sin(2 * np.pi * 0.8 * t) + 0.1 * np.random.randn(len(t))
            features = extract_features(signal)
            normal_data.append(features)
        
        # Apnea ECG patterns (higher variability, irregular patterns)
        apnea_data = []
        for _ in range(n_samples // 2):
            t = np.linspace(0, 30, 3000)
            signal = np.sin(2 * np.pi * 1.2 * t) + 0.5 * np.sin(2 * np.pi * 0.6 * t) + 0.3 * np.random.randn(len(t))
            if np.random.random() > 0.5:
                signal[1000:1500] += 0.5 * np.sin(2 * np.pi * 0.3 * t[1000:1500])
            features = extract_features(signal)
            apnea_data.append(features)
        
        # Combine data and fit scaler
        X = np.vstack([normal_data, apnea_data])
        scaler.fit(X)
        
        return model, scaler
    except Exception as e:
        st.error(f"Error loading trained model: {e}")
        # Fallback to dummy model
        return create_dummy_model(), StandardScaler()

def create_dummy_model():
    """Create a simple dummy model as fallback"""
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        class_weight='balanced'
    )
    
    # Generate synthetic training data that mimics real ECG patterns
    np.random.seed(42)
    n_samples = 1000
    
    # Normal ECG patterns (lower variability, regular patterns)
    normal_data = []
    for _ in range(n_samples // 2):
        # Generate normal ECG-like signal
        t = np.linspace(0, 30, 3000)  # 30 seconds at 100Hz
        signal = np.sin(2 * np.pi * 1.2 * t) + 0.3 * np.sin(2 * np.pi * 0.8 * t) + 0.1 * np.random.randn(len(t))
        features = extract_features(signal)
        normal_data.append(features)
    
    # Apnea ECG patterns (higher variability, irregular patterns)
    apnea_data = []
    for _ in range(n_samples // 2):
        # Generate apnea-like signal with more irregularity
        t = np.linspace(0, 30, 3000)
        signal = np.sin(2 * np.pi * 1.2 * t) + 0.5 * np.sin(2 * np.pi * 0.6 * t) + 0.3 * np.random.randn(len(t))
        # Add some irregular patterns
        if np.random.random() > 0.5:
            signal[1000:1500] += 0.5 * np.sin(2 * np.pi * 0.3 * t[1000:1500])
        features = extract_features(signal)
        apnea_data.append(features)
    
    # Combine data
    X = np.vstack([normal_data, apnea_data])
    y = np.hstack([np.zeros(n_samples // 2), np.ones(n_samples // 2)])
    
    # Train model
    model.fit(X, y)
    return model

# Load combined model for AHI and Severity prediction
@st.cache_data
def load_combined_model():
    """Load or train a model that uses both ECG features and patient data"""
    try:
        # Try to load existing model
        if os.path.exists('combined_apnea_model.pkl'):
            model_data = joblib.load('combined_apnea_model.pkl')
            # Patch loaded models for compatibility with newer sklearn versions
            apnea_model = _patch_sklearn_estimator(model_data.get('model'))
            ahi_model = _patch_sklearn_estimator(model_data.get('ahi_model'))
            severity_model = _patch_sklearn_estimator(model_data.get('severity_model'))
            return apnea_model, model_data.get('scaler'), ahi_model, severity_model, model_data.get('severity_map')
        
        # If model doesn't exist, train it from data.csv
        if not os.path.exists('data.csv'):
            return None, None, None, None, None
        
        # Load data
        df = pd.read_csv('data.csv')
        
        # Encode categorical variables
        df['Gender_encoded'] = df['Gender'].map({'Male': 1, 'Female': 0})
        df['Snoring_encoded'] = df['Snoring'].map({True: 1, False: 0})
        
        # Create feature matrix (Age, Gender, Snoring, SpO2, ECG_Heart_Rate, BMI)
        X_patient = df[['Age', 'Gender_encoded', 'Snoring_encoded', 'SpO2', 'ECG_Heart_Rate', 'BMI']].values
        
        # Target: Apnea detection (based on AHI > 5)
        y_apnea = (df['AHI'] > 5).astype(int).values
        
        # Target: AHI (regression)
        y_ahi = df['AHI'].values
        
        # Target: Severity (classification)
        severity_map = {'None': 0, 'Mild': 1, 'Moderate': 2, 'Severe': 3}
        y_severity = df['Severity'].map(severity_map).values
        
        # Scale features
        scaler = StandardScaler()
        X_patient_scaled = scaler.fit_transform(X_patient)
        
        # Train apnea detection model
        apnea_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, class_weight='balanced')
        apnea_model.fit(X_patient_scaled, y_apnea)
        
        # Train AHI regression model
        from sklearn.ensemble import RandomForestRegressor
        ahi_model = RandomForestRegressor(n_estimators=100, max_depth=10, random_state=42)
        ahi_model.fit(X_patient_scaled, y_ahi)
        
        # Train Severity classification model
        severity_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42, class_weight='balanced')
        severity_model.fit(X_patient_scaled, y_severity)
        
        # Save models
        model_data = {
            'model': apnea_model,
            'scaler': scaler,
            'ahi_model': ahi_model,
            'severity_model': severity_model,
            'severity_map': severity_map,
            'feature_names': ['Age', 'Gender', 'Snoring', 'SpO2', 'ECG_Heart_Rate', 'BMI']
        }
        try:
            joblib.dump(model_data, 'combined_apnea_model.pkl')
        except Exception as e:
            pass  # Silent fail during model saving in cache
        
        return apnea_model, scaler, ahi_model, severity_model, severity_map
        
    except Exception as e:
        st.warning(f"Could not load combined model: {e}. Using ECG-only prediction.")
        return None, None, None, None, None

# Process uploaded file
def process_file(uploaded_file, patient_data=None):
    """Process the uploaded ECG file and return results"""
    try:
        # Always process - don't cache based on file hash to ensure fresh results
        file_content = uploaded_file.read()
        file_hash = hash(file_content)
        
        # Only skip if explicitly told not to reprocess AND it's the exact same file
        # But we'll force reprocess on button click anyway
        if (st.session_state.file_hash == file_hash and 
            st.session_state.results is not None and 
            not st.session_state.get('force_reprocess', True)):  # Changed default to True
            return st.session_state.results, None
        
        # Reset file pointer
        uploaded_file.seek(0)
        
        if uploaded_file.name.endswith('.dat'):
            # Try to process .dat file directly without creating temp files
            try:
                # First try to process as binary data directly
                ecg_signal = np.frombuffer(file_content, dtype=np.int16).astype(np.float64)
                fs = 100
                ecg_signal = (ecg_signal - np.mean(ecg_signal)) / np.std(ecg_signal)
            except:
                # If that fails, try with wfdb using a unique temp file
                import tempfile
                import uuid
                
                temp_path = f"temp_{uuid.uuid4().hex}_{uploaded_file.name}"
                try:
                    with open(temp_path, 'wb') as f:
                        f.write(file_content)
                    
                    try:
                        record = wfdb.rdrecord(temp_path.replace('.dat', ''))
                        ecg_signal = record.p_signal[:, 0]
                        fs = int(record.fs)
                    except:
                        ecg_signal = np.frombuffer(file_content, dtype=np.int16).astype(np.float64)
                        fs = 100
                        ecg_signal = (ecg_signal - np.mean(ecg_signal)) / np.std(ecg_signal)
                    
                finally:
                    # Try to clean up temp file, but don't fail if it can't be deleted
                    try:
                        if os.path.exists(temp_path):
                            os.remove(temp_path)
                    except:
                        pass  # Ignore cleanup errors
                
        elif uploaded_file.name.endswith('.csv'):
            df = pd.read_csv(uploaded_file)
            ecg_signal = df.iloc[:, 0].values
            ecg_signal = ecg_signal[~np.isnan(ecg_signal)]
            fs = 100
            
        elif uploaded_file.name.endswith('.txt'):
            ecg_signal = np.loadtxt(uploaded_file)
            ecg_signal = ecg_signal[~np.isnan(ecg_signal)]
            fs = 100
        else:
            try:
                uploaded_file.seek(0)
                ecg_signal = np.loadtxt(uploaded_file)
                ecg_signal = ecg_signal[~np.isnan(ecg_signal)]
                fs = 100
            except:
                uploaded_file.seek(0)
                file_content = uploaded_file.read()
                ecg_signal = np.frombuffer(file_content, dtype=np.int16).astype(np.float64)
                fs = 100
                ecg_signal = (ecg_signal - np.mean(ecg_signal)) / np.std(ecg_signal)
        
        # Validate signal
        if len(ecg_signal) == 0:
            return None, "No valid data found in the uploaded file."
        
        min_samples = 30 * fs
        if len(ecg_signal) < min_samples:
            return None, f"Signal too short! Need at least {min_samples} samples. Found {len(ecg_signal)} samples."
        
        if np.all(np.isnan(ecg_signal)) or np.all(ecg_signal == 0):
            return None, "Invalid signal data: all values are NaN or zero."
        
        # Load trained model and scaler
        model, scaler = load_trained_model()
        
        # Skip model info display for faster loading
        
        # Count apnea events from signal (optimized - only first 60 seconds for faster processing ~10 sec target)
        with st.spinner("🔍 Analyzing ECG signal (this may take a few seconds)..."):
            # Limit to 60 seconds for much faster processing
            max_analysis_samples = min(len(ecg_signal), 60 * fs)
            event_stats = count_apnea_events(ecg_signal[:max_analysis_samples], fs, model, scaler, 
                                              max_signal_duration_sec=60, window_size_sec=15, overlap=0.2)
        
        # Also analyze first 30 seconds for initial assessment
        window_size = 30 * fs
        ecg_window = ecg_signal[:min(window_size, len(ecg_signal))]
        
        # Extract features from first 30 seconds for initial assessment
        features = extract_features(ecg_window)
        features = features.reshape(1, -1)
        
        # Show extracted features for transparency
        with st.expander("🔍 View Extracted Features"):
            feature_names = [
                "Mean", "Std Dev", "Min", "Max", "Median", 
                "25th Percentile", "75th Percentile", "Energy", 
                "RMS", "Zero Crossings", "Std of Diff", "Mean Abs Diff"
            ]
            feature_df = pd.DataFrame({
                'Feature': feature_names,
                'Value': features[0]
            })
            st.dataframe(feature_df, use_container_width=True)
        
        # Scale features using the trained scaler
        features_scaled = scaler.transform(features.reshape(1, -1))
        
        # Make prediction for initial assessment
        prediction = model.predict(features_scaled)[0]
        probability = model.predict_proba(features_scaled)[0]
        
        # Use the model's actual prediction probability
        apnea_prob = probability[1] * 100
        
        # Calculate ECG Heart Rate from signal (simplified method)
        try:
            # Find peaks in the signal
            signal_std = np.std(ecg_window)
            if signal_std > 0:
                # Find local maxima (simplified peak detection)
                peaks = []
                for i in range(1, len(ecg_window) - 1):
                    if ecg_window[i] > ecg_window[i-1] and ecg_window[i] > ecg_window[i+1] and ecg_window[i] > np.mean(ecg_window) + signal_std:
                        peaks.append(i)
                
                if len(peaks) > 1:
                    # Calculate average time between peaks
                    peak_intervals = np.diff(peaks) / fs  # in seconds
                    avg_interval = np.mean(peak_intervals)
                    if avg_interval > 0:
                        ecg_heart_rate = int(60 / avg_interval)
                    else:
                        ecg_heart_rate = 72
                else:
                    ecg_heart_rate = 72
            else:
                ecg_heart_rate = 72
        except:
            ecg_heart_rate = 72
        
        # Validate heart rate range
        if ecg_heart_rate < 40 or ecg_heart_rate > 150:
            ecg_heart_rate = 72  # Default if calculation is off
        
        # Predict AHI and Severity using combined model if patient data is available
        predicted_ahi = None
        predicted_severity = None
        
        if patient_data:
            try:
                combined_model, combined_scaler, ahi_model, severity_model, severity_map = load_combined_model()
                
                if combined_model and combined_scaler and ahi_model and severity_model:
                    # Prepare patient features
                    # Get BMI from patient data (calculated from height/weight)
                    bmi = patient_data.get('bmi', 25.0)
                    if bmi is None or bmi <= 0:
                        # Calculate from height and weight if available
                        height = patient_data.get('height', 170.0)
                        weight = patient_data.get('weight', 70.0)
                        if height > 0:
                            height_m = height / 100.0
                            bmi = weight / (height_m ** 2)
                        else:
                            bmi = 25.0
                    
                    # Encode patient data
                    gender_encoded = 1 if patient_data.get('gender', 'Male') == 'Male' else 0
                    snoring_encoded = 1 if patient_data.get('snoring', 'No') == 'Yes' else 0
                    age = patient_data.get('age', 40)
                    spo2 = patient_data.get('spo2', 95.0)
                    
                    # Create feature array: [Age, Gender, Snoring, SpO2, ECG_Heart_Rate, BMI]
                    patient_features = np.array([[age, gender_encoded, snoring_encoded, spo2, ecg_heart_rate, bmi]])
                    patient_features_scaled = combined_scaler.transform(patient_features)
                    
                    # Predict AHI using combined model
                    predicted_ahi_combined = max(0, float(ahi_model.predict(patient_features_scaled)[0]))
                    
                    # Also get AHI from ECG event detection if available
                    ahi_from_ecg = event_stats.get('ahi', 0)
                    
                    # Check if patient vitals strongly suggest normal (conservative approach)
                    # High SpO2 (>96), no snoring, normal BMI (18.5-25), younger age (<40)
                    strong_normal_indicators = (
                        spo2 > 96 and 
                        snoring_encoded == 0 and 
                        18.5 <= bmi <= 25 and 
                        age < 40 and
                        ahi_from_ecg == 0
                    )
                    
                    # If strong normal indicators and predicted AHI is borderline, be more conservative
                    if strong_normal_indicators and predicted_ahi_combined < 8:
                        # Cap the AHI at a lower value for normal cases
                        predicted_ahi_combined = min(predicted_ahi_combined, 3.0)
                    
                    # Use weighted average: 70% combined model, 30% ECG-based if events detected
                    if ahi_from_ecg > 0:
                        predicted_ahi = 0.7 * predicted_ahi_combined + 0.3 * ahi_from_ecg
                    else:
                        predicted_ahi = predicted_ahi_combined
                    
                    # Predict Severity using combined model
                    severity_pred = severity_model.predict(patient_features_scaled)[0]
                    reverse_severity_map = {v: k for k, v in severity_map.items()}
                    predicted_severity = reverse_severity_map.get(severity_pred, 'None')  # Default to 'None' instead of 'Mild'
                    
                    # Override severity if we have strong normal indicators and low predicted AHI
                    if strong_normal_indicators and predicted_ahi_combined < 5:
                        predicted_severity = 'None'
                    
            except Exception as e:
                st.warning(f"Could not use combined model: {e}")
        
        # Determine severity and prediction - PRIORITIZE AHI FIRST
        # Priority: 1) predicted_ahi, 2) event_stats AHI, 3) predicted_severity, 4) ECG probability
        
        # First, check if we have a predicted AHI (from combined model)
        if predicted_ahi is not None and predicted_ahi >= 0:
            # Use predicted AHI as primary indicator
            if predicted_ahi < 5:
                severity = "Normal"
                severity_class = "normal"
                prediction = 0
                # Override predicted_severity if AHI indicates normal
                if predicted_severity and predicted_severity != 'None':
                    predicted_severity = 'None'
            elif predicted_ahi < 15:
                severity = "Mild"
                severity_class = "mild"
                prediction = 1
            elif predicted_ahi < 30:
                severity = "Moderate"
                severity_class = "moderate"
                prediction = 1
            else:
                severity = "Severe"
                severity_class = "severe"
                prediction = 1
        # Second, check ECG event detection AHI (only if we have events detected)
        elif event_stats.get('num_events', 0) > 0:
            # Use AHI from event detection
            ahi = event_stats.get('ahi', 0)
            if ahi < 5:
                severity = "Normal"
                severity_class = "normal"
                prediction = 0
            elif ahi < 15:
                severity = "Mild"
                severity_class = "mild"
                prediction = 1
            elif ahi < 30:
                severity = "Moderate"
                severity_class = "moderate"
                prediction = 1
            else:
                severity = "Severe"
                severity_class = "severe"
                prediction = 1
        # Third, check if we have no events and low probability - definitely normal
        elif event_stats.get('num_events', 0) == 0 and apnea_prob < 35:
            severity = "Normal"
            severity_class = "normal"
            prediction = 0
        # Fourth, check predicted_severity from combined model (if no AHI available)
        elif predicted_severity:
            severity = predicted_severity
            if severity == 'None':
                severity = 'Normal'
                severity_class = 'normal'
                prediction = 0
            elif severity == 'Mild':
                severity_class = 'mild'
                prediction = 1
            elif severity == 'Moderate':
                severity_class = 'moderate'
                prediction = 1
            elif severity == 'Severe':
                severity_class = 'severe'
                prediction = 1
            else:
                # Unknown severity, default to normal to be conservative
                severity = 'Normal'
                severity_class = 'normal'
                prediction = 0
        # Fifth, fallback to probability-based classification (ECG only)
        else:
            # Use conservative threshold for normal - be more lenient towards normal
            if apnea_prob < 35:  # More conservative threshold
                severity = "Normal"
                severity_class = "normal"
                prediction = 0
            elif apnea_prob < 55:  # Adjusted threshold
                severity = "Mild"
                severity_class = "mild"
                prediction = 1
            elif apnea_prob < 75:  # Adjusted threshold
                severity = "Moderate"
                severity_class = "moderate"
                prediction = 1
            else:
                severity = "Severe"
                severity_class = "severe"
                prediction = 1
        
        # Prepare results
        results = {
            'prediction': prediction,
            'probability': [1-apnea_prob/100, apnea_prob/100],
            'confidence': max(1-apnea_prob/100, apnea_prob/100) * 100,
            'apnea_prob': apnea_prob,
            'severity': severity,
            'severity_class': severity_class,
            'predicted_ahi': predicted_ahi,  # AHI from combined model
            'predicted_severity': predicted_severity,  # Severity from combined model
            'ecg_signal': ecg_signal,  # Store full signal for event visualization
            'ecg_window': ecg_window,  # First 30 seconds for initial display
            'fs': fs,
            'file_name': uploaded_file.name,
            'analysis_date': datetime.now().strftime('%B %d, %Y at %I:%M %p'),
            'file_hash': file_hash,
            'event_stats': event_stats,  # Include event counting statistics
            'patient_data': patient_data  # Store patient data
        }
        
        # Store in session state
        st.session_state.file_hash = file_hash
        st.session_state.results = results
        st.session_state.force_reprocess = False  # Reset reprocess flag
        
        return results, None
        
    except Exception as e:
        return None, f"Error processing file: {str(e)}"

def plot_roc_curves_comparison(y_true, y_scores_dict, figsize=(10, 8), 
                                 title='ROC Curves Comparison - Sleep Apnea Detection Models',
                                 save_path=None):
    """
    Plot ROC curves comparing multiple machine learning models.
    
    Parameters:
    -----------
    y_true : array-like
        True binary labels (ground truth)
    y_scores_dict : dict
        Dictionary with model names as keys and prediction probabilities as values.
        Example: {'Random Forest': y_proba1, 'SVM': y_proba2, ...}
    figsize : tuple, default=(10, 8)
        Figure size (width, height) in inches
    title : str, default='ROC Curves Comparison - Sleep Apnea Detection Models'
        Title for the plot
    save_path : str, optional
        Path to save the figure. If None, figure is not saved.
    
    Returns:
    --------
    fig : matplotlib.figure.Figure
        The matplotlib figure object
    ax : matplotlib.axes.Axes
        The matplotlib axes object
    auc_scores : dict
        Dictionary with model names as keys and AUC scores as values
    """
    # Set style for medical/professional plots
    try:
        plt.style.use('seaborn-v0_8-darkgrid')
    except:
        plt.style.use('seaborn-darkgrid')
    sns.set_palette("husl")
    
    # Create figure and axis
    fig, ax = plt.subplots(figsize=figsize, facecolor='white')
    
    # Define color palette for different models (medical-friendly colors)
    colors = ['#2c3e50', '#3498db', '#e74c3c', '#27ae60', '#f39c12', 
              '#9b59b6', '#1abc9c', '#34495e', '#e67e22', '#16a085']
    
    # Dictionary to store AUC scores
    auc_scores = {}
    
    # Plot diagonal line (random classifier)
    ax.plot([0, 1], [0, 1], 'k--', linewidth=1.5, alpha=0.5, 
            label='Random Classifier (AUC = 0.50)')
    
    # Process each model
    for idx, (model_name, y_scores) in enumerate(y_scores_dict.items()):
        # Calculate ROC curve
        fpr, tpr, thresholds = roc_curve(y_true, y_scores)
        roc_auc = auc(fpr, tpr)
        auc_scores[model_name] = roc_auc
        
        # Plot ROC curve with different color for each model
        color = colors[idx % len(colors)]
        ax.plot(fpr, tpr, color=color, linewidth=2.5, alpha=0.9,
               label=f'{model_name} (AUC = {roc_auc:.3f})')
    
    # Customize the plot
    ax.set_xlabel('False Positive Rate (1 - Specificity)', fontsize=12, fontweight='bold')
    ax.set_ylabel('True Positive Rate (Sensitivity)', fontsize=12, fontweight='bold')
    ax.set_title(title, fontsize=14, fontweight='bold', pad=20)
    
    # Set grid
    ax.grid(True, alpha=0.3, linestyle='--', linewidth=0.5)
    ax.set_facecolor('#fafafa')
    
    # Set limits
    ax.set_xlim([-0.02, 1.02])
    ax.set_ylim([-0.02, 1.02])
    
    # Add legend with AUC scores
    legend = ax.legend(loc='lower right', fontsize=10, frameon=True, 
                      fancybox=True, shadow=True, framealpha=0.95)
    legend.get_frame().set_facecolor('white')
    legend.get_frame().set_edgecolor('#cccccc')
    
    # Remove top and right spines for cleaner look
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_linewidth(1.5)
    ax.spines['bottom'].set_linewidth(1.5)
    
    # Add text box with summary statistics
    textstr = f'Total Models: {len(y_scores_dict)}\n'
    textstr += f'Best AUC: {max(auc_scores.values()):.3f}'
    props = dict(boxstyle='round', facecolor='wheat', alpha=0.5)
    ax.text(0.02, 0.98, textstr, transform=ax.transAxes, fontsize=9,
           verticalalignment='top', bbox=props, fontweight='bold')
    
    # Tight layout
    plt.tight_layout()
    
    # Save figure if path provided
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches='tight', facecolor='white')
    
    return fig, ax, auc_scores

def plot_confusion_matrix_heatmap(y_true, y_pred, model_name='Classifier', 
                                   class_labels=None, figsize=(8, 6), 
                                   save_path=None, normalize=False):
    """
    Plot a publication-ready confusion matrix heatmap using seaborn and matplotlib.
    
    Parameters:
    -----------
    y_true : array-like
        True binary labels (ground truth)
    y_pred : array-like
        Predicted labels from the model
    model_name : str, default='Classifier'
        Name of the model to display in the title
    class_labels : list, optional
        Custom class labels (e.g., ['Normal', 'Apnea']). 
        If None, defaults to ['Class 0', 'Class 1']
    figsize : tuple, default=(8, 6)
        Figure size (width, height) in inches
    save_path : str, optional
        Path to save the figure. If None, figure is not saved.
    normalize : bool, default=False
        If True, normalize the confusion matrix to show percentages
    
    Returns:
    --------
    fig : matplotlib.figure.Figure
        The matplotlib figure object
    ax : matplotlib.axes.Axes
        The matplotlib axes object
    cm : numpy.ndarray
        The confusion matrix array
    """
    # Set style for medical/professional plots
    try:
        plt.style.use('seaborn-v0_8-whitegrid')
    except:
        plt.style.use('seaborn-whitegrid')
    sns.set_palette("husl")
    
    # Create figure and axis
    fig, ax = plt.subplots(figsize=figsize, facecolor='white')
    
    # Compute confusion matrix
    cm = confusion_matrix(y_true, y_pred)
    
    # Normalize if requested
    if normalize:
        cm_percent = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis] * 100
        cm_display = cm_percent
        fmt = '.1f'
    else:
        cm_display = cm
        fmt = 'd'
    
    # Set default class labels if not provided
    if class_labels is None:
        unique_labels = sorted(np.unique(np.concatenate([y_true, y_pred])))
        class_labels = [f'Class {label}' for label in unique_labels]
    
    # Create heatmap using seaborn
    sns.heatmap(cm_display, annot=True, fmt=fmt, cmap='Blues', 
                cbar_kws={'label': 'Count' if not normalize else 'Percentage (%)'},
                square=True, linewidths=1, linecolor='gray',
                xticklabels=class_labels, yticklabels=class_labels,
                ax=ax, vmin=0, vmax=None if normalize else None,
                annot_kws={'size': 12, 'weight': 'bold'})
    
    # Customize the plot
    ax.set_xlabel('Predicted Label', fontsize=12, fontweight='bold', labelpad=10)
    ax.set_ylabel('True Label', fontsize=12, fontweight='bold', labelpad=10)
    ax.set_title(f'Confusion Matrix – {model_name}', 
                fontsize=14, fontweight='bold', pad=15)
    
    # Set tick parameters for better readability
    ax.tick_params(axis='both', which='major', labelsize=10)
    ax.tick_params(axis='both', which='minor', labelsize=8)
    
    # Add grid lines for better visibility
    ax.grid(True, alpha=0.3, linestyle='--', linewidth=0.5)
    
    # Calculate and display metrics
    total = np.sum(cm)
    correct = np.trace(cm)
    accuracy = correct / total * 100
    
    # Calculate per-class metrics
    sensitivity = cm[1, 1] / (cm[1, 1] + cm[1, 0]) * 100 if (cm[1, 1] + cm[1, 0]) > 0 else 0
    specificity = cm[0, 0] / (cm[0, 0] + cm[0, 1]) * 100 if (cm[0, 0] + cm[0, 1]) > 0 else 0
    
    # Add text box with metrics
    textstr = f'Accuracy: {accuracy:.2f}%\n'
    textstr += f'Sensitivity: {sensitivity:.2f}%\n'
    textstr += f'Specificity: {specificity:.2f}%'
    props = dict(boxstyle='round', facecolor='wheat', alpha=0.7, edgecolor='gray')
    ax.text(0.02, 0.98, textstr, transform=ax.transAxes, fontsize=9,
           verticalalignment='top', bbox=props, fontweight='bold',
           family='monospace')
    
    # Tight layout
    plt.tight_layout()
    
    # Save figure if path provided
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches='tight', facecolor='white')
    
    return fig, ax, cm

def plot_feature_importance(model, feature_names=None, top_n=10, 
                              figsize=(10, 6), 
                              title='Feature Importance – Sleep Apnea Detection',
                              save_path=None):
    """
    Visualize feature importance from a trained Random Forest model using Seaborn and Matplotlib.
    
    Parameters:
    -----------
    model : sklearn model
        Trained Random Forest model (or any model with feature_importances_ attribute)
    feature_names : list, optional
        List of feature names. If None, defaults to ['Feature 0', 'Feature 1', ...]
    top_n : int, default=10
        Number of top features to display (sorted by importance)
    figsize : tuple, default=(10, 6)
        Figure size (width, height) in inches
    title : str, default='Feature Importance – Sleep Apnea Detection'
        Title for the plot
    save_path : str, optional
        Path to save the figure. If None, figure is not saved.
    
    Returns:
    --------
    fig : matplotlib.figure.Figure
        The matplotlib figure object
    ax : matplotlib.axes.Axes
        The matplotlib axes object
    df_importance : pandas.DataFrame
        DataFrame with feature names and importance scores
    """
    # Check if model has feature_importances_ attribute
    if not hasattr(model, 'feature_importances_'):
        raise AttributeError("Model does not have 'feature_importances_' attribute. "
                           "This function is designed for tree-based models like Random Forest.")
    
    # Get feature importances
    importances = model.feature_importances_
    
    # Set default feature names if not provided
    if feature_names is None:
        feature_names = [f'Feature {i}' for i in range(len(importances))]
    
    # Create DataFrame mapping feature names to importance scores
    df_importance = pd.DataFrame({
        'Feature': feature_names,
        'Importance': importances
    })
    
    # Sort by importance (descending) and select top N
    df_importance = df_importance.sort_values('Importance', ascending=False).head(top_n)
    
    # Set style for medical/professional plots
    try:
        plt.style.use('seaborn-v0_8-whitegrid')
    except:
        plt.style.use('seaborn-whitegrid')
    sns.set_palette("husl")
    
    # Create figure and axis
    fig, ax = plt.subplots(figsize=figsize, facecolor='white')
    
    # Define professional color palette (medical/research theme)
    colors = sns.color_palette("Blues_r", n_colors=len(df_importance))
    
    # Create horizontal bar chart using Seaborn
    sns.barplot(data=df_importance, y='Feature', x='Importance', 
                palette=colors, ax=ax, orient='h')
    
    # Customize the plot
    ax.set_xlabel('Importance Score', fontsize=12, fontweight='bold', labelpad=10)
    ax.set_ylabel('Features', fontsize=12, fontweight='bold', labelpad=10)
    ax.set_title(title, fontsize=14, fontweight='bold', pad=15)
    
    # Add grid lines for better readability
    ax.grid(True, alpha=0.3, linestyle='--', linewidth=0.5, axis='x')
    ax.set_axisbelow(True)
    
    # Format x-axis to show percentages
    ax.tick_params(axis='both', which='major', labelsize=10)
    ax.tick_params(axis='both', which='minor', labelsize=8)
    
    # Remove top and right spines for cleaner look
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_linewidth(1.5)
    ax.spines['bottom'].set_linewidth(1.5)
    
    # Add value labels on bars
    for i, (idx, row) in enumerate(df_importance.iterrows()):
        importance_value = row['Importance']
        ax.text(importance_value + 0.005, i, f'{importance_value:.4f}', 
               va='center', fontsize=9, fontweight='bold')
    
    # Add text box with summary statistics
    total_importance = df_importance['Importance'].sum()
    textstr = f'Top {top_n} Features\n'
    textstr += f'Total Importance: {total_importance:.4f}\n'
    textstr += f'Most Important: {df_importance.iloc[0]["Feature"]}'
    props = dict(boxstyle='round', facecolor='wheat', alpha=0.7, edgecolor='gray')
    ax.text(0.98, 0.02, textstr, transform=ax.transAxes, fontsize=9,
           verticalalignment='bottom', horizontalalignment='right',
           bbox=props, fontweight='bold', family='monospace')
    
    # Tight layout
    plt.tight_layout()
    
    # Save figure if path provided
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches='tight', facecolor='white')
    
    return fig, ax, df_importance

def plot_ecg_comparison(duration=30, sampling_rate=100, apnea_start_time=15, 
                         noise_level=0.05, amplitude_reduction=0.5,
                         figsize=(14, 6), title='ECG Signal Comparison: Normal vs Apnea',
                         save_path=None):
    """
    Simulate and plot ECG signals comparing normal vs apnea (abnormal) segments.
    
    Parameters:
    -----------
    duration : float, default=30
        Duration of the signal in seconds
    sampling_rate : int, default=100
        Sampling rate in Hz
    apnea_start_time : float, default=15
        Time (in seconds) when apnea begins (amplitude reduction starts)
    noise_level : float, default=0.05
        Level of noise to add for realism
    amplitude_reduction : float, default=0.5
        Fraction of amplitude reduction during apnea (0.5 = 50% reduction)
    figsize : tuple, default=(14, 6)
        Figure size (width, height) in inches
    title : str, default='ECG Signal Comparison: Normal vs Apnea'
        Title for the plot
    save_path : str, optional
        Path to save the figure. If None, figure is not saved.
    
    Returns:
    --------
    fig : matplotlib.figure.Figure
        The matplotlib figure object
    ax : matplotlib.axes.Axes
        The matplotlib axes object (or array of axes if subplots)
    signals : dict
        Dictionary containing time, normal_ecg, and apnea_ecg arrays
    """
    # Set style for medical/professional plots
    try:
        plt.style.use('seaborn-v0_8-whitegrid')
    except:
        plt.style.use('seaborn-whitegrid')
    sns.set_palette("husl")
    
    # Generate time axis
    t = np.linspace(0, duration, int(sampling_rate * duration))
    
    # Generate normal ECG signal
    # Use multiple sinusoidal components to simulate realistic ECG waveform
    # QRS complex frequency (heartbeat ~1.2 Hz = 72 bpm)
    heart_rate = 1.2  # Hz (72 beats per minute)
    
    # Create base ECG signal with QRS complexes
    normal_ecg = np.zeros_like(t)
    
    # QRS complex simulation (main heartbeat peaks)
    for i in range(int(duration * heart_rate)):
        peak_time = i / heart_rate
        if peak_time < duration:
            # QRS complex - sharp peak
            qrs_center = peak_time
            qrs_width = 0.1  # 100ms QRS duration
            qrs_indices = np.where((t >= qrs_center - qrs_width/2) & 
                                  (t <= qrs_center + qrs_width/2))[0]
            if len(qrs_indices) > 0:
                # Create QRS complex shape
                qrs_signal = np.exp(-((t[qrs_indices] - qrs_center)**2) / (2 * (qrs_width/3)**2))
                normal_ecg[qrs_indices] += 0.8 * qrs_signal
    
    # Add P-wave (before QRS)
    for i in range(int(duration * heart_rate)):
        peak_time = i / heart_rate
        p_time = peak_time - 0.2  # P-wave 200ms before QRS
        if p_time >= 0 and p_time < duration:
            p_width = 0.08
            p_indices = np.where((t >= p_time - p_width/2) & 
                               (t <= p_time + p_width/2))[0]
            if len(p_indices) > 0:
                p_signal = np.exp(-((t[p_indices] - p_time)**2) / (2 * (p_width/3)**2))
                normal_ecg[p_indices] += 0.2 * p_signal
    
    # Add T-wave (after QRS)
    for i in range(int(duration * heart_rate)):
        peak_time = i / heart_rate
        t_time = peak_time + 0.3  # T-wave 300ms after QRS
        if t_time >= 0 and t_time < duration:
            t_width = 0.15
            t_indices = np.where((t >= t_time - t_width/2) & 
                               (t <= t_time + t_width/2))[0]
            if len(t_indices) > 0:
                t_signal = np.exp(-((t[t_indices] - t_time)**2) / (2 * (t_width/3)**2))
                normal_ecg[t_indices] += 0.3 * t_signal
    
    # Add smooth sinusoidal baseline variation
    baseline = 0.1 * np.sin(2 * np.pi * 0.1 * t)  # Slow respiratory variation
    normal_ecg += baseline
    
    # Add noise for realism
    noise = np.random.normal(0, noise_level, size=len(t))
    normal_ecg += noise
    
    # Generate apnea ECG signal (amplitude reduction after apnea_start_time)
    apnea_ecg = normal_ecg.copy()
    
    # Find indices where apnea begins
    apnea_indices = np.where(t >= apnea_start_time)[0]
    
    if len(apnea_indices) > 0:
        # Gradually reduce amplitude to simulate apnea effect
        # Create smooth transition
        transition_time = 2.0  # 2 seconds transition
        transition_samples = int(transition_time * sampling_rate)
        
        # Smooth amplitude reduction
        for i, idx in enumerate(apnea_indices):
            if i < transition_samples:
                # Gradual transition
                reduction_factor = 1 - (amplitude_reduction * (i / transition_samples))
            else:
                # Full reduction after transition
                reduction_factor = 1 - amplitude_reduction
            
            apnea_ecg[idx] *= reduction_factor
        
        # Add irregular variations during apnea (simulating breathing irregularities)
        apnea_signal_length = len(apnea_indices)
        irregularity = 0.15 * np.sin(2 * np.pi * 0.5 * t[apnea_indices]) * \
                       (1 + 0.3 * np.random.random(apnea_signal_length))
        apnea_ecg[apnea_indices] += irregularity
    
    # Create figure with subplots
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=figsize, facecolor='white', 
                                   sharex=True, sharey=False)
    
    # Plot Normal ECG
    ax1.plot(t, normal_ecg, color='#3498db', linewidth=1.5, alpha=0.9, 
            label='Normal ECG')
    ax1.set_ylabel('Amplitude (mV)', fontsize=12, fontweight='bold', labelpad=10)
    ax1.set_title('Normal ECG Signal', fontsize=13, fontweight='bold', pad=10)
    ax1.grid(True, alpha=0.3, linestyle='--', linewidth=0.5)
    ax1.legend(loc='upper right', fontsize=10, frameon=True, 
              fancybox=True, shadow=True, framealpha=0.95)
    
    # Add annotation for normal breathing
    ax1.text(0.98, 0.95, 'Normal Breathing Pattern', transform=ax1.transAxes,
            bbox=dict(boxstyle='round,pad=0.5', facecolor='#27ae60', alpha=0.8, 
                     edgecolor='darkgreen'),
            fontsize=10, fontweight='bold', verticalalignment='top', 
            horizontalalignment='right', color='white')
    
    # Plot Apnea ECG
    ax2.plot(t, apnea_ecg, color='#e74c3c', linewidth=1.5, alpha=0.9, 
            label='Apnea ECG')
    
    # Highlight apnea region
    apnea_mask = t >= apnea_start_time
    ax2.fill_between(t, apnea_ecg, where=apnea_mask, alpha=0.3, 
                     color='#e74c3c', label='Apnea Region')
    
    # Add vertical line to mark apnea start
    ax2.axvline(x=apnea_start_time, color='#f39c12', linestyle='--', 
               linewidth=2, alpha=0.8, label='Apnea Onset')
    
    ax2.set_xlabel('Time (seconds)', fontsize=12, fontweight='bold', labelpad=10)
    ax2.set_ylabel('Amplitude (mV)', fontsize=12, fontweight='bold', labelpad=10)
    ax2.set_title('Apnea ECG Signal (Amplitude Reduction)', fontsize=13, 
                 fontweight='bold', pad=10)
    ax2.grid(True, alpha=0.3, linestyle='--', linewidth=0.5)
    ax2.legend(loc='upper right', fontsize=10, frameon=True, 
              fancybox=True, shadow=True, framealpha=0.95)
    
    # Add annotation for apnea
    ax2.text(0.98, 0.95, 'Sleep Apnea Detected', transform=ax2.transAxes,
            bbox=dict(boxstyle='round,pad=0.5', facecolor='#e74c3c', alpha=0.8, 
                     edgecolor='darkred'),
            fontsize=10, fontweight='bold', verticalalignment='top', 
            horizontalalignment='right', color='white')
    
    # Remove top and right spines for cleaner look
    for ax in [ax1, ax2]:
        ax.spines['top'].set_visible(False)
        ax.spines['right'].set_visible(False)
        ax.spines['left'].set_linewidth(1.5)
        ax.spines['bottom'].set_linewidth(1.5)
        ax.set_facecolor('#fafafa')
    
    # Set overall title
    fig.suptitle(title, fontsize=16, fontweight='bold', y=0.995)
    
    # Tight layout
    plt.tight_layout(rect=[0, 0, 1, 0.97])
    
    # Save figure if path provided
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches='tight', facecolor='white')
    
    # Prepare signals dictionary
    signals = {
        'time': t,
        'normal_ecg': normal_ecg,
        'apnea_ecg': apnea_ecg,
        'sampling_rate': sampling_rate,
        'duration': duration
    }
    
    return fig, [ax1, ax2], signals

def plot_tsne_visualization(X, y, n_components=2, random_state=42, 
                             perplexity=30, n_iter=1000, figsize=(10, 8),
                             title='t-SNE Visualization – Sleep Apnea Detection Feature Distribution',
                             class_labels=None, save_path=None):
    """
    Visualize feature distribution using t-SNE for binary classification.
    
    Parameters:
    -----------
    X : array-like of shape (n_samples, n_features)
        Feature matrix
    y : array-like of shape (n_samples,)
        Binary labels (0=Normal, 1=Apnea)
    n_components : int, default=2
        Number of components for t-SNE (should be 2 for 2D visualization)
    random_state : int, default=42
        Random state for reproducibility
    perplexity : float, default=30
        Perplexity parameter for t-SNE (typically between 5-50)
    n_iter : int, default=1000
        Maximum number of iterations for t-SNE
    figsize : tuple, default=(10, 8)
        Figure size (width, height) in inches
    title : str, default='t-SNE Visualization – Sleep Apnea Detection Feature Distribution'
        Title for the plot
    class_labels : dict, optional
        Dictionary mapping class values to labels (e.g., {0: 'Normal', 1: 'Apnea'})
        If None, defaults to {0: 'Normal', 1: 'Apnea'}
    save_path : str, optional
        Path to save the figure. If None, figure is not saved.
    
    Returns:
    --------
    fig : matplotlib.figure.Figure
        The matplotlib figure object
    ax : matplotlib.axes.Axes
        The matplotlib axes object
    tsne_df : pandas.DataFrame
        DataFrame with t-SNE reduced features and labels
    """
    # Set default class labels if not provided
    if class_labels is None:
        class_labels = {0: 'Normal', 1: 'Apnea'}
    
    # Convert to numpy arrays if needed
    X = np.array(X)
    y = np.array(y)
    
    # Check input shapes
    if len(X) != len(y):
        raise ValueError(f"X and y must have the same length. Got {len(X)} and {len(y)}")
    
    if n_components != 2:
        raise ValueError("For visualization, n_components must be 2")
    
    # Set style for medical/professional plots
    try:
        plt.style.use('seaborn-v0_8-whitegrid')
    except:
        plt.style.use('seaborn-whitegrid')
    sns.set_palette("husl")
    
    # Apply t-SNE
    print("Applying t-SNE dimensionality reduction...")
    tsne = TSNE(n_components=n_components, random_state=random_state, 
                perplexity=perplexity, n_iter=n_iter, verbose=0)
    X_tsne = tsne.fit_transform(X)
    
    # Create DataFrame with reduced features and labels
    tsne_df = pd.DataFrame({
        't-SNE Component 1': X_tsne[:, 0],
        't-SNE Component 2': X_tsne[:, 1],
        'Label': [class_labels[label] for label in y],
        'Class': y
    })
    
    # Create figure and axis
    fig, ax = plt.subplots(figsize=figsize, facecolor='white')
    
    # Define color palette for classes
    colors = {'Normal': '#3498db', 'Apnea': '#e74c3c'}
    
    # Create scatter plot using Seaborn
    for label_name in class_labels.values():
        mask = tsne_df['Label'] == label_name
        ax.scatter(tsne_df.loc[mask, 't-SNE Component 1'], 
                  tsne_df.loc[mask, 't-SNE Component 2'],
                  c=colors.get(label_name, '#95a5a6'),
                  label=label_name,
                  alpha=0.6,
                  s=50,
                  edgecolors='white',
                  linewidths=0.5)
    
    # Customize the plot
    ax.set_xlabel('t-SNE Component 1', fontsize=12, fontweight='bold', labelpad=10)
    ax.set_ylabel('t-SNE Component 2', fontsize=12, fontweight='bold', labelpad=10)
    ax.set_title(title, fontsize=14, fontweight='bold', pad=15)
    
    # Add grid for better readability
    ax.grid(True, alpha=0.3, linestyle='--', linewidth=0.5)
    ax.set_facecolor('#fafafa')
    
    # Add legend
    legend = ax.legend(loc='best', fontsize=11, frameon=True, 
                      fancybox=True, shadow=True, framealpha=0.95,
                      title='Class', title_fontsize=12)
    legend.get_frame().set_facecolor('white')
    legend.get_frame().set_edgecolor('#cccccc')
    
    # Remove top and right spines for cleaner look
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_linewidth(1.5)
    ax.spines['bottom'].set_linewidth(1.5)
    
    # Add text box with statistics
    n_normal = np.sum(y == 0)
    n_apnea = np.sum(y == 1)
    textstr = f'Total Samples: {len(y)}\n'
    textstr += f'Normal: {n_normal} ({n_normal/len(y)*100:.1f}%)\n'
    textstr += f'Apnea: {n_apnea} ({n_apnea/len(y)*100:.1f}%)'
    props = dict(boxstyle='round', facecolor='wheat', alpha=0.7, edgecolor='gray')
    ax.text(0.02, 0.98, textstr, transform=ax.transAxes, fontsize=9,
           verticalalignment='top', bbox=props, fontweight='bold',
           family='monospace')
    
    # Tight layout
    plt.tight_layout()
    
    # Save figure if path provided
    if save_path:
        fig.savefig(save_path, dpi=300, bbox_inches='tight', facecolor='white')
    
    return fig, ax, tsne_df

# Main app

def login_page():
    st.markdown("<h2 class='main-title' style='text-align: center; margin-top: 5rem;'>Login to Medical Portal</h2>", unsafe_allow_html=True)
    st.markdown("<div class='upload-section' style='max-width: 400px; margin: 2rem auto;'>", unsafe_allow_html=True)
    with st.form("login_form"):
        email = st.text_input("Email", "admin@example.com")
        password = st.text_input("Password", type="password", value="password")
        role = st.selectbox("Role", ["User", "Doctor", "Lab"])
        submitted = st.form_submit_button("Login")
        if submitted:
            st.session_state.logged_in = True
            st.session_state.email = email
            st.session_state.role = role
            st.rerun()
    st.markdown("</div>", unsafe_allow_html=True)

def user_portal():
    render_chatbot()
    
    st.markdown(f"<h2 class='main-title'>Patient Portal</h2>", unsafe_allow_html=True)
    st.markdown(f"<p class='subtitle'>Welcome, {st.session_state.email}</p>", unsafe_allow_html=True)
    
    col1, col2 = st.columns([8, 1])
    with col2:
        if st.button("Logout"):
            st.session_state.logged_in = False
            st.rerun()
            
    # Fetch submissions for this user
    submissions = db_handler.get_submissions_by_user(st.session_state.email)
    
    # 1. Pending Actions (from Lab)
    pending_from_lab = [s for s in submissions if s['status'] == 'At User']
    if pending_from_lab:
        st.markdown("<div class='medical-report' style='border: 2px solid #3b82f6;'>", unsafe_allow_html=True)
        st.markdown("<div class='section-title'>🔔 Action Required: New Lab Results</div>", unsafe_allow_html=True)
        st.info("Your laboratory results have arrived. Please fill in your current vitals to forward them to your doctor.")
        
        for sub in reversed(pending_from_lab):
            with st.expander(f"ECG Report from {sub['timestamp']}", expanded=True):
                with st.form(key=f"patient_data_form_{sub['id']}"):
                    col1, col2 = st.columns(2)
                    with col1:
                        age = st.number_input("Age", 1, 120, 40)
                        gender = st.selectbox("Gender", ["Male", "Female"])
                        height = st.number_input("Height (cm)", 100.0, 250.0, 170.0)
                        weight = st.number_input("Weight (kg)", 30.0, 200.0, 70.0)
                    with col2:
                        snoring = st.selectbox("Snoring", ["Yes", "No"])
                        spo2 = st.number_input("SpO2 (%)", 70.0, 100.0, 95.0)
                    
                    submitted = st.form_submit_button("Forward to Doctor")
                    if submitted:
                        patient_data = {
                            "age": age, "gender": gender, "height": height, "weight": weight,
                            "snoring": snoring, "spo2": spo2
                        }
                        db_handler.update_patient_details(sub['id'], patient_data)
                        st.success("Data securely forwarded to your doctor!")
                        st.rerun()
        st.markdown("</div>", unsafe_allow_html=True)
    
    # 2. In Progress (At Doctor)
    at_doctor = [s for s in submissions if s['status'] in ['At Doctor', 'Predicted']]
    if at_doctor:
        st.markdown("<div class='medical-report'>", unsafe_allow_html=True)
        st.markdown("<div class='section-title'>⏳ Under Doctor Review</div>", unsafe_allow_html=True)
        for sub in reversed(at_doctor):
            st.info(f"Report from {sub['timestamp']} is currently being reviewed by your doctor.")
        st.markdown("</div>", unsafe_allow_html=True)
    
    # 3. Completed Prescriptions
    completed = [s for s in submissions if s['status'] == 'Completed']
    st.markdown("<div class='medical-report'>", unsafe_allow_html=True)
    st.markdown("<div class='section-title'>📄 My Medical Records & Prescriptions</div>", unsafe_allow_html=True)
    if completed:
        for sub in reversed(completed):
            with st.expander(f"Prescription for consultation on {sub['timestamp']}", expanded=True):
                st.markdown("<div class='medical-info'>", unsafe_allow_html=True)
                st.markdown(f"**Risk Level:** {sub['prediction']['risk_level']}")
                st.write(sub['prescription'])
                st.markdown("</div>", unsafe_allow_html=True)
    else:
        st.info("No completed prescriptions yet.")
    st.markdown("</div>", unsafe_allow_html=True)

def doctor_portal():
    st.markdown(f"<h2 class='main-title'>Doctor Portal</h2>", unsafe_allow_html=True)
    st.markdown(f"<p class='subtitle'>Welcome, Dr. {st.session_state.email}</p>", unsafe_allow_html=True)
    
    col1, col2 = st.columns([8, 1])
    with col2:
        if st.button("Logout"):
            st.session_state.logged_in = False
            st.rerun()
            
    st.markdown("<div class='medical-report'>", unsafe_allow_html=True)
    st.markdown("<div class='section-title'>📋 Patient Queue</div>", unsafe_allow_html=True)
    
    submissions = db_handler.get_all_submissions()
    # Doctor only sees items that are 'At Doctor' or 'Predicted'
    pending = [s for s in submissions if s['status'] in ['At Doctor', 'Predicted']]
    completed = [s for s in submissions if s['status'] == 'Completed']
    
    if not pending:
        st.info("No patients currently in queue.")
        
    for sub in reversed(pending):
        with st.expander(f"Patient: {sub['user_email']} | Date: {sub['timestamp']}", expanded=(sub['status']=='At Doctor')):
            pd = sub['patient_data']
            st.markdown(f"**Age:** {pd['age']} | **Gender:** {pd['gender']} | **BMI:** {pd['weight']/(pd['height']/100)**2:.1f} | **SpO2:** {pd['spo2']}%")
            
            if sub['status'] == 'At Doctor':
                if st.button("🧠 Run AI Prediction on ECG", key=f"predict_{sub['id']}"):
                    with st.spinner("Analyzing physiological data via Random Forest..."):
                        class MockFile:
                            def __init__(self, path):
                                self.path = path
                                self.name = os.path.basename(path)
                            def read(self):
                                with open(self.path, 'rb') as f:
                                    return f.read()
                            def seek(self, pos):
                                pass
                        
                        try:
                            mock_file = MockFile(sub['file_path'])
                            results, error = process_file(mock_file, pd)
                            if error:
                                st.error(error)
                            else:
                                prediction_data = {
                                    'risk_level': results['severity'],
                                    'percentage': results['confidence'],
                                    'prediction_class': results['prediction']
                                }
                                db_handler.update_submission(sub['id'], prediction=prediction_data)
                                st.rerun()
                        except Exception as e:
                            st.error(f"Error reading file: {e}")
                            
            if sub['prediction']:
                cls = 'apnea-diagnosis' if sub['prediction']['prediction_class'] == 1 else 'normal-diagnosis'
                st.markdown(f'''
                <div class="diagnosis-card {cls}">
                    <div class="diagnosis-title">{sub['prediction']['risk_level']}</div>
                    <div class="confidence-badge">AI Confidence: {sub['prediction']['percentage']:.1f}%</div>
                </div>
                ''', unsafe_allow_html=True)
                
                if not sub['prescription']:
                    with st.form(key=f"prescribe_{sub['id']}"):
                        st.markdown("**Clinical Prescription (To be translated by Llama for Patient)**")
                        prescription_text = st.text_area("Details", height=150, placeholder="e.g., Recommend CPAP titration study...")
                        if st.form_submit_button("Submit & Send to Patient"):
                            if prescription_text.strip():
                                db_handler.update_submission(sub['id'], prescription=prescription_text)
                                st.success("Prescription securely transmitted to patient portal.")
                                st.rerun()
                            else:
                                st.error("Please enter a prescription.")

    if completed:
        st.markdown("### Completed Consultations")
        for sub in reversed(completed):
            with st.expander(f"Patient: {sub['user_email']} | Completed"):
                st.markdown(f"**Prediction:** {sub['prediction']['risk_level']}")
                st.write(sub['prescription'])
                
    st.markdown("</div>", unsafe_allow_html=True)

def lab_portal():
    st.markdown("<h2 class='main-title'>Laboratory Portal</h2>", unsafe_allow_html=True)
    st.markdown("<p class='subtitle'>Upload patient diagnostics</p>", unsafe_allow_html=True)
    
    col1, col2 = st.columns([8, 1])
    with col2:
        if st.button("Logout"):
            st.session_state.logged_in = False
            st.rerun()
            
    st.markdown("<div class='medical-report'>", unsafe_allow_html=True)
    st.markdown("<div class='section-title'>📤 New ECG Upload</div>", unsafe_allow_html=True)
    
    with st.form("lab_upload_form"):
        target_email = st.text_input("Patient Email", placeholder="e.g., saro@gmail.com")
        uploaded_file = st.file_uploader("Upload ECG Data (.dat, .csv, .txt)", type=["dat", "csv", "txt"])
        
        submitted = st.form_submit_button("Send to Patient")
        if submitted:
            if target_email and uploaded_file is not None:
                os.makedirs("uploads", exist_ok=True)
                file_path = os.path.join("uploads", f"{uuid.uuid4().hex}_{uploaded_file.name}")
                with open(file_path, "wb") as f:
                    f.write(uploaded_file.getbuffer())
                
                db_handler.add_submission(target_email.strip(), file_path)
                st.success(f"ECG data successfully sent to {target_email}!")
            else:
                st.error("Please provide both the patient email and an ECG file.")
    st.markdown("</div>", unsafe_allow_html=True)

def main():
    if "logged_in" not in st.session_state:
        st.session_state.logged_in = False

    if not st.session_state.logged_in:
        login_page()
    else:
        role = st.session_state.role
        if role == "User":
            user_portal()
        elif role == "Doctor":
            doctor_portal()
        elif role == "Lab":
            lab_portal()

if __name__ == "__main__":
    main()
    
    # Hide streamlit branding
    st.markdown('''
    <style>
        #MainMenu {visibility: hidden;}
        footer {visibility: hidden;}
        .stDeployButton {display:none;}
    </style>
    ''', unsafe_allow_html=True)
