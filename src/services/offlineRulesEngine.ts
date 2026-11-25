// VayuShield Offline Rules Engine for Ask Vayu Consultations

import type { AirQualityData, HouseholdProfile } from '../types';
import type { SupportedLanguage } from '../i18n';

/**
 * Generate a deterministic, safety-first offline response when no Gemini API key or proxy is available.
 */
export function generateOfflineChatAnswer(
  question: string,
  airData: AirQualityData,
  profile: HouseholdProfile,
  lang: SupportedLanguage
): string {
  const lower = question.toLowerCase();

  if (lang === 'hi') {
    if (lower.includes('दवा') || lower.includes('इन्हेलर') || lower.includes('doctor') || lower.includes('medicine')) {
      return 'नहीं, वायुशील्ड दवाओं या बीमारी की चिकित्सीय सलाह नहीं दे सकता। किसी भी परेशानी या दवा के लिए तुरंत योग्य डॉक्टर से संपर्क करें। आपात स्थिति में अपना इन्हेलर हमेशा पास रखें।';
    }
    if (lower.includes('पार्क') || lower.includes('खेल') || lower.includes('घूम') || lower.includes('walk') || lower.includes('park')) {
      if (airData.currentAqi > 200) {
        return `नहीं, आज AQI ${airData.currentAqi} पर बाहर खेलना या टहलना फेफड़ों के लिए बहुत खतरनाक है। बच्चों और बुजुर्गों को घर के सबसे सुरक्षित कमरे में ही रखें।`;
      }
      return 'रुकें, दोपहर 12 बजे से 2:30 बजे के बीच ही बाहर जाएं जब धूप से धुआं थोड़ा छंट जाता है। बाहर जाते समय N95 मास्क अवश्य लगाएं।';
    }
    return `रुकें, आज ${airData.cityName} में हवा बहुत खराब है (AQI ${airData.currentAqi})। खिड़कियां बंद रखें और बाहर निकलते समय N95 मास्क का इस्तेमाल करें।`;
  }

  if (lower.includes('medicine') || lower.includes('inhaler') || lower.includes('dose') || lower.includes('diagnos')) {
    return 'No, VayuShield cannot provide medication advice or clinical diagnoses. Please consult your family physician or pulmonologist for any symptom management or dosage questions. In severe smog, always keep emergency rescue inhalers readily accessible.';
  }

  if (lower.includes('park') || lower.includes('outdoor') || lower.includes('play') || lower.includes('walk') || lower.includes('run')) {
    if (airData.currentAqi > 200) {
      return `No, outdoor physical activity is unsafe today with an AQI of ${airData.currentAqi}. Stagnant fine particulate penetrates deep into alveolar tissue, especially in children and seniors. Keep all recreation strictly indoors in your best-filtered room.`;
    }
    return `Wait, schedule outdoor play strictly between ${airData.bestWindow.startTime} and ${airData.bestWindow.endTime} when solar heating lifts surface inversion. Keep outdoor sessions under 30 minutes and monitor children closely for irritation.`;
  }

  if (lower.includes('window') || lower.includes('ventilat') || lower.includes('air out') || lower.includes('cook')) {
    if (airData.currentAqi > 250) {
      return 'No, keep all exterior windows hermetically sealed as outdoor pollution far exceeds indoor safety thresholds. Turn on your kitchen range hood exhaust during cooking rather than opening balcony or exterior windows.';
    }
    return `Wait until the midday window (${airData.bestWindow.startTime} to ${airData.bestWindow.endTime}) before cracking cross-ventilating windows for 15-20 minutes. Immediately reseal windows and run your air filtration system to cycle the fresh air.`;
  }

  if (lower.includes('cloth mask') || lower.includes('surgical') || lower.includes('mask')) {
    if (airData.currentAqi > 100) {
      return 'No, cloth and standard surgical masks do not filter fine PM2.5 particles that cause winter smog damage. Wear a certified, tightly fitted N95 or FFP2 respirator with an unbroken nose-bridge seal for any outdoor departure.';
    }
    return 'Yes, a simple mask is adequate at low particulate levels, but keep an N95 on hand if smog thickens towards dusk.';
  }

  const hasSensitiveMembers = profile.tags.some((t) => t === 'toddler_kids' || t === 'asthma_respiratory' || t === 'elderly');
  const purifierNote = profile.setup.airPurifier
    ? ' Keep your HEPA purifier running continuously.'
    : ' Keep doors and draft gaps tightly sealed.';

  return `Wait, given the current AQI of ${airData.currentAqi} in ${airData.cityName}${hasSensitiveMembers ? ' and sensitive members in your home' : ''}, prioritize indoor containment.${purifierNote} Wear a certified N95 respirator whenever stepping outdoors.`;
}
