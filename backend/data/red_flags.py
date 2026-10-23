"""Red-flag symptom keywords that trigger HIGH RISK and halt the remedy flow."""

RED_FLAG_KEYWORDS = [
    # Cardiovascular emergencies
    "chest pain",
    "heart attack",
    "cardiac arrest",
    "irregular heartbeat",
    "heart palpitations",
    "heart failure",
    "myocardial infarction",

    # Respiratory emergencies
    "difficulty breathing",
    "shortness of breath",
    "blood in cough",
    "coughing blood",
    "choking",
    "unable to breathe",
    "can't breathe",
    "respiratory failure",
    "pulmonary embolism",

    # Neurological emergencies
    "severe headache",
    "sudden numbness",
    "loss of consciousness",
    "fainting",
    "seizure",
    "stroke",
    "brain hemorrhage",
    "blurred vision",
    "slurred speech",
    "paralysis",
    "sudden confusion",
    "brain tumor",
    "meningitis",
    "encephalitis",

    # Cancer / tumors / serious diseases
    "cancer",
    "tumor",
    "tumour",
    "malignant",
    "leukemia",
    "leukaemia",
    "lymphoma",
    "melanoma",
    "carcinoma",
    "metastasis",
    "chemotherapy",
    "oncology",

    # Severe infections
    "sepsis",
    "meningitis",
    "tuberculosis",
    "hiv",
    "aids",
    "hepatitis",
    "malaria",
    "dengue",
    "rabies",
    "ebola",
    "gangrene",
    "necrotizing",

    # Organ failure / serious conditions
    "kidney failure",
    "renal failure",
    "liver failure",
    "organ failure",
    "cirrhosis",
    "pancreatitis",
    "appendicitis",
    "peritonitis",

    # Bleeding / trauma
    "uncontrolled bleeding",
    "internal bleeding",
    "severe bleeding",
    "hemorrhage",
    "blood in stool",
    "blood in urine",
    "severe burn",

    # Mental health emergencies
    "suicidal",
    "suicide",
    "self harm",
    "self-harm",
    "want to die",
    "end my life",

    # Allergic emergencies
    "swelling of face",
    "allergic reaction",
    "anaphylaxis",
    "anaphylactic",
    "throat swelling",
    "tongue swelling",

    # Other critical conditions
    "severe abdominal pain",
    "high fever",
    "poisoning",
    "overdose",
    "blood clot",
    "deep vein thrombosis",
    "dvt",
    "amputation",
    "fracture",
    "broken bone",
    "concussion",
    "head injury",
    "spinal injury",
    "unconscious",
    "coma",
    "diabetes",
    "diabetic",
    "thyroid",
    "epilepsy",
    "asthma attack",
    "pneumonia",
    "covid",
    "corona",

    # Pregnancy complications
    "ectopic pregnancy",
    "miscarriage",
    "preeclampsia",
    "eclampsia",
]


def check_red_flags(symptoms_text: str) -> list[str]:
    """Check symptoms text against red-flag keywords. Returns list of matched flags."""
    lower = symptoms_text.lower()
    return [flag for flag in RED_FLAG_KEYWORDS if flag in lower]

