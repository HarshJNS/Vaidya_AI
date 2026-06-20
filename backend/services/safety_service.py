EMERGENCY_PATTERNS = {
    "chest_pain": [
        "chest pain",
        "chest tightness",
        "seene mein dard",
        "heart attack",
        "dil ka douraa",
        "left arm pain with chest",
        "jaw pain with chest",
    ],
    "stroke": [
        "face drooping",
        "arm weakness suddenly",
        "speech difficulty sudden",
        "sudden severe headache",
        "balance loss suddenly",
        "brain stroke",
        "paralysis",
        "laqwa",
    ],
    "breathing": [
        "can't breathe",
        "breathlessness severe",
        "saans nahi aa rahi",
        "choking",
        "blue lips",
        "oxygen level very low",
    ],
    "overdose": [
        "took too many tablets",
        "overdose",
        "zyada dawa kha li",
        "accidental poisoning",
        "zeher",
    ],
    "high_fever": [
        "fever above 104",
        "bukhar 104 se upar",
        "seizure with fever",
        "febrile seizure",
        "fits with fever",
    ],
    "severe_bleeding": [
        "heavy bleeding won't stop",
        "khoon band nahi ho raha",
        "coughing blood",
        "khoon aa raha hai khansi mein",
        "blood in stool lots",
        "black tarry stool",
    ],
    "bp_crisis": [
        "bp 180",
        "bp 190",
        "bp 200",
        "bp 210",
        "bp above 180",
        "blood pressure very very high",
        "bp bahut zyada",
    ],
    "unconscious": [
        "unconscious",
        "fainted",
        "not responding",
        "behosh",
        "passed out",
        "collapsed",
    ],
}

HARD_BLOCK_PATTERNS = [
    "stop taking bp medicine",
    "band karo bp ki dawa",
    "stop diabetes medicine",
    "insulin band karo",
    "stop blood thinner",
    "quit prescribed medicine",
    "guaranteed cure",
    "pakka ilaj",
    "exact dose of",
    "how much medicine to take exactly",
]

EMERGENCY_RESPONSE_EN = """WARNING: This sounds like a medical emergency.

Please do one of these RIGHT NOW:
- Call 112 (Emergency) immediately
- Go to the nearest hospital emergency room
- Call your doctor directly

Do not wait. Do not try home remedies first.

This app cannot help with emergencies - please seek immediate medical care."""

EMERGENCY_RESPONSE_HI = """WARNING: यह एक मेडिकल इमरजेंसी हो सकती है।

अभी तुरंत इनमें से एक करें:
- 112 (इमरजेंसी) पर कॉल करें
- नज़दीकी अस्पताल के इमरजेंसी रूम जाएं
- अपने डॉक्टर को सीधे फ़ोन करें

देरी न करें। पहले घरेलू उपाय न आज़माएं।

यह ऐप इमरजेंसी में मदद नहीं कर सकता - कृपया तुरंत डॉक्टर के पास जाएं।"""


def check_safety(message: str, language: str = "en") -> dict:
    msg_lower = message.lower()

    for pattern in HARD_BLOCK_PATTERNS:
        if pattern in msg_lower:
            return {
                "is_emergency": False,
                "is_hard_block": True,
                "category": "prescription_request",
                "trigger": pattern,
                "response": (
                    "I'm not able to advise on stopping or changing prescribed medicines. "
                    "Please consult your doctor before making any changes to your medication."
                    if language == "en"
                    else "मैं दवाइयाँ बंद करने या बदलने की सलाह नहीं दे सकता। "
                    "कोई भी दवाई बदलने से पहले अपने डॉक्टर से मिलें।"
                ),
            }

    for category, patterns in EMERGENCY_PATTERNS.items():
        for pattern in patterns:
            if pattern in msg_lower:
                return {
                    "is_emergency": True,
                    "is_hard_block": False,
                    "category": category,
                    "trigger": pattern,
                    "response": EMERGENCY_RESPONSE_HI if language == "hi" else EMERGENCY_RESPONSE_EN,
                }

    return {
        "is_emergency": False,
        "is_hard_block": False,
        "category": None,
        "trigger": None,
        "response": None,
    }

