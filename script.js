
"use strict";

const $ = (id) => document.getElementById(id);

const form = $("searchForm");
const input = $("medicineInput");
const result = $("result");
const status = $("searchStatus");
const languageSelect = $("languageSelect");
const themeToggle = $("themeToggle");
const contactForm = $("contactForm");
const contactStatus = $("contactStatus");

let currentQuery = "";
let searchSequence = 0;

// Local educational examples only. These are not a complete medicine database.
const localMedicines = {
  paracetamol: {
    name: { en: "Paracetamol", hi: "पैरासिटामोल" },
    summary: {
      en: "Paracetamol is commonly used for pain relief and reducing fever.",
      hi: "पैरासिटामोल का उपयोग आमतौर पर दर्द से राहत और बुखार कम करने के लिए किया जाता है।"
    },
    precautions: {
      en: "Taking too much can cause serious liver damage. Check the product label and ask a pharmacist or doctor if unsure.",
      hi: "इसकी अधिक मात्रा से लिवर को गंभीर नुकसान हो सकता है। दवा का लेबल पढ़ें और संदेह होने पर डॉक्टर या फार्मासिस्ट से पूछें।"
    },
    source: "https://www.nhs.uk/medicines/paracetamol-for-adults/"
  },
  cetirizine: {
    name: { en: "Cetirizine", hi: "सेटिरिज़िन" },
    summary: {
      en: "Cetirizine is an antihistamine used for allergy symptoms. It may cause drowsiness in some people.",
      hi: "सेटिरिज़िन एलर्जी के लक्षणों के लिए इस्तेमाल की जाने वाली एंटीहिस्टामिन दवा है। कुछ लोगों को इससे नींद आ सकती है।"
    },
    precautions: {
      en: "Read the product label. Ask a healthcare professional about suitability, other medicines and activities requiring alertness.",
      hi: "दवा का लेबल पढ़ें। उपयुक्तता, दूसरी दवाओं और सतर्कता की जरूरत वाले कामों के बारे में स्वास्थ्य विशेषज्ञ से पूछें।"
    },
    source: "https://www.nhs.uk/medicines/cetirizine/"
  }
};

const text = {
  en: {
    navTag: "Medicine information, made simpler",
    heroPill: "Medicine learning assistant",
    heroTitle: "Understand medicines better.",
    heroIntro: "Search educational information and read the original source labels.",
    placeholder: "Enter a medicine name...",
    search: "Search",
    hint: "Local demo entries: Paracetamol, Cetirizine. Online results depend on source availability.",
    eyebrow: "LEARN & EXPLORE",
    databaseTitle: "Medicine information",
    sourceBadge: "Local + online",
    featureTitle1: "Educational information",
    featureText1: "Learn about medicine labels and general safety.",
    featureTitle2: "Precautions",
    featureText2: "Read warnings and ask a qualified professional when unsure.",
    featureTitle3: "Source links",
    featureText3: "Check original information from trusted public resources.",
    assistancePill: "Assistance request",
    assistanceTitle: "Doctor-assistance request",
    assistanceText: "Request help finding an appropriate healthcare professional for your questions.",
    benefit1: "A place to describe your general query",
    benefit2: "A request for follow-up by a real provider",
    benefit3: "No automated diagnosis or prescription",
    priceLabel: "Displayed assistance price",
    perRequest: "/ request",
    priceNote: "Demo price only. No payment is collected on this website.",
    requestAssistance: "Request assistance",
    contactEyebrow: "GET IN TOUCH",
    contactTitle: "Contact us",
    contactIntro: "Send a general question or ask about the assistance service.",
    nameLabel: "Your name",
    emailLabel: "Email address",
    subjectLabel: "Topic",
    messageLabel: "Message",
    optionGeneral: "General question",
    optionAssistance: "Doctor-assistance request",
    optionWebsite: "Website feedback",
    privacyNote: "Do not enter medical records, passwords, payment details or other sensitive personal information. This demo does not send or save your message to a server.",
    sendMessage: "Submit demo form",
    noticeTitle: "Important health notice",
    noticeText: "This website is for education only, not diagnosis or treatment. Online drug labels can be incomplete or differ by country and product. Do not start, stop or change medication based on this site. Ask a doctor or pharmacist for personal advice.",
    sourcesTitle: "Reference sources",
    footerText: "© 2026 MediGuide AI · Educational demo",
    dark: "🌙 Dark Mode",
    light: "☀️ Light Mode",
    searching: "Searching the medicine database…",
    localFound: "Found in the local educational database.",
    onlineSearching: "No local entry found. Checking the online label source…",
    onlineFound: "Online label result found. Read the original source carefully.",
    notFound: "No matching label was found. Check the spelling or try another name.",
    onlineError: "The online source could not be reached. Please try again later.",
    empty: "Please enter a medicine name.",
    about: "Educational overview",
    precautions: "Precautions",
    originalSource: "Open original source",
    onlineLabel: "Online drug label",
    labelUse: "Uses / indications listed on label",
    labelWarnings: "Warnings",
    sideEffects: "Adverse reactions",
    notListed: "This section was not available in the returned label.",
    localSource: "Reference information",
    contactDemo: "Demo only: your message has not been sent or saved. Connect a secure backend to receive messages.",
    assistancePrefill: "I would like information about the doctor-assistance service. Please explain the actual fee, provider details and booking process.",
    messageRequired: "Please complete all required fields.",
    themeUnavailable: "Your browser could not save the theme preference."
  },
  hi: {
    navTag: "दवाओं की जानकारी, आसान भाषा में",
    heroPill: "दवा सीखने में मदद",
    heroTitle: "दवाओं को बेहतर समझें।",
    heroIntro: "शैक्षिक जानकारी खोजें और मूल स्रोत का लेबल पढ़ें।",
    placeholder: "दवा का नाम लिखें...",
    search: "खोजें",
    hint: "लोकल डेमो: Paracetamol, Cetirizine। ऑनलाइन परिणाम स्रोत की उपलब्धता पर निर्भर हैं।",
    eyebrow: "जानें और समझें",
    databaseTitle: "दवा की जानकारी",
    sourceBadge: "लोकल + ऑनलाइन",
    featureTitle1: "शैक्षिक जानकारी",
    featureText1: "दवा के लेबल और सामान्य सुरक्षा के बारे में जानें।",
    featureTitle2: "सावधानियाँ",
    featureText2: "चेतावनियाँ पढ़ें और संदेह होने पर योग्य विशेषज्ञ से पूछें।",
    featureTitle3: "स्रोत लिंक",
    featureText3: "विश्वसनीय सार्वजनिक स्रोतों पर मूल जानकारी देखें।",
    assistancePill: "सहायता अनुरोध",
    assistanceTitle: "डॉक्टर-सहायता अनुरोध",
    assistanceText: "अपने सवालों के लिए उपयुक्त स्वास्थ्य विशेषज्ञ खोजने में सहायता का अनुरोध करें।",
    benefit1: "सामान्य सवाल बताने की सुविधा",
    benefit2: "वास्तविक सेवा प्रदाता से संपर्क का अनुरोध",
    benefit3: "कोई स्वचालित निदान या प्रिस्क्रिप्शन नहीं",
    priceLabel: "दिखाई गई सहायता कीमत",
    perRequest: "/ अनुरोध",
    priceNote: "यह केवल डेमो कीमत है। वेबसाइट पर कोई भुगतान नहीं लिया जाता।",
    requestAssistance: "सहायता का अनुरोध करें",
    contactEyebrow: "संपर्क करें",
    contactTitle: "हमसे संपर्क करें",
    contactIntro: "सामान्य सवाल भेजें या सहायता सेवा के बारे में पूछें।",
    nameLabel: "आपका नाम",
    emailLabel: "ईमेल पता",
    subjectLabel: "विषय",
    messageLabel: "संदेश",
    optionGeneral: "सामान्य सवाल",
    optionAssistance: "डॉक्टर-सहायता अनुरोध",
    optionWebsite: "वेबसाइट सुझाव",
    privacyNote: "मेडिकल रिकॉर्ड, पासवर्ड, भुगतान विवरण या अन्य संवेदनशील निजी जानकारी न लिखें। यह डेमो आपका संदेश सर्वर पर नहीं भेजता या सहेजता।",
    sendMessage: "डेमो फॉर्म जमा करें",
    noticeTitle: "महत्वपूर्ण स्वास्थ्य सूचना",
    noticeText: "यह वेबसाइट केवल शैक्षिक जानकारी के लिए है, निदान या इलाज के लिए नहीं। ऑनलाइन दवा लेबल अधूरे हो सकते हैं या देश और उत्पाद के अनुसार अलग हो सकते हैं। इस वेबसाइट के आधार पर दवा शुरू, बंद या उसकी मात्रा न बदलें। व्यक्तिगत सलाह के लिए डॉक्टर या फार्मासिस्ट से पूछें।",
    sourcesTitle: "संदर्भ स्रोत",
    footerText: "© 2026 MediGuide AI · शैक्षिक डेमो",
    dark: "🌙 डार्क मोड",
    light: "☀️ लाइट मोड",
    searching: "दवा डेटाबेस खोजा जा रहा है…",
    localFound: "लोकल शैक्षिक डेटाबेस में जानकारी मिली।",
    onlineSearching: "लोकल जानकारी नहीं मिली। ऑनलाइन लेबल स्रोत खोजा जा रहा है…",
    onlineFound: "ऑनलाइन लेबल मिला। मूल स्रोत को ध्यान से पढ़ें।",
    notFound: "कोई मिलती-जुलती जानकारी नहीं मिली। स्पेलिंग जाँचें या दूसरा नाम आज़माएँ।",
    onlineError: "ऑनलाइन स्रोत तक पहुँचा नहीं जा सका। बाद में दोबारा कोशिश करें।",
    empty: "कृपया दवा का नाम लिखें।",
    about: "शैक्षिक जानकारी",
    precautions: "सावधानियाँ",
    originalSource: "मूल स्रोत खोलें",
    onlineLabel: "ऑनलाइन दवा लेबल",
    labelUse: "लेबल पर दिए उपयोग",
    labelWarnings: "चेतावनियाँ",
    sideEffects: "दुष्प्रभाव",
    notListed: "प्राप्त लेबल में यह जानकारी उपलब्ध नहीं थी।",
    localSource: "संदर्भ जानकारी",
    contactDemo: "केवल डेमो: आपका संदेश न भेजा गया है और न सहेजा गया है। संदेश प्राप्त करने के लिए सुरक्षित बैकएंड जोड़ें।",
    assistancePrefill: "मैं डॉक्टर-सहायता सेवा के बारे में जानकारी चाहता/चाहती हूँ। कृपया वास्तविक शुल्क, सेवा प्रदाता और बुकिंग प्रक्रिया समझाएँ।",
    messageRequired: "कृपया सभी जरूरी फ़ील्ड भरें।",
    themeUnavailable: "ब्राउज़र थीम की पसंद सहेज नहीं पाया।"
  }
};

function lang() {
  return languageSelect && languageSelect.value === "hi" ? "hi" : "en";
}

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value;
}

function setThemeButton() {
  if (!themeToggle) return;
  themeToggle.textContent = document.body.classList.contains("dark")
    ? text[lang()].light
    : text[lang()].dark;
}

function updateLanguage() {
  const t = text[lang()];
  const ids = [
    "navTag", "heroPill", "heroTitle", "heroIntro", "searchButton",
    "searchHint", "databaseEyebrow", "databaseTitle", "sourceBadge",
    "featureTitle1", "featureText1", "featureTitle2", "featureText2",
    "featureTitle3", "featureText3", "assistancePill", "assistanceTitle",
    "assistanceText", "benefit1", "benefit2", "benefit3", "priceLabel",
    "perRequest", "priceNote", "requestAssistance", "contactEyebrow",
    "contactTitle", "contactIntro", "nameLabel", "emailLabel",
    "subjectLabel", "messageLabel", "optionGeneral", "optionAssistance",
    "optionWebsite", "privacyNote", "sendMessage", "noticeTitle",
    "noticeText", "sourcesTitle", "footerText"
  ];

  ids.forEach(id => setText(id, t[id]));

  if (input) input.placeholder = t.placeholder;
  if ($("contactName")) $("contactName").placeholder =
    lang() === "hi" ? "अपना नाम लिखें" : "Enter your name";
  if ($("contactEmail")) $("contactEmail").placeholder = "you@example.com";
  if ($("contactMessage")) $("contactMessage").placeholder =
    lang() === "hi" ? "अपना सामान्य सवाल यहाँ लिखें..." : "Write your general question here...";

  document.documentElement.lang = lang();
  setThemeButton();

  if (currentQuery && result && !result.classList.contains("hidden")) {
    // Local content can be translated. Online label text remains in its source language.
    const local = localMedicines[currentQuery.toLowerCase()];
    if (local) renderLocal(local);
  }

  if (status) status.textContent = "";
  if (contactStatus) contactStatus.textContent = "";
}

function addTextElement(parent, tag, content) {
  const element = document.createElement(tag);
  element.textContent = content;
  parent.appendChild(element);
  return element;
}

function clearResult() {
  result.replaceChildren();
  result.classList.remove("hidden");
}

function renderLocal(medicine) {
  const t = text[lang()];
  clearResult();

  addTextElement(result, "h2", medicine.name[lang()]);
  addTextElement(result, "p", medicine.summary[lang()]);

  const precautions = document.createElement("div");
  precautions.className = "result-section";
  addTextElement(precautions, "h3", t.precautions);
  addTextElement(precautions, "p", medicine.precautions[lang()]);
  result.appendChild(precautions);

  const source = document.createElement("div");
  source.className = "source-line";
  addTextElement(source, "strong", t.localSource);

  const link = document.createElement("a");
  link.href = medicine.source;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = t.originalSource;
  source.appendChild(link);
  result.appendChild(source);
}

function firstText(record, fields) {
  for (const field of fields) {
    const value = record && record[field];
    if (Array.isArray(value) && value.length) return value[0];
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function renderOnline(record, sourceUrl) {
  const t = text[lang()];
  clearResult();

  const openfda = record.openfda || {};
  const generic = (openfda.generic_name || [])[0] || "";
  const brand = (openfda.brand_name || [])[0] || "";
  const title = brand || generic || t.onlineLabel;

  addTextElement(result, "h2", title);
  addTextElement(result, "p", t.onlineLabel + " — " + t.onlineFound);

  const uses = firstText(record, ["indications_and_usage", "purpose"]);
  const warnings = firstText(record, [
    "warnings", "warnings_and_cautions", "do_not_use", "stop_use"
  ]);
  const reactions = firstText(record, ["adverse_reactions"]);

  const sections = [
    [t.labelUse, uses],
    [t.labelWarnings, warnings],
    [t.sideEffects, reactions]
  ];

  sections.forEach(([heading, content]) => {
    const section = document.createElement("div");
    section.className = "result-section";
    addTextElement(section, "h3", heading);
    addTextElement(section, "p", content || t.notListed);
    result.appendChild(section);
  });

  const source = document.createElement("div");
  source.className = "source-line";
  const link = document.createElement("a");
  link.href = sourceUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = t.originalSource;
  source.appendChild(link);
  result.appendChild(source);

  const note = document.createElement("p");
  note.className = "privacy-note";
  note.textContent = t.noticeText;
  result.appendChild(note);
}

async function searchOnline(query, sequence) {
  const t = text[lang()];
  status.textContent = t.onlineSearching;

  // Query generic and brand names. API data is not specific to Indian products.
  const searchExpression =
    'openfda.generic_name:"' + query.toUpperCase() +
    '" OR openfda.brand_name:"' + query.toUpperCase() + '"';

  const sourceUrl = "https://api.fda.gov/drug/label.json?" +
    new URLSearchParams({ search: searchExpression, limit: "1" }).toString();

  try {
    const response = await fetch(sourceUrl);

    if (!response.ok) throw new Error("No matching label");

    const data = await response.json();
    if (sequence !== searchSequence) return;

    const record = data.results && data.results[0];
    if (!record) {
      status.textContent = t.notFound;
      return;
    }

    renderOnline(record, sourceUrl);
    status.textContent = t.onlineFound;
  } catch (error) {
    if (sequence !== searchSequence) return;
    status.textContent = text[lang()].onlineError;
  }
}

if (form && input && result) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();
    currentQuery = query;
    const sequence = ++searchSequence;

    if (!query) {
      status.textContent = text[lang()].empty;
      result.classList.add("hidden");
      return;
    }

    status.textContent = text[lang()].searching;

    const localKey = query.toLowerCase();
    const local = localMedicines[localKey];

    if (local) {
      renderLocal(local);
      status.textContent = text[lang()].localFound;
      return;
    }

    clearResult();
    await searchOnline(query, sequence);
  });
}

if (languageSelect) {
  languageSelect.addEventListener("change", updateLanguage);
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const theme = document.body.classList.contains("dark") ? "dark" : "light";

    try {
      localStorage.setItem("mediguide-theme", theme);
    } catch (error) {
      status.textContent = text[lang()].themeUnavailable;
    }

    setThemeButton();
  });
}

const requestButton = $("requestAssistance");
if (requestButton) {
  requestButton.addEventListener("click", () => {
    const subject = $("contactSubject");
    const message = $("contactMessage");

    if (subject) subject.value = "assistance";
    if (message) message.value = text[lang()].assistancePrefill;

    $("contact").scrollIntoView({ behavior: "smooth" });
    if ($("contactName")) $("contactName").focus({ preventScroll: true });
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      contactStatus.textContent = text[lang()].messageRequired;
      return;
    }

    // Intentionally no fake success: this form has no server to receive submissions.
    contactStatus.textContent = text[lang()].contactDemo;
  });
}

try {
  if (localStorage.getItem("mediguide-theme") === "dark") {
    document.body.classList.add("dark");
  }
} catch (error) {
  // Site still works when browser storage is unavailable.
}

updateLanguage();
