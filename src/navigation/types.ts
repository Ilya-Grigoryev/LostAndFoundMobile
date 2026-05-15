export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
};

export type OnboardingStackParamList = {
  LanguagePicker: undefined;
  GuestRegistration: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Finder: undefined;
  Loser: undefined;
  Fundbox: undefined;
};

export type FundboxStackParamList = {
  Map: undefined;
  Route: { fundboxId: string };
  DropOff: { fundboxId: string };
  Code: { fundboxId: string; code: string };
  Claim: undefined;
  ClaimSuccess: undefined;
};
