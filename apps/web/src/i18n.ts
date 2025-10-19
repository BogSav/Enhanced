// ---------------------------------------------------------------------------
// i18n Runtime Initialization (i18next + react-i18next)
// ---------------------------------------------------------------------------
// Purpose:
//   Centralizes localization / translation setup.
//   Exposes the pre-configured i18n instance used by React components through
//   hooks (e.g. useTranslation) or the <Trans/> component.
//
// Plugins used:
//   1. Backend (i18next-http-backend) – Dynamically fetch translation JSON files.
//   2. LanguageDetector – Heuristics (navigator.language, localStorage) to choose language.
//   3. initReactI18next – Binds i18next to React context.
//
// Key options:
//   - fallbackLng: "en" -> used when the detected language has no resources.
//   - debug: true -> helpful console logs (disable in production).
//   - interpolation.escapeValue: false -> React already escapes output (prevents double escaping).
//   - backend.loadPath: where JSON resources are loaded from; adjust to
//     (e.g. /locales/{{lng}}/{{ns}}.json) if multiple namespaces are introduced.
//
// Note:
//   Currently we rely on a single implicit namespace ("translation") served by common.json.
//   If the project grows, split into namespaces (common, home, dashboard) and enable:
//     ns: ["common", "home"], defaultNS: "common".
// ---------------------------------------------------------------------------

import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

void i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en", // Fallback language when detected one is missing
    debug: import.meta.env.DEV, // Auto true in dev, false in production
    interpolation: {
      escapeValue: false, // React handles XSS escaping; avoid double escaping
    },
    backend: {
      loadPath: `${import.meta.env.BASE_URL}locales/{{lng}}/{{ns}}.json`, // Path to translation resources
      // Future alternative: "/locales/{{lng}}/{{ns}}.json" for multiple namespaces
    },
    // ns: ["common"], // Example explicit namespace definition
    // defaultNS: "common",
    // returnNull: false, // Can help avoid rendering literal "null" in UI
  });

export default i18n;
