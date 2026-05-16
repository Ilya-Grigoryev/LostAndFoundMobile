import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type MatchReport = {
  id: string;
  category: string;
  description?: string;
  fundboxId?: string;
};

const demoLostThings: MatchReport[] = [
  {
    id: 'lost-coat-1',
    category: 'Mantel',
    description: 'Beiger Mantel mit roten Manschettenknöpfen und Studierendendokumenten innen',
  },
  {
    id: 'lost-keys-1',
    category: 'Schlüssel',
    description: 'Schlüsselbund mit rotem Anhänger',
  },
  {
    id: 'lost-wallet-1',
    category: 'Geldbörse',
    description: 'Braune Geldbörse mit Studentenausweis',
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

function makeSmallWordList(text?: string): string[] {
  if (!text) return [];
  return text.toLowerCase().split(/\W+/).filter(word => word.length > 2);
}

function hasSameSimpleWords(foundText?: string, lostText?: string): boolean {
  const foundThingWords = makeSmallWordList(foundText);
  const lostThingWords = makeSmallWordList(lostText);
  return foundThingWords.some(word => lostThingWords.includes(word));
}

export function simulateMatch(foundReport: MatchReport, lostReports: MatchReport[]): MatchReport | null {
  const sameCategoryPile = lostReports.filter(lostThing => lostThing.category === foundReport.category);

  if (sameCategoryPile.length === 0) {
    return null;
  }

  const nicerTextMatch = sameCategoryPile.find(lostThing =>
    hasSameSimpleWords(foundReport.description, lostThing.description),
  );

  return nicerTextMatch ?? sameCategoryPile[0];
}

async function canSendDemoNotification(): Promise<boolean> {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('matches', {
      name: 'Matches',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  const permissionBeforeAsking = await Notifications.getPermissionsAsync();

  if (permissionBeforeAsking.granted) {
    return true;
  }

  const permissionAfterAsking = await Notifications.requestPermissionsAsync();
  return permissionAfterAsking.granted;
}

async function sendDemoMatchNotification(category: string) {
  const notificationIsAllowed = await canSendDemoNotification();

  if (!notificationIsAllowed) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: `match-${Date.now()}`,
    content: {
      title: 'Mögliche Übereinstimmung!',
      body: `Ihr ${category} könnte gefunden worden sein.`,
    },
    trigger: {
      channelId: 'matches',
      seconds: 3,
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    },
  });
}

export async function runDropOffMatchingDemo(fundboxId: string): Promise<void> {
  const foundThingFromBox: MatchReport = {
    id: `found-${Date.now()}`,
    category: 'Mantel',
    description: 'Beiger Mantel mit roten Manschettenknöpfen und Dokumenten in der Innentasche',
    fundboxId,
  };

  const maybeDemoMatch = simulateMatch(foundThingFromBox, demoLostThings);

  if (!maybeDemoMatch) {
    return;
  }

  await sendDemoMatchNotification(foundThingFromBox.category);
}
