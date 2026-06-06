import { NavigatorScreenParams } from '@react-navigation/native';
import { CategoryId } from '../types/loser';

export type RootStackParamList = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainStackParamList> | undefined;
};

export type OnboardingStackParamList = {
  LanguagePicker: undefined;
  GuestRegistration: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Finder: NavigatorScreenParams<FinderStackParamList> | undefined;
  Loser: NavigatorScreenParams<LoserStackParamList> | undefined;
  Fundbox: NavigatorScreenParams<FundboxStackParamList> | undefined;
  ActivityHistory: undefined;
};

export type FinderStackParamList = {
  CameraGps: undefined;
  Location: undefined;
  Choice: undefined;
  Success: undefined;
};

export type LoserStackParamList = {
  // Optional prefill values when editing an existing report (ISSUE-03).
  Category: { editId?: string; categoryId?: CategoryId; description?: string } | undefined;
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
  DropOffSuccess: { fundboxId: string; code: string };
  PossibleMatch:
    | {
        categoryLabel?: string;
        description?: string;
        photoUri?: string;
        matchPlace?: 'city' | 'fundbox';
        fundboxId?: string;
        droppedAtLabel?: string;
        placeLabel?: string;
        addressLabel?: string;
        latitude?: number;
        longitude?: number;
      }
    | undefined;
  MatchFundboxRoute: { fundboxId?: string; categoryLabel?: string } | undefined;
  Claim: { categoryLabel?: string; fundboxId?: string; droppedAtLabel?: string } | undefined;
  MatchLocation:
    | {
        categoryLabel?: string;
        placeLabel?: string;
        addressLabel?: string;
        latitude?: number;
        longitude?: number;
      }
    | undefined;
  ClaimSuccess: undefined;
};
