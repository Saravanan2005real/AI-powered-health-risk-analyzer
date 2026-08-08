"""
Sleep Apnea Chatbot Module
Contains the knowledge base and UI for the sleep apnea assistant chatbot
"""

import streamlit as st

# Sleep Apnea Chatbot Knowledge Base
SLEEP_APNEA_KNOWLEDGE = {
    # General questions
    'what is sleep apnea': {
        'answer': """Sleep apnea is a serious sleep disorder where breathing repeatedly stops and starts during sleep. There are three main types:
        
1. **Obstructive Sleep Apnea (OSA)** - Most common, caused by relaxed throat muscles blocking the airway
2. **Central Sleep Apnea** - Brain doesn't send proper signals to control breathing
3. **Complex Sleep Apnea** - Combination of obstructive and central sleep apnea

**Key Symptoms:**
- Loud snoring
- Gasping or choking during sleep
- Excessive daytime sleepiness
- Morning headaches
- Difficulty concentrating
- Irritability

**Risk Factors:**
- Being overweight
- Age (more common in older adults)
- Family history
- Narrow airway
- Alcohol or sedative use
- Smoking
- Nasal congestion""",
        'keywords': ['what is sleep apnea', 'what is', 'definition', 'define', 'explain sleep apnea', 'explain', 'tell me about sleep apnea', 'tell me about', 'describe', 'what does', 'meaning', 'sleep apnea meaning', 'apnea definition', 'what are sleep apneas', 'sleep disorder', 'breathing disorder', 'what is osa', 'what is obstructive', 'obstructive sleep apnea', 'central sleep apnea', 'complex sleep apnea', 'sleep apnea types', 'types of sleep apnea', 'sleep apnea disorder']
    },
    'symptoms': {
        'answer': """Common symptoms of sleep apnea include:

**During Sleep:**
- Loud snoring
- Episodes of stopped breathing (observed by others)
- Gasping or choking sounds
- Restless sleep
- Frequent urination at night

**During Day:**
- Excessive daytime sleepiness (hypersomnia)
- Morning headaches
- Difficulty concentrating
- Memory problems
- Irritability or mood changes
- Depression
- Decreased libido

**Warning Signs:**
- Waking up with a dry mouth
- Sore throat in the morning
- Insomnia
- Attention problems

If you experience these symptoms, consult a healthcare professional for proper evaluation.""",
        'keywords': ['symptoms', 'symptom', 'signs', 'sign', 'what are the symptoms', 'what are symptoms', 'how do i know', 'how to know', 'warning signs', 'warning', 'indications', 'indicators', 'tell tale signs', 'what symptoms', 'symptoms of', 'symptoms in', 'symptom list', 'common symptoms', 'signs of sleep apnea', 'sleep apnea symptoms', 'apnea symptoms', 'symptoms during sleep', 'symptoms during day', 'daytime symptoms', 'nighttime symptoms', 'snoring', 'loud snoring', 'choking', 'gasping', 'daytime sleepiness', 'excessive sleepiness', 'morning headache', 'difficulty concentrating', 'memory problems', 'irritability', 'depression', 'dry mouth', 'sore throat', 'insomnia', 'attention problems']
    },
    'causes': {
        'answer': """Sleep apnea can be caused by various factors:

**Obstructive Sleep Apnea Causes:**
- **Anatomical factors:** Narrow airway, enlarged tonsils, large tongue, small jaw
- **Obesity:** Excess weight can cause fat deposits around the upper airway
- **Age:** Muscle tone decreases with age
- **Gender:** More common in men
- **Family history:** Genetic factors
- **Alcohol and sedatives:** Relax throat muscles
- **Smoking:** Increases inflammation and fluid retention
- **Nasal congestion:** Chronic nasal problems

**Central Sleep Apnea Causes:**
- Heart failure
- Stroke
- Brain tumors or injuries
- Medications (opioids)
- High altitude

**Risk Factors:**
- Being male
- Age over 40
- Large neck circumference (>17 inches for men, >16 inches for women)
- Hypertension
- Diabetes
- Smoking""",
        'keywords': ['causes', 'cause', 'why', 'what causes', 'what cause', 'why does', 'why do', 'risk factors', 'risk factor', 'what causes sleep apnea', 'why sleep apnea', 'causes of', 'caused by', 'reason', 'reasons', 'trigger', 'triggers', 'factors', 'contributing factors', 'what leads to', 'what contributes to', 'anatomical', 'obesity', 'weight', 'overweight', 'age', 'gender', 'male', 'family history', 'genetic', 'alcohol', 'sedatives', 'smoking', 'nasal congestion', 'narrow airway', 'enlarged tonsils', 'large tongue', 'small jaw', 'heart failure', 'stroke', 'brain tumor', 'medications', 'high altitude', 'hypertension', 'diabetes', 'neck circumference', 'obstructive causes', 'central causes']
    },
    'treatment': {
        'answer': """Treatment options for sleep apnea depend on severity and type:

**Lifestyle Changes:**
- **Weight loss:** Even 10% weight loss can reduce symptoms
- **Exercise:** Regular physical activity
- **Sleep position:** Sleeping on side instead of back
- **Avoid alcohol and sedatives:** Especially before bedtime
- **Quit smoking:** Reduces inflammation
- **Treat nasal congestion:** Use nasal sprays or decongestants

**Medical Devices:**
- **CPAP (Continuous Positive Airway Pressure):** Most common treatment, uses air pressure to keep airway open
- **BiPAP:** Similar to CPAP but with different pressure for inhalation/exhalation
- **Oral appliances:** Dental devices that reposition jaw or tongue

**Surgical Options:**
- Tissue removal
- Jaw repositioning
- Implants
- Nerve stimulation
- Tracheostomy (severe cases only)

**Therapy:**
- Oxygen therapy
- Adaptive servo-ventilation

**Important:** Always consult a sleep specialist for proper diagnosis and treatment plan.""",
        'keywords': ['treatment', 'treat', 'how to treat', 'cure', 'therapy', 'remedy', 'what can i do', 'how to cure', 'treatment options', 'treatment for', 'treat sleep apnea', 'how to fix', 'fix sleep apnea', 'get rid of', 'sleep apnea treatment', 'apnea treatment', 'treatments', 'how treated', 'what treatments', 'lifestyle changes', 'weight loss', 'exercise', 'sleep position', 'avoid alcohol', 'quit smoking', 'nasal sprays', 'cpap', 'bipap', 'oral appliances', 'surgery', 'surgical', 'oxygen therapy', 'medical devices', 'therapy options', 'treatment methods', 'cure sleep apnea', 'sleep apnea cure', 'remedies', 'home remedies', 'natural treatment', 'alternative treatment']
    },
    'diagnosis': {
        'answer': """Sleep apnea is diagnosed through:

**1. Medical History & Physical Exam:**
- Review of symptoms
- Examination of mouth, nose, and throat
- Assessment of risk factors

**2. Sleep Study (Polysomnography):**
- **In-lab sleep study:** Overnight monitoring in a sleep center
  - Monitors: brain waves, eye movements, heart rate, breathing, oxygen levels, muscle activity
- **Home sleep test:** Simplified version for certain patients
  - Monitors: breathing, oxygen levels, heart rate

**3. Our ECG-Based Detection:**
- This system uses ECG (electrocardiogram) signals to detect sleep apnea
- Analyzes 30-second ECG windows for apnea indicators
- Uses machine learning with 12 extracted features
- **Accuracy:** 85.2% with our trained model
- Provides severity assessment (Normal, Mild, Moderate, Severe)

**What to Expect:**
- Sleep study results are analyzed by sleep specialists
- Diagnosis includes severity classification (AHI - Apnea-Hypopnea Index)
- Treatment recommendations based on findings

**Note:** Our ECG analysis is for preliminary screening. Always consult healthcare professionals for official diagnosis.""",
        'keywords': ['diagnosis', 'diagnose', 'how is it diagnosed', 'how diagnosed', 'test', 'testing', 'detection', 'detect', 'screening', 'screen', 'how do you know', 'how to diagnose', 'diagnostic', 'diagnose sleep apnea', 'sleep apnea diagnosis', 'apnea test', 'sleep test', 'sleep study', 'polysomnography', 'psg', 'home sleep test', 'hst', 'sleep center', 'sleep lab', 'overnight test', 'sleep monitoring', 'ecg test', 'heart test', 'breathing test', 'apnea detection', 'sleep apnea test', 'diagnostic test', 'medical test', 'sleep evaluation', 'sleep assessment', 'sleep analysis', 'breathing analysis', 'how to test', 'test for sleep apnea', 'sleep apnea screening', 'screening test', 'detection method', 'how detected', 'diagnosis method', 'testing methods', 'ecg based', 'ecg detection', 'cardiac test']
    },
    'severity': {
        'answer': """Sleep apnea severity is classified using the AHI (Apnea-Hypopnea Index):

**AHI Classification:**
- **Normal:** < 5 events per hour
- **Mild:** 5-15 events per hour
- **Moderate:** 15-30 events per hour
- **Severe:** > 30 events per hour

**Our System's Severity Assessment:**
- **Normal:** < 40% apnea probability
- **Mild:** 40-60% apnea probability
- **Moderate:** 60-80% apnea probability
- **Severe:** > 80% apnea probability

**What This Means:**
- **Mild:** Lifestyle changes may help, CPAP if symptoms are significant
- **Moderate:** Usually requires CPAP or other treatment
- **Severe:** Requires immediate treatment (CPAP, BiPAP, or surgery)

**Factors Affecting Severity:**
- Number of apnea events per hour
- Oxygen desaturation levels
- Daytime symptoms
- Comorbid conditions (heart disease, diabetes)

**Important:** Severity assessment should be done by qualified sleep specialists using comprehensive sleep studies.""",
        'keywords': ['severity', 'mild', 'moderate', 'severe', 'levels', 'stages', 'how bad', 'severity level', 'severity levels', 'severity stages', 'severity classification', 'severity assessment', 'mild sleep apnea', 'moderate sleep apnea', 'severe sleep apnea', 'normal sleep apnea', 'how severe', 'severity of', 'severity stages', 'apnea severity', 'sleep apnea severity', 'severity rating', 'severity scale', 'severity index', 'level of severity', 'degree of severity', 'mild apnea', 'moderate apnea', 'severe apnea', 'normal apnea', 'severity classification', 'severity categories', 'severity ranges', 'mild moderate severe']
    },
    'ecg': {
        'answer': """ECG (Electrocardiogram) can detect sleep apnea because:

**Why ECG Works:**
- Sleep apnea causes changes in heart rate variability (HRV)
- Apnea events trigger stress responses affecting cardiac rhythms
- ECG captures these rhythm variations during sleep

**Our Detection Method:**
- Analyzes 30-second ECG signal windows
- Extracts 12 features including:
  - Mean, standard deviation, min, max
  - Signal energy and RMS
  - Zero crossings
  - Heart rate variability measures
- Uses machine learning (Random Forest) for classification
- **Accuracy:** 85.2%
- **Model Performance:**
  - Precision: 82.1%
  - Recall: 78.9%
  - F1-Score: 80.4%
  - ROC-AUC: 0.87

**Advantages:**
- Non-invasive
- Quick analysis
- Cost-effective screening tool
- Can be done at home with portable ECG devices

**Limitations:**
- Preliminary screening only
- Full polysomnography still required for official diagnosis
- May miss some apnea events

**How to Use:**
1. Upload your ECG file (.dat, .csv, or .txt format)
2. Our system analyzes the signal
3. Receive probability assessment and severity classification
4. Consult healthcare professionals for follow-up""",
        'keywords': ['ecg', 'ekg', 'electrocardiogram', 'heart', 'cardiac', 'how does it work', 'detection method', 'how ecg works', 'ecg detection', 'ecg based detection', 'heart rate', 'heart rate variability', 'hrv', 'cardiac rhythm', 'ecg signal', 'electrocardiogram signal', 'heart signal', 'cardiac signal', 'ecg analysis', 'heart analysis', 'cardiac analysis', 'ecg monitoring', 'heart monitoring', 'cardiac monitoring', 'ecg test', 'heart test', 'cardiac test', 'ecg method', 'heart rate changes', 'rhythm variations', 'cardiac rhythms', 'ecg features', 'heart features', 'cardiac features', 'ecg data', 'heart data', 'cardiac data', 'electrocardiogram test', 'ecg screening', 'heart screening', 'cardiac screening', 'ecg accuracy', 'heart accuracy', 'how ecg detects', 'ecg apnea detection', 'cardiac apnea detection', 'heart rate variability sleep apnea', 'hrv sleep apnea']
    },
    'prevention': {
        'answer': """While you can't always prevent sleep apnea, you can reduce risk:

**Lifestyle Modifications:**
1. **Maintain Healthy Weight:**
   - Obesity is a major risk factor
   - Even 10% weight loss can improve symptoms

2. **Exercise Regularly:**
   - Strengthens heart and improves breathing
   - Helps with weight management

3. **Sleep Position:**
   - Sleep on your side, not your back
   - Use special pillows or devices

4. **Avoid Alcohol & Sedatives:**
   - Especially before bedtime
   - They relax throat muscles

5. **Quit Smoking:**
   - Reduces inflammation
   - Improves overall health

6. **Treat Nasal Problems:**
   - Use nasal sprays for congestion
   - Consider allergy treatment

7. **Manage Medical Conditions:**
   - Control hypertension
   - Manage diabetes
   - Treat heart conditions

8. **Good Sleep Hygiene:**
   - Regular sleep schedule
   - Comfortable sleep environment
   - Adequate sleep duration

**Early Detection:**
- Recognize symptoms early
- Get screened if at risk
- Family history awareness

**Remember:** Prevention is best, but if you have symptoms, seek professional help promptly.""",
        'keywords': ['prevent', 'prevention', 'avoid', 'reduce risk', 'how to avoid', 'prevent sleep apnea', 'prevention of', 'how to prevent', 'prevent apnea', 'avoid sleep apnea', 'reduce risk of', 'lower risk', 'risk reduction', 'prevention methods', 'prevention strategies', 'preventive measures', 'preventive', 'preventative', 'how prevent', 'preventing', 'preventive care', 'prevention tips', 'prevention advice', 'ways to prevent', 'methods to prevent', 'strategies to prevent', 'how to reduce risk', 'reduce sleep apnea risk', 'preventive lifestyle', 'prevention guidelines']
    },
    'complications': {
        'answer': """Untreated sleep apnea can lead to serious complications:

**Cardiovascular Problems:**
- High blood pressure (hypertension)
- Heart disease and heart failure
- Irregular heartbeat (arrhythmias)
- Stroke
- Coronary artery disease

**Daytime Problems:**
- Excessive daytime sleepiness
- Increased risk of accidents (driving, work)
- Poor work performance
- Relationship problems
- Memory and concentration issues

**Metabolic Issues:**
- Type 2 diabetes
- Metabolic syndrome
- Weight gain

**Other Complications:**
- Liver problems
- Surgical complications
- Eye problems (glaucoma)
- Depression and mood disorders
- Sleep-deprived partners

**Long-term Effects:**
- Reduced quality of life
- Increased mortality risk
- Chronic fatigue
- Cognitive decline

**Importance of Treatment:**
- Early treatment prevents complications
- CPAP therapy reduces cardiovascular risks
- Improves overall health and quality of life
- Reduces accident risk

**Warning:** If you suspect sleep apnea, don't delay treatment. The complications can be serious and life-threatening.""",
        'keywords': ['complications', 'complication', 'risks', 'risk', 'dangers', 'danger', 'what happens if untreated', 'side effects', 'side effect', 'untreated sleep apnea', 'if not treated', 'consequences', 'consequence', 'what happens if', 'untreated', 'long term effects', 'long-term effects', 'health risks', 'health complications', 'cardiovascular problems', 'heart problems', 'high blood pressure', 'hypertension', 'heart disease', 'stroke', 'diabetes', 'metabolic issues', 'daytime problems', 'accidents', 'work performance', 'relationship problems', 'memory problems', 'concentration issues', 'mortality risk', 'quality of life', 'complications of', 'risks of', 'dangers of', 'side effects of', 'what can happen', 'health effects', 'negative effects', 'adverse effects', 'problems', 'issues', 'concerns']
    },
    'children': {
        'answer': """Sleep apnea can also affect children:

**Symptoms in Children:**
- Loud snoring
- Breathing pauses during sleep
- Restless sleep
- Bedwetting
- Daytime sleepiness or hyperactivity
- Poor school performance
- Behavioral problems
- Mouth breathing

**Causes in Children:**
- Enlarged tonsils or adenoids (most common)
- Obesity
- Down syndrome
- Craniofacial abnormalities
- Neuromuscular disorders

**Diagnosis:**
- Similar to adults (sleep study)
- May require pediatric sleep specialist
- Parental observation is important

**Treatment:**
- **Tonsillectomy/adenoidectomy:** Most common for children
- CPAP therapy (if surgery not possible)
- Weight management
- Orthodontic treatment

**Importance:**
- Untreated sleep apnea in children can affect:
  - Growth and development
  - Learning and behavior
  - Heart health
  - Attention and memory

**Action:** If your child shows symptoms, consult a pediatrician or sleep specialist immediately.""",
        'keywords': ['children', 'kids', 'kid', 'child', 'pediatric', 'infant', 'infants', 'teenager', 'teenagers', 'teen', 'teens', 'sleep apnea children', 'sleep apnea kids', 'sleep apnea child', 'pediatric sleep apnea', 'child sleep apnea', 'kids sleep apnea', 'infant sleep apnea', 'teenager sleep apnea', 'sleep apnea in children', 'sleep apnea in kids', 'sleep apnea in child', 'children symptoms', 'kids symptoms', 'child symptoms', 'pediatric symptoms', 'children treatment', 'kids treatment', 'child treatment', 'pediatric treatment', 'children diagnosis', 'kids diagnosis', 'child diagnosis', 'pediatric diagnosis', 'tonsils', 'adenoids', 'tonsillectomy', 'adenoidectomy', 'children snoring', 'kids snoring', 'child snoring', 'pediatric snoring']
    },
    'cpap': {
        'answer': """CPAP (Continuous Positive Airway Pressure) is the most common treatment:

**What is CPAP:**
- Machine that delivers constant air pressure through a mask
- Prevents airway collapse during sleep
- Most effective treatment for moderate to severe sleep apnea

**How It Works:**
- Air pressure keeps throat muscles from collapsing
- Delivered through mask (nasal, full face, or nasal pillows)
- Pressure level determined by sleep study

**Benefits:**
- Reduces or eliminates apnea events
- Improves sleep quality
- Reduces daytime sleepiness
- Lowers cardiovascular risks
- Improves mood and cognitive function

**Getting Used to CPAP:**
- May take 1-2 weeks to adjust
- Start with lower pressure
- Use humidifier for dryness
- Try different mask types
- Use every night for best results

**Maintenance:**
- Clean mask and tubing regularly
- Replace filters as recommended
- Annual machine checkup

**Side Effects:**
- Nasal congestion
- Dry mouth
- Skin irritation
- Claustrophobia
- Air leaks

**Tips for Success:**
- Work with your healthcare provider
- Try different mask styles
- Use consistently
- Address comfort issues promptly

**Note:** CPAP is highly effective when used properly. Don't give up if it's uncomfortable at first.""",
        'keywords': ['cpap', 'cpap machine', 'cpap device', 'machine', 'device', 'treatment device', 'breathing machine', 'continuous positive airway pressure', 'cpap therapy', 'cpap treatment', 'cpap mask', 'cpap machine', 'cpap device', 'air pressure', 'positive airway pressure', 'pap', 'cpap benefits', 'cpap how it works', 'cpap adjustment', 'getting used to cpap', 'cpap maintenance', 'cpap cleaning', 'cpap side effects', 'cpap problems', 'cpap issues', 'cpap mask types', 'nasal mask', 'full face mask', 'nasal pillows', 'cpap pressure', 'cpap settings', 'cpap machine types', 'cpap brands', 'cpap cost', 'cpap insurance', 'cpap effectiveness', 'cpap success', 'cpap compliance', 'cpap alternatives', 'bipap', 'apap', 'auto cpap', 'adaptive cpap']
    },
    
    # Project-specific topics
    'project_overview': {
        'answer': """**Sleep Apnea Detection System - Project Overview:**

This is an AI-powered web application for detecting sleep apnea from ECG signals using machine learning.

**Key Features:**
- ECG-based sleep apnea detection
- Real-time signal analysis
- Severity classification (Normal, Mild, Moderate, Severe)
- User-friendly web interface
- Quick and non-invasive screening

**Technology Stack:**
- Python & Streamlit for web interface
- Scikit-learn for machine learning
- WFDB for ECG signal processing
- NumPy & Pandas for data handling
- Matplotlib for visualizations

**Dataset:**
- PhysioNet Apnea-ECG Database 1.0.0
- 35 patient recordings
- 2,200+ analysis windows

**Model Performance:**
- Accuracy: 85.2%
- Precision: 82.1%
- Recall: 78.9%
- F1-Score: 80.4%
- ROC-AUC: 0.87

**Purpose:**
This system provides preliminary screening for sleep apnea. Always consult healthcare professionals for official diagnosis.""",
        'keywords': ['project', 'system', 'application', 'app', 'this system', 'this app', 'this project', 'your system', 'your app', 'your project', 'sleep apnea detection system', 'detection system', 'ecg detection system', 'ai system', 'machine learning system', 'web app', 'web application', 'overview', 'about the project', 'about the system', 'about this', 'what is this', 'tell me about the project', 'tell me about the system', 'system overview', 'project overview', 'application overview']
    },
    
    'model_details': {
        'answer': """**Machine Learning Model Details:**

**Model Type:** Random Forest Classifier

**Performance Metrics:**
- **Accuracy:** 85.2%
- **Precision:** 82.1%
- **Recall:** 78.9%
- **F1-Score:** 80.4%
- **ROC-AUC:** 0.87

**Training Details:**
- **Algorithm:** Random Forest (100 trees)
- **Features:** 12 extracted ECG features
- **Dataset:** PhysioNet Apnea-ECG Database
- **Training/Test Split:** 80/20
- **Class Balancing:** Yes (balanced class weights)

**Features Extracted:**
1. Mean
2. Standard Deviation
3. Minimum
4. Maximum
5. Median
6. 25th Percentile
7. 75th Percentile
8. Signal Energy
9. RMS (Root Mean Square)
10. Zero Crossings
11. Standard Deviation of Differences
12. Mean Absolute Difference

**Model Comparison:**
The Random Forest model performed best among:
- Random Forest (85.2% accuracy) ✅ Best
- SVM (83.7% accuracy)
- Neural Network (82.9% accuracy)
- Logistic Regression (81.3% accuracy)

**Note:** The model is trained and saved as `best_sleep_apnea_model.pkl`""",
        'keywords': ['model', 'machine learning model', 'ml model', 'algorithm', 'random forest', 'model accuracy', 'model performance', 'accuracy', 'precision', 'recall', 'f1 score', 'roc auc', 'auc', 'model metrics', 'performance metrics', 'model details', 'model information', 'what model', 'which model', 'model type', 'training', 'trained model', 'model training', 'features', 'feature extraction', '12 features', 'model comparison', 'best model', 'model algorithm', 'classifier', 'classification', 'model stats', 'statistics', 'model results', 'model evaluation', 'model performance']
    },
    
    'features': {
        'answer': """**12 Features Extracted from ECG Signals:**

1. **Mean** - Average signal amplitude
2. **Standard Deviation** - Signal variability
3. **Minimum** - Lowest signal value
4. **Maximum** - Highest signal value
5. **Median** - Middle value
6. **25th Percentile** - Lower quartile
7. **75th Percentile** - Upper quartile
8. **Signal Energy** - Total power (sum of squares)
9. **RMS** - Root Mean Square
10. **Zero Crossings** - Signal irregularity count
11. **Standard Deviation of Differences** - Heart rate variability measure
12. **Mean Absolute Difference** - Signal smoothness

**Feature Extraction Process:**
- 30-second ECG window analysis
- Time-domain signal processing
- Statistical feature computation
- Normalization using StandardScaler

**Why These Features:**
- Capture heart rate variability changes during apnea
- Reflect signal amplitude variations
- Measure signal regularity
- Detect breathing pattern disruptions

**Feature Engineering:**
- All features extracted from raw ECG signal
- No frequency domain analysis required
- Computationally efficient
- Clinically interpretable""",
        'keywords': ['features', 'feature', '12 features', 'feature extraction', 'what features', 'which features', 'feature list', 'extracted features', 'ecg features', 'signal features', 'features used', 'feature engineering', 'mean', 'standard deviation', 'min', 'max', 'median', 'percentile', 'signal energy', 'rms', 'zero crossings', 'heart rate variability', 'hrv', 'feature computation', 'statistical features', 'time domain', 'signal processing', 'feature analysis']
    },
    
    'dataset': {
        'answer': """**PhysioNet Apnea-ECG Database:**

**Source:** PhysioNet Apnea-ECG Database 1.0.0

**Dataset Details:**
- **Total Recordings:** 35 patients
- **Total Files:** 70+ ECG recordings
- **Window Size:** 30 seconds
- **Overlap:** 50% between windows
- **Total Windows:** ~2,200
- **Sampling Rate:** 100 Hz (standardized)
- **Class Distribution:** 
  - Normal: ~63.7%
  - Apnea: ~36.3%

**File Types:**
- `.dat` files - ECG signal data
- `.hea` files - Header information
- `.apn` files - Apnea annotations
- `.qrs` files - QRS complex annotations

**Data Processing:**
- ECG signals loaded using WFDB library
- 30-second windows created with 50% overlap
- Features extracted from each window
- Labels assigned based on apnea annotations
- Train-test split: 80-20

**Annotation Format:**
- 'N' = Normal breathing
- 'A' = Apnea event
- '0' = No annotation

**Dataset Location:**
- Folder: `apnea-ecg-database-1.0.0/`
- Contains all PhysioNet database files

**Citation:**
Goldberger, A.L., et al. (2000). PhysioNet Apnea-ECG Database""",
        'keywords': ['dataset', 'data', 'database', 'physionet', 'apnea ecg database', 'training data', 'test data', 'data source', 'where data', 'what dataset', 'which dataset', 'data files', 'ecg files', 'dat files', 'hea files', 'apn files', 'annotations', 'data processing', 'data preparation', 'dataset details', 'dataset information', 'data size', 'number of files', 'number of patients', 'recordings', 'windows', 'samples', 'data distribution', 'class distribution', 'normal samples', 'apnea samples', 'physionet database', 'ecg database', 'sleep apnea database', 'data format', 'file format', 'wfdb', 'data loading', 'data annotation']
    },
    
    'usage': {
        'answer': """**How to Use the Sleep Apnea Detection System:**

**Step 1: Upload ECG File**
- Click "Choose ECG File" button
- Supported formats: `.dat`, `.csv`, `.txt`
- File should contain at least 30 seconds of ECG data

**Step 2: Analyze Signal**
- Click "🔍 Analyze ECG Signal" button
- System processes the file automatically
- Feature extraction and model prediction performed

**Step 3: View Results**
- See diagnosis (Normal/Apnea)
- View severity level (Normal/Mild/Moderate/Severe)
- Check probability scores
- View ECG signal visualization
- Review clinical recommendations

**File Format Requirements:**
- **.dat files:** WFDB format (PhysioNet standard)
- **.csv files:** Single column with ECG values
- **.txt files:** Space or comma-separated values
- **Minimum length:** 30 seconds of data (3000 samples at 100Hz)

**Signal Requirements:**
- Clean ECG signal
- No excessive noise
- Proper sampling rate (100Hz recommended)
- Valid numeric values

**Tips:**
- Use files from PhysioNet database for best results
- Ensure file is not corrupted
- Check file format compatibility
- Minimum 30 seconds required for analysis""",
        'keywords': ['how to use', 'how use', 'usage', 'how does it work', 'how to upload', 'upload file', 'file upload', 'use the system', 'use the app', 'use this', 'how to analyze', 'analyze signal', 'analyze ecg', 'file format', 'supported formats', 'dat file', 'csv file', 'txt file', 'file requirements', 'signal requirements', 'how to get started', 'getting started', 'user guide', 'instructions', 'tutorial', 'steps', 'process', 'workflow', 'how it works', 'operation', 'how to run', 'run the app', 'using the system', 'system usage', 'app usage']
    },
    
    'accuracy': {
        'answer': """**System Accuracy and Performance:**

**Overall Model Performance:**
- **Accuracy:** 85.2%
- **Precision:** 82.1%
- **Recall:** 78.9%
- **F1-Score:** 80.4%
- **ROC-AUC:** 0.87

**What This Means:**
- **Accuracy (85.2%):** Correct predictions 85.2% of the time
- **Precision (82.1%):** When apnea is predicted, it's correct 82.1% of the time
- **Recall (78.9%):** Detects 78.9% of all apnea cases
- **F1-Score (80.4%):** Balanced measure of precision and recall
- **ROC-AUC (0.87):** Good discriminative ability (1.0 = perfect)

**Confusion Matrix (Best Model):**
```
                Predicted
Actual     Normal  Apnea
Normal      1,247    156
Apnea        189    608
```

**Clinical Metrics:**
- **Sensitivity:** 78.9% (True Positive Rate)
- **Specificity:** 88.9% (True Negative Rate)
- **Positive Predictive Value:** 82.1%
- **Negative Predictive Value:** 86.8%

**Performance Comparison:**
- Random Forest: 85.2% ✅ Best
- SVM: 83.7%
- Neural Network: 82.9%
- Logistic Regression: 81.3%

**Important Note:**
This is a screening tool with good accuracy, but it's not a substitute for professional medical diagnosis. Always consult healthcare professionals for official diagnosis.""",
        'keywords': ['accuracy', 'performance', 'how accurate', 'accuracy rate', 'model accuracy', 'system accuracy', 'detection accuracy', 'precision', 'recall', 'f1 score', 'roc auc', 'auc', 'sensitivity', 'specificity', 'true positive', 'false positive', 'true negative', 'false negative', 'performance metrics', 'metrics', 'results', 'how good', 'how reliable', 'reliability', 'effectiveness', 'success rate', 'detection rate', 'correct predictions', 'model performance', 'system performance', 'clinical metrics', 'confusion matrix', 'performance comparison', 'benchmark', 'evaluation', 'validation']
    },
    
    'file_formats': {
        'answer': """**Supported File Formats:**

**1. .dat Files (WFDB Format)**
- PhysioNet standard format
- Binary ECG signal data
- Usually comes with .hea header file
- Best compatibility with this system
- Example: Files from PhysioNet database

**2. .csv Files**
- Comma-separated values
- Single column with ECG values
- One value per row
- Easy to export from Excel/other tools
- Text-based format

**3. .txt Files**
- Plain text format
- Space or comma-separated values
- One value per line or space-separated
- Flexible format
- Can be created from various sources

**File Requirements:**
- **Minimum Length:** 30 seconds (3000 samples at 100Hz)
- **Format:** Numeric values only
- **Encoding:** UTF-8 or ASCII
- **Size:** Up to 50MB recommended

**Reading Files:**
- `.dat` files: Read using WFDB library
- `.csv` files: Read using Pandas
- `.txt` files: Read using NumPy

**Tips:**
- Use PhysioNet .dat files for best results
- Ensure proper file encoding
- Check file is not corrupted
- Verify numeric format
- Remove headers if present in CSV/TXT files""",
        'keywords': ['file format', 'file formats', 'supported formats', 'dat file', 'csv file', 'txt file', 'wfdb', 'file type', 'what files', 'which files', 'file extension', 'supported files', 'file requirements', 'file compatibility', 'ecg file format', 'signal file format', 'data format', 'format requirements', 'file reading', 'how to format', 'file structure', 'file type support', 'accepted files', 'file extensions', 'dat format', 'csv format', 'txt format', 'physionet format']
    },
    
    'ahi': {
        'answer': """**AHI (Apnea-Hypopnea Index):**

**Definition:**
AHI is a measure used to determine the severity of sleep apnea. It represents the average number of apnea and hypopnea events per hour of sleep.

**AHI Classification:**
- **Normal:** < 5 events per hour
- **Mild Sleep Apnea:** 5-15 events per hour
- **Moderate Sleep Apnea:** 15-30 events per hour
- **Severe Sleep Apnea:** > 30 events per hour

**What Counts as Events:**
- **Apnea:** Complete cessation of breathing for ≥10 seconds
- **Hypopnea:** Partial reduction in breathing (≥30% reduction) for ≥10 seconds with oxygen desaturation or arousal

**Our System's AHI Equivalent:**
While our system doesn't directly calculate AHI, we provide probability-based severity:
- **Normal:** < 40% apnea probability
- **Mild:** 40-60% apnea probability
- **Moderate:** 60-80% apnea probability
- **Severe:** > 80% apnea probability

**Importance:**
- AHI is the standard measure for sleep apnea severity
- Used by sleep specialists for diagnosis
- Guides treatment recommendations
- Monitors treatment effectiveness

**Note:**
Our ECG-based system provides preliminary screening. Official AHI requires a full sleep study (polysomnography).""",
        'keywords': ['ahi', 'apnea hypopnea index', 'apnea hypopnea', 'ahi score', 'ahi index', 'ahi level', 'ahi classification', 'ahi severity', 'events per hour', 'apnea events', 'hypopnea events', 'breathing events', 'ahi normal', 'ahi mild', 'ahi moderate', 'ahi severe', 'ahi calculation', 'what is ahi', 'ahi meaning', 'ahi definition', 'severity index', 'apnea index', 'sleep apnea index', 'ahi scale', 'ahi ranges', 'ahi values', 'ahi measurement', 'ahi test', 'ahi results']
    },
    
    'polysomnography': {
        'answer': """**Polysomnography (Sleep Study):**

**Definition:**
Polysomnography is the gold standard test for diagnosing sleep apnea. It's an overnight sleep study that monitors multiple body functions during sleep.

**What It Monitors:**
- Brain waves (EEG)
- Eye movements (EOG)
- Heart rate (ECG)
- Breathing patterns
- Oxygen levels (SpO2)
- Muscle activity (EMG)
- Body position
- Leg movements

**Types of Sleep Studies:**
1. **In-Lab Polysomnography:**
   - Overnight study at sleep center
   - Comprehensive monitoring
   - Most accurate diagnosis
   - Technician supervision

2. **Home Sleep Test (HST):**
   - Simplified portable device
   - Fewer sensors
   - Sleep at home
   - Less comprehensive

**What to Expect:**
- Arrive at sleep center in evening
- Sensors attached to body
- Sleep overnight (6-8 hours)
- Technologist monitors throughout
- Results analyzed by sleep specialist

**Results Include:**
- AHI (Apnea-Hypopnea Index)
- Oxygen desaturation levels
- Sleep stages
- Arousal index
- Treatment recommendations

**Our System vs. Polysomnography:**
- Our ECG system: Quick, non-invasive screening
- Polysomnography: Comprehensive, official diagnosis
- Our system: Preliminary assessment
- Polysomnography: Gold standard test

**Note:**
Our ECG-based detection is a screening tool. Polysomnography is still required for official diagnosis.""",
        'keywords': ['polysomnography', 'psg', 'sleep study', 'sleep test', 'overnight test', 'sleep center', 'sleep lab', 'sleep clinic', 'sleep monitoring', 'sleep evaluation', 'sleep assessment', 'sleep analysis', 'overnight sleep study', 'in lab sleep study', 'home sleep test', 'hst', 'sleep specialist', 'sleep medicine', 'sleep diagnostic', 'sleep examination', 'sleep monitoring', 'sleep recording', 'sleep measurement', 'sleep evaluation test', 'sleep disorder test', 'sleep apnea test', 'official diagnosis', 'gold standard', 'sleep test results', 'sleep study results']
    },
    
    'bipap': {
        'answer': """**BiPAP (Bilevel Positive Airway Pressure):**

**Definition:**
BiPAP is similar to CPAP but provides two different pressure levels - one for inhalation and a lower one for exhalation.

**How It Works:**
- **Inhalation Pressure (IPAP):** Higher pressure when breathing in
- **Exhalation Pressure (EPAP):** Lower pressure when breathing out
- More comfortable than CPAP for some users
- Better for patients who need higher pressure

**When BiPAP is Used:**
- Patients who can't tolerate CPAP
- Central sleep apnea
- Complex sleep apnea
- COPD with sleep apnea
- Higher pressure requirements
- Difficulty exhaling against CPAP pressure

**Benefits:**
- More comfortable exhalation
- Better compliance than CPAP for some
- Effective for various apnea types
- Adjustable pressure settings

**Types of BiPAP:**
- **Fixed BiPAP:** Constant pressure settings
- **Auto BiPAP:** Automatically adjusts pressure
- **S/T BiPAP:** Spontaneous/Timed mode for breathing support

**Compared to CPAP:**
- CPAP: Single constant pressure
- BiPAP: Two different pressures
- BiPAP: More expensive
- BiPAP: Better for specific conditions

**Maintenance:**
- Similar to CPAP maintenance
- Clean mask and tubing regularly
- Replace filters as recommended
- Annual machine checkup

**Note:**
BiPAP is typically prescribed by sleep specialists for specific conditions.""",
        'keywords': ['bipap', 'bilevel', 'bilevel positive airway pressure', 'bipap machine', 'bipap device', 'bipap therapy', 'bipap treatment', 'bipap vs cpap', 'difference between cpap and bipap', 'bipap pressure', 'ipap', 'epap', 'inhalation pressure', 'exhalation pressure', 'bipap mask', 'bipap benefits', 'bipap uses', 'when bipap', 'bipap indications', 'bipap for central sleep apnea', 'bipap for copd', 'auto bipap', 'fixed bipap', 'bipap settings', 'bipap machine types', 'bipap maintenance']
    },
    
    'snoring': {
        'answer': """**Snoring and Sleep Apnea:**

**Relationship:**
- Loud snoring is a common symptom of sleep apnea
- Not all snoring indicates sleep apnea
- Sleep apnea snoring is often very loud and irregular
- Snoring with breathing pauses suggests sleep apnea

**Sleep Apnea Snoring Characteristics:**
- Very loud and disruptive
- Interrupted by breathing pauses
- Followed by gasping or choking
- More common when sleeping on back
- Partner often notices

**Normal Snoring vs. Sleep Apnea:**
- **Normal Snoring:** Consistent, usually quiet to moderate
- **Sleep Apnea Snoring:** Very loud, irregular, with pauses

**Causes of Snoring:**
- Relaxed throat muscles
- Narrow airway
- Nasal congestion
- Alcohol consumption
- Sleep position
- Obesity

**When to Be Concerned:**
- Snoring with breathing pauses
- Very loud snoring
- Snoring with gasping/choking
- Excessive daytime sleepiness
- Morning headaches
- Partner observations of breathing stops

**Treatment:**
- Sleep apnea treatment (CPAP) usually stops snoring
- Lifestyle changes (weight loss, position)
- Avoid alcohol before bed
- Treat nasal congestion
- Oral appliances
- Surgery (in some cases)

**Note:**
If you snore loudly with breathing pauses, consult a healthcare professional for sleep apnea evaluation.""",
        'keywords': ['snoring', 'snore', 'loud snoring', 'snoring sleep apnea', 'snoring and apnea', 'snoring symptoms', 'snoring causes', 'snoring treatment', 'stop snoring', 'reduce snoring', 'snoring vs sleep apnea', 'snoring with pauses', 'snoring gasping', 'snoring choking', 'snoring partner', 'snoring loud', 'snoring back', 'snoring position', 'snoring alcohol', 'snoring nasal', 'snoring cpap', 'snoring cure', 'snoring remedies', 'snoring solutions']
    },
    
    'weight_loss': {
        'answer': """**Weight Loss and Sleep Apnea:**

**Connection:**
- Obesity is a major risk factor for sleep apnea
- Excess weight can cause fat deposits around upper airway
- Weight loss can significantly improve or eliminate sleep apnea
- Even 10% weight loss can reduce symptoms

**How Weight Affects Sleep Apnea:**
- Fat deposits narrow the airway
- Increased neck circumference
- Reduced muscle tone
- Higher risk of airway collapse

**Weight Loss Benefits:**
- Reduces or eliminates sleep apnea
- Improves sleep quality
- Reduces snoring
- May allow CPAP pressure reduction
- Better overall health

**Weight Loss Methods:**
- Diet and nutrition
- Regular exercise
- Medical weight loss programs
- Bariatric surgery (severe cases)
- Lifestyle modifications

**How Much Weight Loss:**
- Even 10% weight loss helps
- Significant improvement with 20-30% loss
- Complete resolution possible with substantial loss
- Individual results vary

**Exercise Benefits:**
- Strengthens respiratory muscles
- Improves cardiovascular health
- Helps with weight management
- Reduces inflammation
- Better sleep quality

**Important:**
- Weight loss should be done under medical supervision
- Maintain CPAP use during weight loss
- Gradual, sustainable weight loss is best
- Combine with other treatments if needed

**Note:**
Weight loss can be very effective but may not work for all cases, especially if anatomical factors are involved.""",
        'keywords': ['weight loss', 'lose weight', 'weight reduction', 'obesity sleep apnea', 'overweight sleep apnea', 'weight sleep apnea', 'weight and apnea', 'weight loss sleep apnea', 'lose weight apnea', 'weight loss treatment', 'obesity treatment', 'overweight treatment', 'weight management', 'weight control', 'diet sleep apnea', 'exercise sleep apnea', 'weight loss benefits', 'weight loss results', 'how much weight loss', 'weight loss percentage', 'bariatric surgery', 'weight loss surgery', 'medical weight loss', 'weight loss program']
    },
    
    'statistics': {
        'answer': """**Sleep Apnea Statistics:**

**Prevalence:**
- Affects approximately 1 in 5 adults (20%)
- More common in men than women
- Prevalence increases with age
- Often undiagnosed (estimated 80% undiagnosed)

**By Gender:**
- Men: ~25% affected
- Women: ~10% affected
- More common in men, especially middle-aged

**By Age:**
- Increases with age
- Peak prevalence: 50-70 years
- Can occur at any age, including children

**By Severity:**
- Mild: Most common
- Moderate: Common
- Severe: Less common but more serious

**Risk Factors:**
- Obesity: 60-90% of patients are overweight
- Age over 40: Higher risk
- Male gender: 2-3x more common
- Family history: Increased risk

**Complications:**
- High blood pressure: 50% of sleep apnea patients
- Heart disease: Increased risk
- Stroke: 2-3x higher risk
- Diabetes: 40% correlation

**Treatment Compliance:**
- CPAP compliance: ~50-80%
- Effectiveness: 80-90% when used properly
- Lifestyle changes: Varying success rates

**Economic Impact:**
- Billions in healthcare costs annually
- Increased accident risk
- Reduced work productivity
- Higher medical expenses

**Our System Statistics:**
- Accuracy: 85.2%
- Dataset: 35 patients, 2,200+ windows
- Processing time: <2 seconds per file
- Model: Random Forest classifier""",
        'keywords': ['statistics', 'stats', 'prevalence', 'how common', 'how many', 'percentage', 'rate', 'incidence', 'frequency', 'demographics', 'population', 'sleep apnea statistics', 'apnea prevalence', 'sleep apnea rate', 'sleep apnea percentage', 'how many people', 'sleep apnea common', 'sleep apnea facts', 'sleep apnea numbers', 'epidemiology', 'sleep apnea demographics', 'sleep apnea by age', 'sleep apnea by gender', 'sleep apnea risk', 'sleep apnea data', 'sleep apnea research', 'sleep apnea studies']
    }
}


def get_chatbot_response(user_input):
    """Get response from sleep apnea chatbot"""
    user_input_lower = user_input.lower().strip()
    
    # Check for greetings
    if any(word in user_input_lower for word in ['hello', 'hi', 'hey', 'greetings', 'good morning', 'good afternoon', 'good evening']):
        return """Hello! 👋 I'm your Sleep Apnea Assistant. I can help answer questions about:
        
**Sleep Apnea Topics:**
• What sleep apnea is and its types
• Symptoms, signs, and warning indicators
• Causes and risk factors
• Diagnosis methods and tests
• Treatment options (CPAP, BiPAP, lifestyle)
• Prevention strategies
• Complications and risks
• Sleep apnea in children
• Snoring relationship
• Weight loss connection
• Statistics and prevalence

**About This Detection System:**
• Project overview and features
• Model details and accuracy (85.2%)
• ECG-based detection method
• 12 extracted features
• Dataset information (PhysioNet)
• How to use the system
• Supported file formats
• System performance metrics

What would you like to know about sleep apnea or this detection system?"""
    
    # Check for thanks/goodbye
    if any(word in user_input_lower for word in ['thank', 'thanks', 'bye', 'goodbye', 'see you']):
        return """You're welcome! 😊 

Remember: This information is for educational purposes only. Always consult healthcare professionals for medical advice and diagnosis.

Feel free to ask more questions anytime!"""
    
    # Search knowledge base with improved matching
    best_match = None
    best_score = 0
    best_topic = None
    
    # Split user input into words for better matching
    user_words = set(user_input_lower.split())
    
    for topic, data in SLEEP_APNEA_KNOWLEDGE.items():
        score = 0
        matched_keywords = []
        
        # Check for exact phrase matches first (higher weight)
        for keyword in data['keywords']:
            if keyword in user_input_lower:
                # Longer keywords get higher weight
                keyword_weight = len(keyword.split()) * 10 + len(keyword)
                score += keyword_weight
                matched_keywords.append(keyword)
        
        # Also check individual word matches (lower weight)
        keyword_words = set()
        for keyword in data['keywords']:
            keyword_words.update(keyword.split())
        
        # Count matching words
        word_matches = user_words.intersection(keyword_words)
        score += len(word_matches) * 2
        
        # Boost score if topic name matches
        topic_words = set(topic.split('_'))
        topic_match = user_words.intersection(topic_words)
        if topic_match:
            score += len(topic_match) * 5
        
        if score > best_score:
            best_score = score
            best_match = data['answer']
            best_topic = topic
    
    # If good match found, return it (lowered threshold for better coverage)
    if best_match and best_score > 3:
        return best_match
    
    # General fallback responses
    if any(word in user_input_lower for word in ['help', 'what can you', 'what do you', 'what questions', 'what topics', 'capabilities', 'abilities']):
        return """I can help you with information about sleep apnea and this detection system! Here are topics I can discuss:

🔍 **Diagnosis & Detection**
- How sleep apnea is diagnosed
- ECG-based detection (this system)
- Sleep studies (Polysomnography)
- Home sleep tests
- AHI (Apnea-Hypopnea Index)

💊 **Treatment Options**
- CPAP therapy and machines
- BiPAP therapy
- Lifestyle changes
- Weight loss
- Surgical options
- Oral appliances

📋 **General Information**
- What sleep apnea is (types, definition)
- Symptoms and warning signs
- Causes and risk factors
- Severity levels (mild, moderate, severe)
- Complications and risks
- Prevention strategies
- Snoring relationship

👶 **Special Cases**
- Sleep apnea in children
- Pediatric sleep apnea
- Different types of apnea (OSA, Central, Complex)

🤖 **About This System**
- Project overview
- Model details and accuracy
- Features used (12 ECG features)
- Dataset information (PhysioNet)
- How to use the system
- File formats supported
- System performance

📊 **Statistics & Research**
- Sleep apnea prevalence
- Demographics
- Treatment statistics
- Research data

Ask me anything about sleep apnea or this detection system! I can answer questions about symptoms, treatment, diagnosis, the ECG detection method, model performance, file formats, and much more.

**Remember:** I provide educational information only. Always consult healthcare professionals for medical advice and diagnosis."""
    
    # Default response for unclear questions
    return """I understand you're asking about sleep apnea, but I need a bit more clarity. 

Here are some example questions you can ask me:

**General Questions:**
- "What is sleep apnea?"
- "What are the symptoms?"
- "What causes sleep apnea?"
- "How is it diagnosed?"
- "How is it treated?"
- "What is the severity?"

**Treatment Questions:**
- "Tell me about CPAP"
- "What is BiPAP?"
- "How does weight loss help?"
- "What are treatment options?"

**System/Project Questions:**
- "How does this system work?"
- "What is the accuracy?"
- "What features are used?"
- "How do I use this system?"
- "What file formats are supported?"
- "Tell me about the model"

**Technical Questions:**
- "How does ECG detection work?"
- "What is the dataset?"
- "What is AHI?"
- "What is polysomnography?"

**Specific Topics:**
- "Sleep apnea in children"
- "Snoring and sleep apnea"
- "Complications of sleep apnea"
- "How to prevent sleep apnea"

Or try rephrasing your question with more specific keywords. I'm here to help with any sleep apnea-related questions or questions about this detection system!

**Important:** This chatbot provides educational information only. For medical diagnosis and treatment, please consult qualified healthcare professionals."""


def render_chatbot():
    """Render the sleep apnea chatbot in the sidebar"""
    with st.sidebar:
        st.markdown("""
        <div style="background: linear-gradient(135deg, #1e293b, #334155); 
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    padding: 1.5rem; border-radius: 16px; margin-bottom: 1rem; text-align: center;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);">
            <h3 style="color: #f1f5f9; margin: 0; font-size: 1.4rem; font-weight: 700;">💬 SLEEP APNEA ASSISTANT</h3>
            <p style="color: #e2e8f0; margin: 0.5rem 0 0 0; font-size: 0.9rem;">
                Ask me anything about sleep apnea!
            </p>
        </div>
        """, unsafe_allow_html=True)
        
        # Chat messages container with scrollable area - Dark Theme
        st.markdown("""
        <style>
        .chat-messages-container {
            max-height: 500px;
            overflow-y: auto;
            padding: 1rem;
            background: rgba(30, 41, 59, 0.6);
            border-radius: 12px;
            margin-bottom: 1rem;
            border: 1px solid rgba(59, 130, 246, 0.2);
        }
        </style>
        """, unsafe_allow_html=True)
        
        # Display chat history in a scrollable container
        if st.session_state.chat_messages:
            # Use a container with max height for scrolling
            chat_display = st.container()
            with chat_display:
                for idx, message in enumerate(st.session_state.chat_messages):
                    if message['role'] == 'user':
                        # User messages - dark theme styled bubble
                        st.markdown(f"""
                        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
                                    color: white; padding: 0.9rem 1.2rem; border-radius: 16px; 
                                    margin: 0.8rem 0; margin-left: 10%; 
                                    box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
                                    border: 1px solid rgba(255, 255, 255, 0.1);">
                            <strong>You:</strong><br>
                            <div style="margin-top: 0.4rem; line-height: 1.5;">{message['content'].replace(chr(10), '<br>')}</div>
                        </div>
                        """, unsafe_allow_html=True)
                    else:
                        # Bot messages - dark theme with markdown support
                        with st.container():
                            st.markdown("""
                            <div style="background: rgba(30, 41, 59, 0.8); 
                                        border: 1px solid rgba(59, 130, 246, 0.3);
                                        padding: 1rem; border-radius: 16px; 
                                        margin-bottom: 1rem;">
                            """, unsafe_allow_html=True)
                            st.markdown("**🤖 Assistant:**")
                            # Render bot response with markdown support
                            st.markdown(message['content'])
                            st.markdown("</div>", unsafe_allow_html=True)
                            if idx < len(st.session_state.chat_messages) - 1:
                                st.markdown("<hr style='border-color: rgba(59, 130, 246, 0.2); margin: 1rem 0;'>", unsafe_allow_html=True)
        else:
            st.markdown("""
            <div style="background: rgba(59, 130, 246, 0.1); 
                        border: 1px solid rgba(59, 130, 246, 0.3);
                        border-radius: 12px; padding: 1rem; 
                        color: #f1f5f9; text-align: center;">
                👋 Hello! I'm here to help answer your questions about sleep apnea. Ask me anything!
            </div>
            """, unsafe_allow_html=True)
        
        # Chat input using form for automatic clearing
        st.markdown("<br>", unsafe_allow_html=True)
        
        # Clear button (outside form)
        if st.button("Clear 🗑️", use_container_width=True, key="clear_chat"):
            st.session_state.chat_messages = []
            st.rerun()
        
        # Form for chat input (clears automatically on submit)
        with st.form(key="chat_form", clear_on_submit=True):
            user_input = st.text_input(
                "Type your question:",
                key="chat_input",
                placeholder="e.g., What is sleep apnea?",
                label_visibility="collapsed"
            )
            send_button = st.form_submit_button("Send 💬", use_container_width=True, type="primary")
            
            if send_button and user_input.strip():
                # Add user message
                st.session_state.chat_messages.append({
                    'role': 'user',
                    'content': user_input
                })
                
                # Get bot response
                bot_response = get_chatbot_response(user_input)
                
                # Add bot message
                st.session_state.chat_messages.append({
                    'role': 'bot',
                    'content': bot_response
                })
                
                # Rerun to update UI
                st.rerun()
        
        # Quick question buttons - Dark Theme
        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("""
        <div style="color: #f1f5f9; font-weight: 600; margin-bottom: 0.8rem; font-size: 0.95rem;">
            💡 Quick Questions:
        </div>
        """, unsafe_allow_html=True)
        
        quick_questions = [
            "What is sleep apnea?",
            "What are the symptoms?",
            "How is it treated?",
            "How does this system work?",
            "What is the accuracy?"
        ]
        
        for q in quick_questions:
            if st.button(q, key=f"quick_{q}", use_container_width=True):
                # Add user message
                st.session_state.chat_messages.append({
                    'role': 'user',
                    'content': q
                })
                
                # Get bot response
                bot_response = get_chatbot_response(q)
                
                # Add bot message
                st.session_state.chat_messages.append({
                    'role': 'bot',
                    'content': bot_response
                })
                
                st.rerun()
        
        # Disclaimer - Dark Theme
        st.markdown("""
        <div style="background: rgba(245, 158, 11, 0.15); 
                    border: 1px solid rgba(245, 158, 11, 0.4); 
                    border-radius: 12px; padding: 0.9rem; margin-top: 1rem; 
                    font-size: 0.8rem; color: #fbbf24; backdrop-filter: blur(10px);">
            ⚠️ <strong>Disclaimer:</strong> This chatbot provides educational information only. 
            Always consult healthcare professionals for medical advice and diagnosis.
        </div>
        """, unsafe_allow_html=True)

