import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Activity, ShieldCheck, FileText, UserCircle, Microscope, Stethoscope, Database, Server, BrainCircuit, Globe, ArrowRight, Zap, CheckCircle2, HeartPulse, Layers, Lock, Cpu, Lightbulb, TrendingUp } from 'lucide-react';
import './App.css';

// --- Animations ---
const fadeUp = { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -30 } };
const slideIn = { initial: { opacity: 0, x: 100 }, animate: { opacity: 1, x: 0, transition: { type: 'spring', damping: 20 } }, exit: { opacity: 0, x: -100 } };

// --- Reusable Components ---
const CleanSection = ({ children, style }) => (
  <motion.div variants={fadeUp} style={{ marginBottom: '30px', ...style }}>
    {children}
  </motion.div>
);

const BulletList = ({ items }) => (
  <ul style={{ paddingLeft: '25px', fontSize: '1.05em', color: '#334155', lineHeight: 1.8 }}>
    {items.map((item, i) => (
      <li key={i} style={{ marginBottom: '15px' }}>{item}</li>
    ))}
  </ul>
);

const HighlightText = ({ children }) => (
  <span style={{ color: '#0284c7', fontWeight: 600 }}>{children}</span>
);

const WorkflowNode = ({ icon: Icon, title, desc }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
    <div style={{ background: 'rgba(2, 132, 199, 0.1)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={24} color="#0284c7" />
    </div>
    <div>
      <h4 style={{ margin: 0, fontSize: '1.2em', color: '#0f172a' }}>{title}</h4>
      <p style={{ margin: 0, fontSize: '1em', color: '#475569' }}>{desc}</p>
    </div>
  </div>
);

// --- Slides ---

// Slide 1: Title & Team
const Slide1 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: '40px' }}>
    <ShieldCheck size={80} color="#0284c7" style={{ marginBottom: '20px' }} />
    <h1 style={{ fontSize: '4.5em', marginBottom: '10px', color: '#0f172a' }}>HEALTHGUARD AI</h1>
    <h3 style={{ color: '#0369a1', letterSpacing: '1px', marginBottom: '40px', fontSize: '1.6em', fontWeight: 500 }}>
      A Complete AI-Driven Medical Ecosystem for Predictive, Explainable & Automated Healthcare
    </h3>
    
    <div style={{ fontSize: '1.3em', color: '#10b981', fontWeight: 600, letterSpacing: '2px', marginBottom: '40px' }}>
      DATA → PREDICT → AUTOMATE → RESOLVE
    </div>

    <div style={{ marginBottom: '40px' }}>
      <h4 style={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px' }}>Developed by SRM University Cohort</h4>
      <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1em', color: '#334155', lineHeight: 1.8 }}>
        <li><HighlightText>Saravanan Sathishkumar</HighlightText> — Lead Architect & AI Integration</li>
        <li><HighlightText>Evangelin John</HighlightText> — Frontend & UX Engineer</li>
        <li><HighlightText>Daiwakshya</HighlightText> — Backend Microservices</li>
        <li><HighlightText>Sumukesh</HighlightText> — Data & Systems Infrastructure</li>
      </ul>
    </div>
    
    <p style={{ fontSize: '1.1em', color: '#475569', maxWidth: '900px' }}>
      <strong>Core Objective:</strong> To transform fragmented, paper-based healthcare workflows into a unified, predictive and AI-assisted digital ecosystem connecting Patients, Doctors and Diagnostic Laboratories.
    </p>
  </motion.div>
);

// Slide 2: Problem Statement
const Slide2 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px' }}>
    <h2>The Problem: Healthcare is Still Reactive</h2>
    
    <CleanSection>
      <h4 style={{ color: '#ef4444', fontSize: '1.3em', marginBottom: '15px' }}>Traditional Workflow Dependencies</h4>
      <BulletList items={[
        "Physical patient records and paperwork",
        "Manual prescription generation",
        "Disconnected hospital departments and isolated diagnostic systems",
        "Manual interpretation of physiological signals",
        "Delayed communication between doctors, patients and laboratories",
        "Reactive disease diagnosis after symptoms become severe"
      ]} />
    </CleanSection>

    <CleanSection>
      <h4 style={{ color: '#ef4444', fontSize: '1.3em', marginBottom: '15px' }}>Current Healthcare Cycle</h4>
      <p style={{ fontSize: '1.1em', color: '#475569', background: '#f8fafc', padding: '15px', borderRadius: '8px', display: 'inline-block' }}>
        Patient develops symptoms → Visits hospital/clinic → Manual data collection → Diagnostic testing → Doctor manually reviews results → Prescription/referral → Patient receives instructions
      </p>
    </CleanSection>

    <CleanSection>
      <h4 style={{ color: '#0f172a', fontSize: '1.3em', marginBottom: '15px' }}>Major Consequence</h4>
      <BulletList items={[
        "Healthcare systems often identify chronic conditions after clinical symptoms become significant, rather than continuously screening for early warning signals.",
        "This creates diagnostic delays, increased clinical workload, fragmented patient history, and reduced opportunity for early intervention."
      ]} />
      <p style={{ fontSize: '1.2em', color: '#b91c1c', fontWeight: 500, marginTop: '20px' }}>
        <strong>Core Problem:</strong> There is no unified intelligent pipeline connecting physiological data → AI prediction → clinical validation → standardized prescription → patient communication.
      </p>
    </CleanSection>
  </motion.div>
);

// Slide 3: Research Gap
const Slide3 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px' }}>
    <h2>Existing Systems vs. Missing Intelligence</h2>
    <div className="subtitle-text">Current digital healthcare solutions solve individual problems, but rarely provide an end-to-end automated ecosystem.</div>
    
    <CleanSection>
      <h4 style={{ color: '#0284c7', fontSize: '1.3em' }}>Existing Approach</h4>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>
        Wearable/ECG Data → Data Collection → Separate AI Model → Doctor manually interprets output → Manual Prescription → Patient Communication
      </p>
    </CleanSection>

    <CleanSection style={{ marginTop: '40px' }}>
      <h4 style={{ color: '#ef4444', fontSize: '1.3em', marginBottom: '20px' }}>Identified Gaps</h4>
      <ul style={{ paddingLeft: '0', listStyle: 'none', fontSize: '1.05em', color: '#334155', lineHeight: 1.8 }}>
        <li style={{ marginBottom: '10px' }}><HighlightText>1. Prediction Gap:</HighlightText> Many systems remain symptom-driven. Early physiological abnormalities are not continuously converted into actionable risk scores.</li>
        <li style={{ marginBottom: '10px' }}><HighlightText>2. Workflow Gap:</HighlightText> AI models operate independently from hospital systems. Prediction does not automatically translate into clinical action.</li>
        <li style={{ marginBottom: '10px' }}><HighlightText>3. Explainability Gap:</HighlightText> Black-box AI predictions can be difficult for physicians to validate.</li>
        <li style={{ marginBottom: '10px' }}><HighlightText>4. Standardization Gap:</HighlightText> Clinical terminology and prescriptions may not follow standardized terminology systems.</li>
        <li style={{ marginBottom: '10px' }}><HighlightText>5. Communication Gap:</HighlightText> Medical terminology is often difficult for patients to understand.</li>
        <li style={{ marginBottom: '10px' }}><HighlightText>6. Integration Gap:</HighlightText> Patient, doctor and laboratory workflows remain disconnected.</li>
      </ul>
    </CleanSection>

    <CleanSection>
      <p style={{ fontSize: '1.2em', color: '#166534', fontWeight: 500 }}>
        <strong>Research Opportunity:</strong> Build one integrated pipeline that converts raw physiological data into explainable clinical intelligence and actionable patient care.
      </p>
    </CleanSection>
  </motion.div>
);

// Slide 4: Proposed Solution
const Slide4 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px' }}>
    <h2>Proposed Solution: HealthGuard AI</h2>
    <div className="subtitle-text">HealthGuard AI is an end-to-end predictive healthcare ecosystem that integrates:</div>
    
    <CleanSection>
      <ul style={{ paddingLeft: '0', listStyle: 'none', fontSize: '1.1em', color: '#334155', lineHeight: 1.8 }}>
        <li style={{ marginBottom: '15px' }}><HighlightText>1. Digital Health Records:</HighlightText> Centralized patient information replaces fragmented paper records.</li>
        <li style={{ marginBottom: '15px' }}><HighlightText>2. AI-Based Screening:</HighlightText> Physiological signals such as ECG are automatically analyzed for disease-associated patterns.</li>
        <li style={{ marginBottom: '15px' }}><HighlightText>3. Explainable AI:</HighlightText> Random Forest provides interpretable risk predictions that can be reviewed by clinicians.</li>
        <li style={{ marginBottom: '15px' }}><HighlightText>4. Clinical Automation:</HighlightText> AI output connects directly with the physician's workflow.</li>
        <li style={{ marginBottom: '15px' }}><HighlightText>5. Standardized Medical Terminology:</HighlightText> SNOMED CT provides standardized clinical concepts and terminology.</li>
        <li style={{ marginBottom: '15px' }}><HighlightText>6. Generative AI Communication:</HighlightText> Llama converts complex clinical information into understandable patient-facing explanations.</li>
        <li style={{ marginBottom: '15px' }}><HighlightText>7. Multi-Portal Ecosystem:</HighlightText> Patient Portal ↔ Doctor Portal ↔ Laboratory Portal</li>
      </ul>
    </CleanSection>

    <CleanSection style={{ marginTop: '40px' }}>
      <h4 style={{ color: '#0369a1', fontSize: '1.3em' }}>Design Philosophy</h4>
      <p style={{ fontSize: '1.4em', color: '#0284c7', fontWeight: 600, letterSpacing: '2px', background: '#f0f9ff', display: 'inline-block', padding: '15px 25px', borderRadius: '8px' }}>
        DATA → PREDICT → EXPLAIN → AUTOMATE → COMMUNICATE → RESOLVE
      </p>
      <p style={{ fontSize: '1.1em', color: '#475569', marginTop: '15px' }}>
        This four-stage philosophy—Digitize, Predict, Automate and Resolve—is the central architecture described in the project report.
      </p>
    </CleanSection>
  </motion.div>
);

// Slide 5: System Architecture
const Slide5 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px' }}>
    <h2>Multi-Layer AI Healthcare Architecture</h2>
    
    <CleanSection>
      <h4 style={{ color: '#0284c7', fontSize: '1.2em', marginBottom: '10px' }}>Layer 1 — User Interface</h4>
      <BulletList items={[
        "Patient Portal: Data upload, Health records, Prescription viewing, AI-generated health pamphlets",
        "Doctor Portal: Patient queue, AI prediction, Explainability dashboard, Prescription generation",
        "Laboratory Portal: Diagnostic requests, Test-result upload, Clinical verification"
      ]} />
    </CleanSection>

    <CleanSection>
      <h4 style={{ color: '#0284c7', fontSize: '1.2em', marginBottom: '10px' }}>Layer 2 — Application Services</h4>
      <p style={{ fontSize: '1.05em', color: '#475569', margin: 0, paddingLeft: '25px' }}>Authentication | Patient management | Doctor management | Prescription service | Laboratory service | Notification service</p>
    </CleanSection>

    <CleanSection>
      <h4 style={{ color: '#0284c7', fontSize: '1.2em', marginBottom: '10px' }}>Layer 3 — AI Layer</h4>
      <BulletList items={[
        "ECG Processing → WFDB",
        "Feature Engineering → RR Intervals + HRV",
        "Prediction → Random Forest",
        "Patient Communication → Llama LLM"
      ]} />
    </CleanSection>

    <CleanSection>
      <h4 style={{ color: '#0284c7', fontSize: '1.2em', marginBottom: '10px' }}>Layer 4 — Clinical Terminology</h4>
      <p style={{ fontSize: '1.05em', color: '#475569', margin: 0, paddingLeft: '25px' }}>Doctor → Go/Fiber Proxy → Java Snowstorm → Elasticsearch → SNOMED CT</p>
    </CleanSection>

    <CleanSection>
      <h4 style={{ color: '#0284c7', fontSize: '1.2em', marginBottom: '10px' }}>Layer 5 — Data</h4>
      <p style={{ fontSize: '1.05em', color: '#475569', margin: 0, paddingLeft: '25px' }}>PostgreSQL | Elasticsearch | JSON session storage</p>
    </CleanSection>
    
    <p style={{ fontSize: '1em', color: '#64748b', fontStyle: 'italic', marginTop: '20px' }}>
      The architecture uses React/Vite, Streamlit, Python FastAPI, Go/Fiber, Java Snowstorm, Elasticsearch, PostgreSQL and Llama as interconnected components.
    </p>
  </motion.div>
);

// Slide 6: AI/ML Pipeline
const Slide6 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px' }}>
    <h2>AI/ML Pipeline</h2>
    <div className="subtitle-text">ECG → Feature Extraction → Risk Prediction</div>
    
    <CleanSection style={{ marginTop: '30px' }}>
      <WorkflowNode icon={Activity} title="Step 1 — ECG Data Acquisition" desc="Patient ECG recordings are uploaded in .dat and .hea formats." />
      <WorkflowNode icon={Cpu} title="Step 2 — Signal Processing" desc="The Python backend processes ECG signals using WFDB." />
      <WorkflowNode icon={HeartPulse} title="Step 3 — Feature Extraction" desc="Important physiological features include RR Intervals (time between heartbeats) and Heart Rate Variability (HRV)." />
      <WorkflowNode icon={Layers} title="Step 4 — Feature Engineering" desc="Extracted temporal and frequency-domain characteristics are converted into machine-learning features." />
      <WorkflowNode icon={BrainCircuit} title="Step 5 — Random Forest Classification" desc="The trained Random Forest processes features and produces Disease probability, Risk level, Confidence score, and Classification output (Mild → Moderate → Severe)." />
    </CleanSection>

    <CleanSection style={{ marginTop: '30px' }}>
      <h4 style={{ color: '#0284c7', fontSize: '1.2em' }}>Why Random Forest?</h4>
      <BulletList items={[
        "Strong performance on structured features",
        "Robust to nonlinear relationships",
        "Suitable for tabular physiological features",
        "Easier to interpret than many deep neural networks",
        "Supports feature importance analysis"
      ]} />
      <p style={{ fontSize: '1em', color: '#64748b', fontStyle: 'italic', marginTop: '10px' }}>
        The system initially targets Obstructive Sleep Apnea (OSA) using ECG-derived RR/HRV characteristics.
      </p>
    </CleanSection>
  </motion.div>
);

// Slide 7: Explainable AI + Generative AI
const Slide7 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px' }}>
    <h2>Explainable AI + Generative AI</h2>
    <div className="subtitle-text">From Prediction to Understanding</div>
    
    <CleanSection>
      <h4 style={{ color: '#10b981', fontSize: '1.3em', display: 'flex', alignItems: 'center', gap: '10px' }}><BrainCircuit size={24}/> Explainable AI — Random Forest</h4>
      <p style={{ fontSize: '1.1em', color: '#475569', marginBottom: '10px' }}>
        Healthcare cannot rely solely on: <em>"The AI says the patient is high risk."</em> The physician needs to understand why.
      </p>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>HealthGuard AI therefore provides:</p>
      <BulletList items={[
        "Risk score & Confidence level",
        "Feature importance & HRV-related indicators",
        "Interpretable model output"
      ]} />
      <p style={{ fontSize: '1.1em', color: '#475569', background: '#f8fafc', padding: '15px', borderRadius: '8px', display: 'inline-block' }}>
        <strong>Example Prediction:</strong> Severe OSA Risk — 85.2%<br/>
        <strong>Supporting indicators:</strong> Abnormal RR interval patterns, HRV variation, Physiological signal abnormalities.
      </p>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>The doctor can review the AI output before taking clinical action.</p>
    </CleanSection>
    
    <CleanSection style={{ marginTop: '40px' }}>
      <h4 style={{ color: '#0284c7', fontSize: '1.3em', display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={24}/> Generative AI — Llama</h4>
      <p style={{ fontSize: '1.1em', color: '#475569', marginBottom: '10px' }}>
        The second AI layer addresses a completely different problem: Doctor understands clinical terminology. Patient may not.
      </p>
      <p style={{ fontSize: '1.2em', color: '#0369a1', fontWeight: 600, margin: '15px 0' }}>
        Clinical Prescription → SNOMED CT concepts → Llama LLM → Patient-Friendly Health Pamphlet
      </p>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>The LLM can transform complex clinical instructions into understandable information covering:</p>
      <BulletList items={[
        "Condition explanation",
        "Medication/instruction explanation",
        "Lifestyle guidance",
        "Follow-up instructions",
        "Risk awareness"
      ]} />
      <p style={{ fontSize: '1em', color: '#64748b', fontStyle: 'italic' }}>The report specifically positions Llama as the communication layer that translates clinically structured information into patient-readable explanations.</p>
    </CleanSection>
  </motion.div>
);

// Slide 8: Portal-Wise Use Cases
const Slide8 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px' }}>
    <h2>Three-Portal Healthcare Ecosystem</h2>
    
    <CleanSection style={{ marginTop: '30px' }}>
      <h4 style={{ color: '#0284c7', fontSize: '1.3em', display: 'flex', alignItems: 'center', gap: '10px' }}><UserCircle size={24}/> 1. Patient Portal</h4>
      <BulletList items={[
        "Input: Login, Patient profile, ECG/medical data, Previous records",
        "Processing: Secure data submission, AI screening, Prescription synchronization",
        "Output: Health status, Doctor prescription, AI-generated health pamphlet, Follow-up instructions"
      ]} />
    </CleanSection>

    <CleanSection>
      <h4 style={{ color: '#0284c7', fontSize: '1.3em', display: 'flex', alignItems: 'center', gap: '10px' }}><Stethoscope size={24}/> 2. Doctor Portal</h4>
      <BulletList items={[
        "Input: Patient data, ECG, AI-generated risk results",
        "Processing: Patient prioritization, AI prediction, Explainability review, SNOMED CT terminology search",
        "Output: Validated diagnosis, Standardized prescription, Lab referral, Patient instructions"
      ]} />
    </CleanSection>

    <CleanSection>
      <h4 style={{ color: '#0284c7', fontSize: '1.3em', display: 'flex', alignItems: 'center', gap: '10px' }}><Microscope size={24}/> 3. Laboratory Portal</h4>
      <BulletList items={[
        "Input: Doctor-requested tests, Patient diagnostic information",
        "Processing: Test execution, Result validation, Report generation",
        "Output: Digital laboratory report, Automatic synchronization to doctor dashboard"
      ]} />
    </CleanSection>

    <CleanSection style={{ marginTop: '30px' }}>
      <h4 style={{ color: '#d97706', fontSize: '1.3em' }}>Key Innovation</h4>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>
        Instead of a linear chain (<span style={{textDecoration:'line-through'}}>Patient → Hospital → Lab → Doctor → Patient</span>), 
        HealthGuard creates a continuous network:
      </p>
      <p style={{ fontSize: '1.3em', color: '#b45309', fontWeight: 600 }}>Patient ↔ Doctor ↔ Lab</p>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>with AI operating continuously across the workflow.</p>
    </CleanSection>
  </motion.div>
);

// Slide 9: Complete Technology Stack
const Slide9 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px' }}>
    <h2>Technology Stack</h2>
    
    <CleanSection style={{ marginTop: '30px' }}>
      <ul style={{ paddingLeft: '0', listStyle: 'none', fontSize: '1.1em', color: '#334155', lineHeight: 2 }}>
        <li><HighlightText>Patient/Lab UI:</HighlightText> Streamlit (Rapid portal development & data ingestion)</li>
        <li><HighlightText>Doctor UI:</HighlightText> React + Vite (High-performance clinical interface)</li>
        <li><HighlightText>UI Styling:</HighlightText> Tailwind CSS (Responsive interface)</li>
        <li><HighlightText>AI API:</HighlightText> Python + FastAPI (ML inference services)</li>
        <li><HighlightText>Signal Processing:</HighlightText> WFDB (ECG .dat/.hea processing)</li>
        <li><HighlightText>Machine Learning:</HighlightText> Scikit-learn (Random Forest classification)</li>
        <li><HighlightText>Explainable AI (XAI):</HighlightText> Random Forest Feature Analysis (Interpretable predictions)</li>
        <li><HighlightText>Generative AI:</HighlightText> Llama (Patient-friendly medical communication)</li>
        <li><HighlightText>Backend Proxy:</HighlightText> Go + Fiber (High-performance terminology API)</li>
        <li><HighlightText>Concurrency:</HighlightText> Go Singleflight (Duplicate-request suppression)</li>
        <li><HighlightText>Terminology Server:</HighlightText> Java Snowstorm (SNOMED CT terminology)</li>
        <li><HighlightText>Search Engine:</HighlightText> Elasticsearch 8.x (Clinical terminology search)</li>
        <li><HighlightText>Relational DB:</HighlightText> PostgreSQL 15 (Structured healthcare records)</li>
        <li><HighlightText>Session Storage:</HighlightText> JSON (Lightweight session state)</li>
      </ul>
    </CleanSection>

    <CleanSection style={{ marginTop: '40px' }}>
      <h4 style={{ color: '#0369a1', fontSize: '1.2em', marginBottom: '15px' }}>Architecture Philosophy</h4>
      <BulletList items={[
        "Python → AI",
        "Go → High-performance API proxy",
        "Java → Clinical terminology",
        "React → Clinical workspace",
        "Streamlit → Rapid patient/lab interfaces",
        "PostgreSQL → Structured persistence",
        "Elasticsearch → High-speed terminology retrieval",
        "Llama → Human-readable communication"
      ]} />
      <p style={{ fontSize: '1em', color: '#64748b', fontStyle: 'italic', marginTop: '15px' }}>The technology stack is directly derived from the project's documented implementation architecture.</p>
    </CleanSection>
  </motion.div>
);

// Slide 10: SNOMED CT + High-Performance Backend
const Slide10 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px' }}>
    <h2>Clinical Terminology Intelligence</h2>
    <div className="subtitle-text">SNOMED CT + High-Performance Backend</div>
    
    <CleanSection>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>
        A major technical novelty is that the prescription system does not depend only on free-text medical terms.
      </p>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>
        <strong>Problem:</strong> A doctor searches: “Sleep Apnea”. The system needs to identify the corresponding standardized clinical concept.
      </p>
    </CleanSection>

    <CleanSection>
      <h4 style={{ color: '#0284c7', fontSize: '1.2em' }}>HealthGuard Architecture</h4>
      <p style={{ fontSize: '1.1em', color: '#334155', fontWeight: 500, lineHeight: 1.8 }}>
        Doctor → React Prescription Interface → Go/Fiber Proxy → Singleflight Cache/Concurrency Layer → Java Snowstorm → Elasticsearch → SNOMED CT → Standardized Clinical Concept
      </p>
    </CleanSection>

    <CleanSection style={{ marginTop: '30px' }}>
      <h4 style={{ color: '#10b981', fontSize: '1.2em' }}>Why Go Singleflight?</h4>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>
        Imagine 50 doctors simultaneously search “Sleep Apnea”.<br/>
        A conventional implementation could trigger: 50 identical database queries.<br/>
        HealthGuard's singleflight mechanism allows: <strong>50 requests → 1 database request → shared response</strong>.
      </p>
      <p style={{ fontSize: '1.1em', color: '#475569' }}><strong>Benefits:</strong></p>
      <BulletList items={[
        "Lower database load & Reduced duplicate computation",
        "Faster response",
        "Better concurrency & Improved scalability"
      ]} />
    </CleanSection>

    <CleanSection style={{ marginTop: '30px' }}>
      <h4 style={{ color: '#8b5cf6', fontSize: '1.2em' }}>Why SNOMED CT?</h4>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>It enables:</p>
      <BulletList items={[
        "Standardized clinical terminology",
        "Interoperability",
        "Consistent diagnosis representation",
        "Machine-readable medical concepts",
        "Better integration with future healthcare systems"
      ]} />
    </CleanSection>
  </motion.div>
);

// Slide 11: End-to-End Clinical Use Case + Novelty
const Slide11 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px', overflowY: 'auto', paddingRight: '20px' }}>
    <h2>Real-World Clinical Workflow</h2>
    <div className="subtitle-text">Scenario: Suspected Obstructive Sleep Apnea</div>
    
    <CleanSection>
      <ul style={{ paddingLeft: '0', listStyle: 'none', fontSize: '1.05em', color: '#334155', lineHeight: 1.6 }}>
        <li style={{ marginBottom: '10px' }}><strong>1. Patient Registration:</strong> Patient enters the HealthGuard ecosystem.</li>
        <li style={{ marginBottom: '10px' }}><strong>2. ECG Upload:</strong> ECG recording is uploaded digitally.</li>
        <li style={{ marginBottom: '10px' }}><strong>3. Automatic AI Screening:</strong> WFDB processes ECG.</li>
        <li style={{ marginBottom: '10px' }}><strong>4. Feature Extraction:</strong> RR interval + HRV features are extracted.</li>
        <li style={{ marginBottom: '10px' }}><strong>5. Random Forest Prediction:</strong> System generates disease risk. (Example: 85.2% Severe OSA Risk)</li>
        <li style={{ marginBottom: '10px' }}><strong>6. Doctor Queue Prioritization:</strong> High-risk patient receives priority.</li>
        <li style={{ marginBottom: '10px' }}><strong>7. Explainable Validation:</strong> Doctor reviews AI indicators.</li>
        <li style={{ marginBottom: '10px' }}><strong>8. Standardized Prescription:</strong> Doctor searches clinical terms through SNOMED CT.</li>
        <li style={{ marginBottom: '10px' }}><strong>9. Prescription Generation:</strong> Prescription is digitally generated.</li>
        <li style={{ marginBottom: '10px' }}><strong>10. Llama Translation:</strong> Clinical instructions → Patient-friendly language.</li>
        <li style={{ marginBottom: '10px' }}><strong>11. Patient Notification:</strong> Patient receives health pamphlet.</li>
        <li style={{ marginBottom: '10px' }}><strong>12. Laboratory Escalation:</strong> If required, diagnostic testing is initiated.</li>
      </ul>
    </CleanSection>

    <CleanSection style={{ marginTop: '30px' }}>
      <h4 style={{ color: '#0f172a', fontSize: '1.3em', marginBottom: '15px' }}>The Novelty</h4>
      <p style={{ fontSize: '1.1em', color: '#475569' }}>HealthGuard AI is not simply an ECG classifier. It combines:</p>
      <p style={{ fontSize: '1.2em', color: '#0284c7', fontWeight: 600, padding: '15px', background: '#f0f9ff', borderRadius: '8px', display: 'inline-block' }}>
        Predictive AI + Explainable AI + Clinical Terminology + Generative AI + Microservices + Multi-Portal Healthcare
      </p>
      <p style={{ fontSize: '1em', color: '#64748b', fontStyle: 'italic', marginTop: '10px' }}>The project report identifies this unified combination as its primary novelty.</p>
    </CleanSection>
  </motion.div>
);

// Slide 12: Impact, Future Scope & Conclusion
const Slide12 = () => (
  <motion.div className="slide-wrapper" {...slideIn} style={{ paddingLeft: '40px', overflowY: 'auto', paddingRight: '20px' }}>
    <h2>Impact & Future Roadmap</h2>
    
    <CleanSection>
      <h4 style={{ color: '#10b981', fontSize: '1.3em' }}>Expected / Demonstrated Impact</h4>
      <ul style={{ paddingLeft: '0', listStyle: 'none', fontSize: '1.1em', color: '#334155', lineHeight: 1.8 }}>
        <li style={{ marginBottom: '10px' }}><HighlightText>⚡ Reduced Diagnostic Latency:</HighlightText> AI-based screening can identify potential risk much earlier than purely symptom-driven workflows.</li>
        <li style={{ marginBottom: '10px' }}><HighlightText>👨‍⚕️ Reduced Doctor Workload:</HighlightText> Automation reduces repetitive data interpretation and prescription-related paperwork.</li>
        <li style={{ marginBottom: '10px' }}><HighlightText>🔍 Explainable Clinical AI:</HighlightText> Doctors retain decision authority while receiving AI-assisted evidence.</li>
        <li style={{ marginBottom: '10px' }}><HighlightText>🌐 Interoperable Healthcare:</HighlightText> SNOMED CT creates a foundation for standardized clinical data.</li>
        <li style={{ marginBottom: '10px' }}><HighlightText>🧑‍🤝‍🧑 Patient-Centric Communication:</HighlightText> Generative AI converts complex medical information into understandable language.</li>
      </ul>
    </CleanSection>

    <CleanSection style={{ marginTop: '30px' }}>
      <h4 style={{ color: '#0284c7', fontSize: '1.3em' }}>Future Scope</h4>
      <ul style={{ paddingLeft: '0', listStyle: 'none', fontSize: '1.1em', color: '#334155', lineHeight: 1.8 }}>
        <li><HighlightText>Phase 1:</HighlightText> Obstructive Sleep Apnea (ECG → RR/HRV → Random Forest)</li>
        <li><HighlightText>Phase 2:</HighlightText> Cardiovascular Disease (Extend architecture to cardiovascular risk prediction)</li>
        <li><HighlightText>Phase 3:</HighlightText> Multi-Modal Health Intelligence (Integrate ECG, BP, SpO₂, HR, Labs, Wearables)</li>
        <li><HighlightText>Phase 4:</HighlightText> Continuous Monitoring (Wearables → Continuous streams → AI engine → Real-time alerts)</li>
        <li><HighlightText>Phase 5:</HighlightText> Scalable Clinical Ecosystem (Multiple hospitals → Shared standards → Federated/secure AI)</li>
      </ul>
    </CleanSection>

    <CleanSection style={{ marginTop: '40px', marginBottom: '80px' }}>
      <h3 style={{ margin: 0, color: '#0369a1', fontSize: '1.6em', fontWeight: 600 }}>
        Final Statement
      </h3>
      <p style={{ fontSize: '1.3em', color: '#0f172a', fontWeight: 500, fontStyle: 'italic', marginTop: '10px' }}>
        "HealthGuard AI transforms healthcare from a reactive system into a proactive intelligence ecosystem."
      </p>
    </CleanSection>
  </motion.div>
);

const slides = [
  Slide1, Slide2, Slide3, Slide4, Slide5, Slide6, 
  Slide7, Slide8, Slide9, Slide10, Slide11, Slide12
];

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const CurrentSlideComponent = slides[currentSlide];

  return (
    <div className="app-container">
      {/* Top Navbar */}
      <div className="top-nav">
        <div className="nav-logo">
          <ShieldCheck size={24} />
          <span>HealthGuard</span> AI
        </div>
        <div className="nav-links">
          <span className={currentSlide < 4 ? 'active' : ''} onClick={() => setCurrentSlide(0)}>Problem & Concept</span>
          <span className={currentSlide >= 4 && currentSlide < 8 ? 'active' : ''} onClick={() => setCurrentSlide(4)}>Architecture & AI</span>
          <span className={currentSlide >= 8 && currentSlide < 11 ? 'active' : ''} onClick={() => setCurrentSlide(8)}>Tech & Terminology</span>
          <span className={currentSlide >= 11 ? 'active' : ''} onClick={() => setCurrentSlide(11)}>Impact</span>
        </div>
      </div>

      {/* Main Slide Content Area */}
      <div className="slide-container">
        <AnimatePresence mode="wait">
          <CurrentSlideComponent key={currentSlide} />
        </AnimatePresence>
      </div>

      {/* Slide Counter & Controls */}
      <div style={{ position: 'absolute', bottom: '45px', left: '5%', color: '#94a3b8', fontSize: '1.2em', fontFamily: 'JetBrains Mono', fontWeight: 600 }}>
        {String(currentSlide + 1).padStart(2, '0')} <span style={{ opacity: 0.5 }}>/ {slides.length}</span>
      </div>
      <div className="controls">
        <button onClick={prevSlide} disabled={currentSlide === 0}>
          <ChevronLeft size={24} />
        </button>
        <button onClick={nextSlide} disabled={currentSlide === slides.length - 1}>
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}

export default App;
