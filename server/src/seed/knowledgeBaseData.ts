import { UrgencyLevel } from "../models/SymptomEntry.js";

export interface KnowledgeBaseSeedEntry {
  condition: string;
  description: string;
  sampleSymptoms: string[];
  urgencyLevel: UrgencyLevel;
  recommendedAction: string;
  specialty: string;
}

export const knowledgeBaseSeedData: KnowledgeBaseSeedEntry[] = [
  {
    condition: "Acute coronary syndrome",
    description:
      "Crushing central chest pain or pressure, often radiating to the left arm, jaw, or back, sometimes with sweating, nausea, or shortness of breath.",
    sampleSymptoms: ["chest pain", "chest pressure", "pain radiating to arm", "jaw pain", "sweating", "shortness of breath"],
    urgencyLevel: "emergency",
    recommendedAction: "Call emergency services immediately. Do not drive yourself. Chew aspirin if not allergic and advised.",
    specialty: "Cardiology",
  },
  {
    condition: "Stroke / transient ischemic attack",
    description:
      "Sudden facial droop, arm weakness, slurred or difficult speech, confusion, or sudden severe headache with vision changes.",
    sampleSymptoms: ["facial drooping", "arm weakness", "slurred speech", "sudden confusion", "vision loss", "severe headache"],
    urgencyLevel: "emergency",
    recommendedAction: "Call emergency services immediately. Note the time symptoms started.",
    specialty: "Neurology",
  },
  {
    condition: "Anaphylaxis",
    description:
      "Rapid-onset allergic reaction with swelling of lips or throat, difficulty breathing, hives, and dizziness after exposure to an allergen.",
    sampleSymptoms: ["throat swelling", "difficulty breathing", "hives", "dizziness after allergen exposure", "lip swelling"],
    urgencyLevel: "emergency",
    recommendedAction: "Use an epinephrine auto-injector if available and call emergency services immediately.",
    specialty: "Allergy & Immunology",
  },
  {
    condition: "Severe asthma exacerbation",
    description:
      "Marked shortness of breath, wheezing not relieved by rescue inhaler, difficulty speaking in full sentences, bluish lips.",
    sampleSymptoms: ["severe wheezing", "can't speak full sentences", "bluish lips", "inhaler not working", "gasping for air"],
    urgencyLevel: "emergency",
    recommendedAction: "Call emergency services immediately and continue rescue inhaler use while waiting.",
    specialty: "Pulmonology",
  },
  {
    condition: "Severe traumatic bleeding",
    description: "Heavy, uncontrolled bleeding from a wound, deep laceration, or injury that soaks through dressings.",
    sampleSymptoms: ["uncontrolled bleeding", "deep wound", "soaking through bandage", "pale and dizzy after injury"],
    urgencyLevel: "emergency",
    recommendedAction: "Apply firm direct pressure and call emergency services immediately.",
    specialty: "Emergency Medicine",
  },
  {
    condition: "Suspected appendicitis",
    description:
      "Pain starting near the navel and moving to the lower right abdomen, worsening with movement, nausea, low-grade fever.",
    sampleSymptoms: ["lower right abdominal pain", "pain worse with movement", "nausea", "low grade fever", "loss of appetite"],
    urgencyLevel: "emergency",
    recommendedAction: "Seek emergency evaluation; do not eat or drink in case surgery is needed.",
    specialty: "General Surgery",
  },
  {
    condition: "High fever with rash in a child",
    description:
      "Fever above 39C combined with a new rash, lethargy, or neck stiffness in a child.",
    sampleSymptoms: ["high fever", "new rash", "lethargic child", "neck stiffness", "irritable infant"],
    urgencyLevel: "urgent",
    recommendedAction: "Arrange same-day evaluation; go to urgent care or emergency department if lethargy or stiff neck present.",
    specialty: "Pediatrics",
  },
  {
    condition: "Moderate dehydration",
    description:
      "Reduced urination, dry mouth, dizziness when standing, and fatigue after vomiting or diarrhea lasting more than a day.",
    sampleSymptoms: ["reduced urination", "dry mouth", "dizzy when standing", "persistent vomiting", "diarrhea for over a day"],
    urgencyLevel: "urgent",
    recommendedAction: "Begin oral rehydration and arrange same-day telehealth or in-person review.",
    specialty: "General Medicine",
  },
  {
    condition: "Urinary tract infection with fever",
    description: "Burning urination, urinary frequency, lower back or flank pain, and fever suggesting kidney involvement.",
    sampleSymptoms: ["burning urination", "urinary frequency", "flank pain", "fever with UTI symptoms", "cloudy urine"],
    urgencyLevel: "urgent",
    recommendedAction: "Same-day consultation recommended; antibiotics are often needed promptly.",
    specialty: "Urology",
  },
  {
    condition: "Deep laceration needing closure",
    description: "A cut deeper than a few millimeters, gaping edges, or still bleeding after 10 minutes of pressure.",
    sampleSymptoms: ["deep cut", "wound edges gaping", "bleeding after pressure", "visible fat or muscle in wound"],
    urgencyLevel: "urgent",
    recommendedAction: "Keep the wound covered and clean; seek same-day care for possible stitches.",
    specialty: "Emergency Medicine",
  },
  {
    condition: "Moderate asthma flare",
    description: "Increased wheeze and chest tightness with some relief from rescue inhaler, mild difficulty with exertion.",
    sampleSymptoms: ["wheezing", "chest tightness", "shortness of breath on exertion", "frequent inhaler use"],
    urgencyLevel: "urgent",
    recommendedAction: "Same-day review recommended to adjust asthma plan and rule out worsening.",
    specialty: "Pulmonology",
  },
  {
    condition: "Migraine with aura",
    description: "Throbbing one-sided headache with visual disturbances, light sensitivity, nausea, lasting hours.",
    sampleSymptoms: ["one sided headache", "visual aura", "light sensitivity", "nausea with headache", "throbbing pain"],
    urgencyLevel: "urgent",
    recommendedAction: "Same-day or next-available telehealth review if this is a new or unusually severe pattern.",
    specialty: "Neurology",
  },
  {
    condition: "Moderate back strain",
    description: "Lower back pain after lifting or twisting, worse with movement, no numbness or weakness in legs.",
    sampleSymptoms: ["lower back pain", "pain after lifting", "muscle spasm", "pain with movement"],
    urgencyLevel: "urgent",
    recommendedAction: "Telehealth review recommended within 24 hours; seek urgent care if numbness or weakness develops.",
    specialty: "Orthopedics",
  },
  {
    condition: "Common cold",
    description: "Runny nose, mild sore throat, sneezing, mild cough, and low energy without high fever.",
    sampleSymptoms: ["runny nose", "sneezing", "mild sore throat", "mild cough", "nasal congestion"],
    urgencyLevel: "routine",
    recommendedAction: "Routine telehealth appointment or self-care; rest and fluids usually sufficient.",
    specialty: "General Medicine",
  },
  {
    condition: "Seasonal allergic rhinitis",
    description: "Itchy eyes, sneezing, nasal congestion that recurs seasonally, no fever.",
    sampleSymptoms: ["itchy eyes", "sneezing", "nasal congestion", "seasonal symptoms", "watery eyes"],
    urgencyLevel: "routine",
    recommendedAction: "Routine appointment to review antihistamine options.",
    specialty: "Allergy & Immunology",
  },
  {
    condition: "Mild ankle sprain",
    description: "Swelling and pain after a twisting injury, able to bear some weight, no obvious deformity.",
    sampleSymptoms: ["ankle swelling", "pain after twisting ankle", "mild bruising", "can bear some weight"],
    urgencyLevel: "routine",
    recommendedAction: "Rest, ice, compression, elevation; routine follow-up if not improving in a few days.",
    specialty: "Orthopedics",
  },
  {
    condition: "Mild contact dermatitis",
    description: "Localized itchy red rash after contact with a new soap, plant, or fabric, no spreading or fever.",
    sampleSymptoms: ["localized itchy rash", "red skin", "rash after new product", "mild skin irritation"],
    urgencyLevel: "routine",
    recommendedAction: "Routine telehealth review for topical treatment options.",
    specialty: "Dermatology",
  },
  {
    condition: "Medication refill request",
    description: "Stable chronic condition requesting a routine renewal of an existing, well-tolerated prescription.",
    sampleSymptoms: ["needs prescription refill", "stable chronic condition", "no new symptoms", "routine renewal"],
    urgencyLevel: "routine",
    recommendedAction: "Routine telehealth visit to review and renew prescription.",
    specialty: "General Medicine",
  },
  {
    condition: "Mild tension headache",
    description: "Dull, band-like pressure around the head, often related to stress or screen time, no neurological symptoms.",
    sampleSymptoms: ["dull headache", "band like pressure", "stress related headache", "neck tension"],
    urgencyLevel: "routine",
    recommendedAction: "Routine review; self-care and stress management usually sufficient.",
    specialty: "General Medicine",
  },
  {
    condition: "Mild acid reflux",
    description: "Occasional burning sensation in the chest after meals, worse when lying down, no severe or crushing pain.",
    sampleSymptoms: ["heartburn", "acid reflux", "burning after meals", "worse lying down"],
    urgencyLevel: "routine",
    recommendedAction: "Routine telehealth review for dietary advice and antacid options.",
    specialty: "Gastroenterology",
  },
  {
    condition: "Mild anxiety symptoms",
    description: "Persistent worry, restlessness, difficulty sleeping, without chest pain or breathing difficulty at rest.",
    sampleSymptoms: ["persistent worry", "restlessness", "trouble sleeping", "racing thoughts"],
    urgencyLevel: "routine",
    recommendedAction: "Routine telehealth consultation recommended to discuss support options.",
    specialty: "Mental Health",
  },
  {
    condition: "Routine follow-up for chronic disease",
    description: "Scheduled check-in for a stable chronic condition such as diabetes or hypertension, no new complaints.",
    sampleSymptoms: ["routine diabetes check", "routine blood pressure check", "stable chronic illness", "no new symptoms"],
    urgencyLevel: "routine",
    recommendedAction: "Routine telehealth follow-up appointment.",
    specialty: "General Medicine",
  },
  {
    condition: "Mild viral gastroenteritis",
    description: "A day of mild nausea and a few loose stools, still drinking fluids normally, no blood, no high fever.",
    sampleSymptoms: ["mild nausea", "few loose stools", "no blood in stool", "tolerating fluids"],
    urgencyLevel: "routine",
    recommendedAction: "Routine review; recommend bland diet and hydration, monitor for worsening.",
    specialty: "Gastroenterology",
  },
  {
    condition: "Conjunctivitis without vision change",
    description: "Red, mildly itchy or gritty eye with some discharge, no pain or vision changes.",
    sampleSymptoms: ["red eye", "eye discharge", "gritty feeling", "mild eye itching"],
    urgencyLevel: "routine",
    recommendedAction: "Routine telehealth review for eye drop recommendation.",
    specialty: "Ophthalmology",
  },
];
