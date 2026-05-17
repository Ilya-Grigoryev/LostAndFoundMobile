import AsyncStorage from '@react-native-async-storage/async-storage';
import { FinderLocation, FinderReport } from '../types/finder';

const STORAGE_KEY = '@finder_reports';

function generateId(): string {
  return `fr-${Date.now()}-${Math.floor(Math.random() * 1_000_000).toString(36)}`;
}

export async function saveFinderReport(
  photoUri: string,
  location: FinderLocation,
): Promise<FinderReport> {
  const report: FinderReport = {
    id: generateId(),
    photoUri,
    location,
    timestamp: Date.now(),
  };

  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const list: FinderReport[] = raw ? JSON.parse(raw) : [];
  list.push(report);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));

  return report;
}
