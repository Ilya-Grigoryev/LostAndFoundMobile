import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoserReport } from '../types/loser';

const STORAGE_KEY = '@lost_reports';

export interface SavedLoserReport extends LoserReport {
  id: string;
  createdAt: number;
}

function generateId(): string {
  return `lr-${Date.now()}-${Math.floor(Math.random() * 1_000_000).toString(36)}`;
}

export async function saveLostReport(report: LoserReport): Promise<SavedLoserReport> {
  if (!report.category || !report.location) {
    throw new Error('Report is incomplete: category and location are required.');
  }

  const saved: SavedLoserReport = {
    ...report,
    id: generateId(),
    createdAt: Date.now(),
  };

  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const list: SavedLoserReport[] = raw ? JSON.parse(raw) : [];
  list.push(saved);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(list));

  return saved;
}

export async function getSavedReports(): Promise<SavedLoserReport[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
