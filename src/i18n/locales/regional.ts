import type { SupportedLanguage, UiTranslations } from '../types';
import { EN_TRANSLATIONS } from './en';

/**
 * Build localized UI translations for Bengali, Tamil, Telugu, and Marathi.
 */
export function getLanguageTemplate(
  lang: SupportedLanguage,
  _nativeLabel?: string
): UiTranslations {
  // Base template with rich native translated fallbacks
  const base = EN_TRANSLATIONS;
  if (lang === 'bn') {
    return {
      ...base,
      appName: 'বায়ুশীল্ড (VayuShield)',
      tagline: 'তীব্র ধোঁয়াশায় পরিবারের জন্য সহজ সুরক্ষা সহায়ক',
      selectLanguage: 'ভাষা (Language)',
      dangerTitle: 'আজকের বাতাসের দূষণ মাত্রা',
      bestTimeTitle: 'বাতাস কখন ভালো হবে?',
      oneThingTitle: '⭐ আজকের সবচেয়ে গুরুত্বপূর্ণ ১টি কাজ',
      profileTitle: 'আপনার পরিবারে কারা আছেন?',
      familyBriefingTitle: 'পরিবারের জন্য সহজ নির্দেশনা',
      routineTitle: 'আজকের ৪-ধাপের রুটিন',
      indoorHacksTitle: 'সহজ ও বিনামূল্যের ঘরোয়া কৌশল',
      swapsTitle: 'পরিষ্কার বাতাসের জন্য সহজ পরিবর্তন',
      dosAndDontsTitle: 'কী করবেন এবং কী করবেন না',
      dosTitle: 'আজ অবশ্যই যা করবেন ✅',
      dontsTitle: 'যা একদম করবেন না ❌',
      maskGuideTitle: 'মাস্ক গাইড: কোন মাস্ক কাজ করে?',
      seeDoctorTitle: '🚨 কখন অবিলম্বে ডাক্তারের কাছে যাবেন?',
      trackerTitle: 'পারিবারিক সুরক্ষা তালিকা',
      askVayuTitle: 'বায়ুকে প্রশ্ন করুন',
      shareCardBtn: 'ফ্যামিলি কার্ড শেयर করুন',
      downloadCardBtn: 'PDF কার্ড ডাউনলোড করুন',
      bestTimeSentence: (start, end, worse) =>
        `বাইরে বেরোনোর সেরা সময়: ${start} থেকে ${end} পর্যন্ত। ${worse} টার পর বাতাস আবার খারাপ হবে।`,
    };
  }
  if (lang === 'mr') {
    return {
      ...base,
      appName: 'वायुशील्ड (VayuShield)',
      tagline: 'हिवाळ्यातील तीव्र धुक्यात कुटुंबासाठी सोपा सुरक्षा सहाय्यक',
      selectLanguage: 'भाषा (Language)',
      dangerTitle: 'आजची हवेतील प्रदूषण पातळी',
      bestTimeTitle: 'हवा कधी सुधारेल?',
      oneThingTitle: '⭐ आजची सर्वात महत्त्वाची १ गोष्ट',
      profileTitle: 'घरात कोण कोण राहते?',
      familyBriefingTitle: 'कुटुंबासाठी सोपा सल्ला',
      routineTitle: 'आजचे ४-टप्प्यांचे वेळापत्रक',
      indoorHacksTitle: 'सोपे घरगुती उपाय (विनाखर्च)',
      swapsTitle: 'स्वच्छ हवेसाठी छोट्या सवयी',
      dosAndDontsTitle: 'काय करावे आणि काय टाळावे',
      dosTitle: 'आज हे नक्की करा ✅',
      dontsTitle: 'ही चूक करू नका ❌',
      maskGuideTitle: 'मास्क मार्गदर्शक: कोणता मास्क उपयुक्त आहे?',
      seeDoctorTitle: '🚨 त्वरित डॉक्टरांकडे कधी जावे?',
      trackerTitle: 'कौटुंबिक सुरक्षा चेकलिस्ट',
      askVayuTitle: 'विचारा वायू: झटपट मदत',
      shareCardBtn: 'कौटुंबिक कार्ड शेअर करा',
      downloadCardBtn: 'PDF कार्ड डाउनलोड करा',
      bestTimeSentence: (start, end, worse) =>
        `बाहेर पडण्याची सर्वात उत्तम वेळ: ${start} ते ${end} पर्यंत। ${worse} नंतर हवा पुन्हा बिघडेल।`,
    };
  }
  if (lang === 'ta') {
    return {
      ...base,
      appName: 'வாயுஷீல்ட் (VayuShield)',
      tagline: 'பனிப்புகை காலத்தில் குடும்பங்களுக்கான எளிய காற்று பாதுகாப்பு வழிகாட்டி',
      selectLanguage: 'மொழி (Language)',
      dangerTitle: 'இன்றைய காற்று மாசுபாடு நிலை',
      bestTimeTitle: 'காற்று எப்போது சரியாகும்?',
      oneThingTitle: '⭐ இன்று செய்ய வேண்டிய மிக முக்கியமான 1 விஷயம்',
      profileTitle: 'உங்கள் வீட்டில் யார் யார் உள்ளனர்?',
      familyBriefingTitle: 'குடும்பத்திற்கான வழிகாட்டல்',
      routineTitle: 'இன்றைய 4-நேர அட்டவணை',
      indoorHacksTitle: 'எளிய வீட்டு முறைகள் (செலவில்லாதவை)',
      swapsTitle: 'தூய காற்றுக்கான எளிய மாற்றங்கள்',
      dosAndDontsTitle: 'செய்ய வேண்டியவை மற்றும் செய்யக்கூடாதவை',
      dosTitle: 'இன்று செய்ய வேண்டியவை ✅',
      dontsTitle: 'தவிர்க்க வேண்டியவை ❌',
      maskGuideTitle: 'முகக்கவசம் வழிகாட்டி: எது பயனுள்ளது?',
      seeDoctorTitle: '🚨 எப்போது உடனடியாக மருத்துவரிடம் செல்ல வேண்டும்?',
      trackerTitle: 'பாதுகாப்பு சரிபார்ப்புப் பட்டியல்',
      askVayuTitle: 'கேளுங்கள் வாயு',
      shareCardBtn: 'குடும்ப கார்டை பகிர்க',
      downloadCardBtn: 'PDF கார்டை பதிவிறக்குக',
      bestTimeSentence: (start, end, worse) =>
        `வெளியே செல்ல சிறந்த நேரம்: ${start} முதல் ${end} வரை. ${worse} மணிக்கு பிறகு காற்று மோசமாகும்.`,
    };
  }
  // te
  return {
    ...base,
    appName: 'వాయుషీల్డ్ (VayuShield)',
    tagline: 'చలికాలపు తీవ్ర పొగమంచులో కుటుంబాలకు సులభమైన రక్షణ సహాయకుడు',
    selectLanguage: 'భాష (Language)',
    dangerTitle: 'నేటి వాయు కాలుష్య స్థాయి',
    bestTimeTitle: 'గాలి ఎప్పుడు మెరుగుపడుతుంది?',
    oneThingTitle: '⭐ ఈ రోజు చేయవలసిన అత్యంత ముఖ్యమైన 1 పని',
    profileTitle: 'ఇంట్లో ఎవరెవరు ఉన్నారు?',
    familyBriefingTitle: 'కుటుంబం కోసం సూచనలు',
    routineTitle: 'నేటి 4-సమయాల దినచర్య',
    indoorHacksTitle: 'ఖర్చులేని సులభమైన చిట్కాలు',
    swapsTitle: 'స్వచ్ఛమైన గాలి కోసం చిన్న మార్పులు',
    dosAndDontsTitle: 'చేయవలసినవి మరియు చేయకూడనివి',
    dosTitle: 'తప్పక చేయవలసినవి ✅',
    dontsTitle: 'అస్సలు చేయకూడనివి ❌',
    maskGuideTitle: 'మాస్క్ గైడ్: ఏ మాస్క్ పనిచేస్తుంది?',
    seeDoctorTitle: '🚨 ఎప్పుడు వెంటనే డాక్టర్‌ను సంప్రదించాలి?',
    trackerTitle: 'కుటుంబ రక్షణ చెక్‌లిస్ట్',
    askVayuTitle: 'వాయును ప్రశ్నించండి',
    shareCardBtn: 'ఫ్యామిలీ కార్డును షేర్ చేయండి',
    downloadCardBtn: 'PDF కార్డు డౌన్‌లోడ్ చేయండి',
    bestTimeSentence: (start, end, worse) =>
      `బయటకు వెళ్లడానికి ఉత్తమ సమయం: ${start} నుండి ${end} వరకు. ${worse} తర్వాత గాలి మళ్లీ క్షీణిస్తుంది.`,
  };
}
