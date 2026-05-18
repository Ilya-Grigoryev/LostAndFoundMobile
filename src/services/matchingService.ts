import type { NavigationContainerRefWithCurrent } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { RootStackParamList } from '../navigation/types';
import type { CategoryId } from '../types/loser';
import type { Language } from '../constants/strings';

type MatchPlace = 'fundbox' | 'city';

export type MatchReport = {
  id: string;
  category: CategoryId;
  itemName?: string;
  description?: string;
  fundboxId?: string;
  place: MatchPlace;
  placeLabel?: string;
  addressLabel?: string;
  latitude?: number;
  longitude?: number;
};

type DummyProduct = {
  id: number;
  title: string;
  description: string;
  category: string;
};

type DummyProductsResponse = {
  products: DummyProduct[];
};

const schwedenplatzDemoLatitude = 48.21155;
const schwedenplatzDemoLongitude = 16.37815;

const categoryNameForNotification: Record<CategoryId, string> = {
  phone: 'Handy',
  keys: 'Schlüssel',
  wallet: 'Geldbörse',
  umbrella: 'Regenschirm',
  headphones: 'Kopfhörer',
  glasses: 'Brille',
  other: 'Gegenstand',
};

const englishCategoryNameForNotification: Record<CategoryId, string> = {
  phone: 'phone',
  keys: 'keys',
  wallet: 'wallet',
  umbrella: 'umbrella',
  headphones: 'headphones',
  glasses: 'glasses',
  other: 'item',
};

const backupLostThingsForDemo: MatchReport[] = [
  {
    id: 'lost-coat-1',
    category: 'other',
    itemName: 'beiger Mantel',
    description: 'Beiger Mantel mit roten Manschettenknöpfen und Studierendendokumenten innen',
    place: 'fundbox',
  },
  {
    id: 'lost-keys-1',
    category: 'keys',
    description: 'Schlüsselbund mit rotem Anhänger',
    place: 'city',
    placeLabel: 'U4 Station Schwedenplatz',
    addressLabel: 'Bahnsteig Richtung Hütteldorf',
    latitude: schwedenplatzDemoLatitude,
    longitude: schwedenplatzDemoLongitude,
  },
  {
    id: 'lost-wallet-1',
    category: 'wallet',
    description: 'Braune Geldbörse mit Studentenausweis',
    place: 'fundbox',
  },
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function makeWordListForMatching(text?: string): string[] {
  if (!text) return [];
  return text.toLowerCase().split(/\W+/).filter(word => word.length > 2);
}

function hasSameWordsForSmallMatch(foundText?: string, lostText?: string): boolean {
  const wordsFromFoundThing = makeWordListForMatching(foundText);
  const wordsFromLostThing = makeWordListForMatching(lostText);
  return wordsFromFoundThing.some(word => wordsFromLostThing.includes(word));
}

function makeCategoryFromDummyProduct(product: DummyProduct): CategoryId {
  const textForCategoryGuess = `${product.title} ${product.description} ${product.category}`.toLowerCase();

  if (
    textForCategoryGuess.includes('phone') ||
    textForCategoryGuess.includes('iphone') ||
    textForCategoryGuess.includes('smartphone')
  ) {
    return 'phone';
  }

  if (textForCategoryGuess.includes('key')) {
    return 'keys';
  }

  if (textForCategoryGuess.includes('wallet') || textForCategoryGuess.includes('purse')) {
    return 'wallet';
  }

  if (textForCategoryGuess.includes('umbrella')) {
    return 'umbrella';
  }

  if (
    textForCategoryGuess.includes('headphone') ||
    textForCategoryGuess.includes('airpod') ||
    textForCategoryGuess.includes('earbud')
  ) {
    return 'headphones';
  }

  if (textForCategoryGuess.includes('glasses') || textForCategoryGuess.includes('sunglasses')) {
    return 'glasses';
  }

  return 'other';
}

function makeLabelForNotification(report: MatchReport, language: Language): string {
  if (report.itemName) {
    return report.itemName;
  }

  return language === 'en'
    ? englishCategoryNameForNotification[report.category]
    : categoryNameForNotification[report.category];
}

function dummyProductToLostReportForDemo(product: DummyProduct): MatchReport {
  const categoryFromProduct = makeCategoryFromDummyProduct(product);
  const shouldBeCityPlace = product.id % 2 === 0;

  return {
    id: `dummy-${product.id}`,
    category: categoryFromProduct,
    itemName: categoryFromProduct === 'other' ? product.title : undefined,
    description: product.description,
    place: shouldBeCityPlace ? 'city' : 'fundbox',
    placeLabel: shouldBeCityPlace ? 'Wien Innenstadt' : undefined,
    addressLabel: shouldBeCityPlace ? 'Nähe Stephansplatz' : undefined,
    latitude: shouldBeCityPlace ? schwedenplatzDemoLatitude : undefined,
    longitude: shouldBeCityPlace ? schwedenplatzDemoLongitude : undefined,
  };
}

async function getLostReportsFromDummyJsonForDemo(): Promise<MatchReport[]> {
  try {
    const dummyJsonResponse = await fetch(
      'https://dummyjson.com/products?limit=12&select=id,title,description,category',
    );

    if (!dummyJsonResponse.ok) {
      return backupLostThingsForDemo;
    }

    const productsFromBackend = (await dummyJsonResponse.json()) as DummyProductsResponse;
    const lostReportsForDemo = productsFromBackend.products.map(dummyProductToLostReportForDemo);
    return lostReportsForDemo.length > 0 ? lostReportsForDemo : backupLostThingsForDemo;
  } catch {
    return backupLostThingsForDemo;
  }
}

function makeFoundReportFromLostReportForDemo(lostReport: MatchReport, fundboxId: string): MatchReport {
  return {
    id: `found-${Date.now()}`,
    category: lostReport.category,
    itemName: lostReport.itemName,
    description: lostReport.description,
    fundboxId,
    place: 'fundbox',
  };
}

export function simulateMatch(foundReport: MatchReport, lostReports: MatchReport[]): MatchReport | null {
  const reportsWithSameCategory = lostReports.filter(lostReport => lostReport.category === foundReport.category);

  if (reportsWithSameCategory.length === 0) {
    return null;
  }

  const reportWithBetterTextMatch = reportsWithSameCategory.find(lostReport =>
    hasSameWordsForSmallMatch(foundReport.description, lostReport.description),
  );

  return reportWithBetterTextMatch ?? reportsWithSameCategory[0];
}

async function canSendNotificationForDemo(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('matches', {
      name: 'Matches',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const permissionBeforePermissionQuestion = await Notifications.getPermissionsAsync();

  if (permissionBeforePermissionQuestion.granted) {
    return true;
  }

  const permissionAfterPermissionQuestion = await Notifications.requestPermissionsAsync();
  return permissionAfterPermissionQuestion.granted;
}

async function sendMatchNotificationForDemo(match: MatchReport, language: Language) {
  const notificationIsAllowed = await canSendNotificationForDemo();

  if (!notificationIsAllowed) {
    return;
  }

  const categoryLabelForMessage = makeLabelForNotification(match, language);
  const notificationTitle =
    language === 'en' ? 'Possible match!' : 'Mögliche Übereinstimmung!';
  const notificationBody =
    language === 'en'
      ? `Your ${categoryLabelForMessage} may have been found.`
      : `Ihr ${categoryLabelForMessage} könnte gefunden worden sein.`;

  await Notifications.scheduleNotificationAsync({
    identifier: `match-${Date.now()}`,
    content: {
      title: notificationTitle,
      body: notificationBody,
      data: {
        matchPlace: match.place,
        categoryLabel: categoryLabelForMessage,
        language,
        fundboxId: match.fundboxId ?? '',
        placeLabel: match.placeLabel ?? '',
        addressLabel: match.addressLabel ?? '',
        latitude: match.latitude ?? schwedenplatzDemoLatitude,
        longitude: match.longitude ?? schwedenplatzDemoLongitude,
      },
    },
    trigger: {
      channelId: 'matches',
      seconds: 3,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    },
  });
}

function openScreenFromMatchNotification(
  data: Notifications.NotificationContent['data'],
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
) {
  if (!navigationRef.isReady()) {
    return;
  }

  const routePlaceFromNotification = data.matchPlace === 'city' ? 'city' : 'fundbox';
  const categoryLabelFromNotification = typeof data.categoryLabel === 'string' ? data.categoryLabel : undefined;

  if (routePlaceFromNotification === 'city') {
    navigationRef.navigate('Main', {
      screen: 'Fundbox',
      params: {
        screen: 'PossibleMatch',
        params: {
          matchPlace: 'city',
          categoryLabel: categoryLabelFromNotification,
          placeLabel: typeof data.placeLabel === 'string' ? data.placeLabel : undefined,
          addressLabel: typeof data.addressLabel === 'string' ? data.addressLabel : undefined,
          latitude: typeof data.latitude === 'number' ? data.latitude : undefined,
          longitude: typeof data.longitude === 'number' ? data.longitude : undefined,
        },
      },
    });
    return;
  }

  navigationRef.navigate('Main', {
    screen: 'Fundbox',
    params: {
      screen: 'PossibleMatch',
      params: {
        matchPlace: 'fundbox',
        categoryLabel: categoryLabelFromNotification,
        fundboxId: typeof data.fundboxId === 'string' ? data.fundboxId : undefined,
        droppedAtLabel: data.language === 'en' ? 'Just now' : 'Gerade eben',
      },
    },
  });
}

export function addMatchNotificationTapListener(
  navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>,
) {
  const subscription = Notifications.addNotificationResponseReceivedListener(response => {
    openScreenFromMatchNotification(response.notification.request.content.data, navigationRef);
  });

  Notifications.getLastNotificationResponseAsync()
    .then(response => {
      if (response) {
        openScreenFromMatchNotification(response.notification.request.content.data, navigationRef);
      }
    })
    .catch(() => undefined);

  return () => subscription.remove();
}

export async function runDropOffMatchingDemo(fundboxId: string, language: Language): Promise<void> {
  const lostReportsFromBackend = await getLostReportsFromDummyJsonForDemo();
  const foundReportFromFundbox = makeFoundReportFromLostReportForDemo(lostReportsFromBackend[0], fundboxId);
  const possibleMatchForDemo = simulateMatch(foundReportFromFundbox, lostReportsFromBackend);

  if (!possibleMatchForDemo) {
    return;
  }

  await sendMatchNotificationForDemo({ ...possibleMatchForDemo, fundboxId, place: 'fundbox' }, language);
}

export async function runCityMatchingDemo(language: Language): Promise<void> {
  const cityLostReport =
    backupLostThingsForDemo.find(lostReport => lostReport.place === 'city') ?? backupLostThingsForDemo[0];

  await sendMatchNotificationForDemo(
    {
      ...cityLostReport,
      place: 'city',
      placeLabel:
        cityLostReport.placeLabel ?? (language === 'en' ? 'U4 station Schwedenplatz' : 'U4 Station Schwedenplatz'),
      addressLabel:
        cityLostReport.addressLabel ?? (language === 'en' ? 'Platform toward Hütteldorf' : 'Bahnsteig Richtung Hütteldorf'),
    },
    language,
  );
}
