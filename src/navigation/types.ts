import { NavigatorScreenParams } from '@react-navigation/native';

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
  Fundbox: NavigatorScreenParams<FundboxStackParamList> | undefined;
};

export type FundboxStackParamList = {
  Map: undefined;
  Route: { fundboxId: string };
  DropOff: { fundboxId: string };
  DropOffSuccess: { fundboxId: string };
  Claim: undefined;
  ClaimSuccess: undefined;
};
