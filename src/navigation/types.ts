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
  Loser: NavigatorScreenParams<LoserStackParamList> | undefined;
  Fundbox: NavigatorScreenParams<FundboxStackParamList> | undefined;
};

export type LoserStackParamList = {
  Category: undefined;
  LocationMode: undefined;
  LocationMap: undefined;
  LocationAddress: undefined;
  Confirm: undefined;
  Success: undefined;
};

export type FundboxStackParamList = {
  Map: undefined;
  Route: { fundboxId: string };
  DropOff: { fundboxId: string };
  DropOffSuccess: { fundboxId: string };
  Claim: undefined;
  ClaimSuccess: undefined;
};
