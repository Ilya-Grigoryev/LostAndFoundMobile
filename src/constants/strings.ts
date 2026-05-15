export const strings = {
  en: {
    'onboarding.language.title': 'Choose your language',
    'onboarding.language.subtitle': 'You can use Vienna Lost & Found in English or German.',
    'onboarding.language.english': 'English',
    'onboarding.language.german': 'Deutsch',
    'onboarding.language.error': 'Could not save the language. Please try again.',
    'onboarding.guest.title': 'Your guest pass',
    'onboarding.guest.subtitle': 'A name and email are enough to test the Vienna lost-and-found flow.',
    'onboarding.guest.nameLabel': 'Name',
    'onboarding.guest.namePlaceholder': 'Your name',
    'onboarding.guest.emailLabel': 'Email',
    'onboarding.guest.emailPlaceholder': 'you@example.com',
    'onboarding.guest.button': 'Start as guest',
    'onboarding.guest.nameError': 'Please enter your name.',
    'onboarding.guest.emailError': 'Please enter a valid email address.',
    'onboarding.guest.saveError': 'Could not finish onboarding. Please try again.',
  },
  de: {
    'onboarding.language.title': 'Sprache wählen',
    'onboarding.language.subtitle': 'Sie können Vienna Lost & Found auf Deutsch oder Englisch nutzen.',
    'onboarding.language.english': 'English',
    'onboarding.language.german': 'Deutsch',
    'onboarding.language.error': 'Die Sprache konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
    'onboarding.guest.title': 'Ihr Gäste-Pass',
    'onboarding.guest.subtitle': 'Name und E-Mail reichen aus, um den Wiener Fundservice zu testen.',
    'onboarding.guest.nameLabel': 'Name',
    'onboarding.guest.namePlaceholder': 'Ihr Name',
    'onboarding.guest.emailLabel': 'E-Mail',
    'onboarding.guest.emailPlaceholder': 'sie@beispiel.at',
    'onboarding.guest.button': 'Als Gast starten',
    'onboarding.guest.nameError': 'Bitte geben Sie Ihren Namen ein.',
    'onboarding.guest.emailError': 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
    'onboarding.guest.saveError': 'Onboarding konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.',
  },
} as const;

export type Language = keyof typeof strings;
export type StringKey = keyof typeof strings.en;
