import i18next from 'i18next';
import * as Translations from '../constants/i18n';
import { LANGUAGES } from '../constants/appConstants';

i18next
  .init({
    interpolation: {
      // React already does escaping
      escapeValue: false,
    },
    lng: LANGUAGES.English, // 'en' | 'es'
    // Using simple hardcoded resources for simple example
    resources: Translations
  })

export default i18next
