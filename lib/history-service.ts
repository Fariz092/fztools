import { db, auth, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, limit } from 'firebase/firestore';

export interface HistoryItem {
  id: string;
  userId: string;
  toolType: string;
  title: string;
  details?: string;
  previewUrl?: string; // Data URL or text snippet (kept under 150KB to fit firestore document)
  fileFormat: string;
  createdAt: string;
}

const LOCAL_STORAGE_KEY = 'fztools_local_history_v1';

export async function saveHistoryItem(item: Omit<HistoryItem, 'id' | 'userId' | 'createdAt'> & { previewUrl?: string }): Promise<HistoryItem> {
  const currentUser = auth.currentUser;
  const historyId = 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
  const now = new Date().toISOString();

  // If previewUrl is a huge data URL, downscale or trim to avoid Firestore 1MB limits
  let safePreview = item.previewUrl;
  if (safePreview && safePreview.length > 180000) {
    safePreview = safePreview.substring(0, 180000);
  }

  const record: HistoryItem = {
    id: historyId,
    userId: currentUser ? currentUser.uid : 'guest',
    toolType: item.toolType,
    title: item.title.slice(0, 250),
    details: (item.details || '').slice(0, 4000),
    previewUrl: safePreview || '',
    fileFormat: item.fileFormat || 'png',
    createdAt: now,
  };

  // Always save locally for instant offline access
  try {
    const rawLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    const localList: HistoryItem[] = rawLocal ? JSON.parse(rawLocal) : [];
    localList.unshift(record);
    if (localList.length > 50) localList.pop();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(localList));
  } catch (err) {
    console.warn('Could not save to localStorage', err);
  }

  // If user is authenticated, save to Firestore Cloud
  if (currentUser) {
    const path = `users/${currentUser.uid}/history/${historyId}`;
    try {
      await setDoc(doc(db, 'users', currentUser.uid, 'history', historyId), record);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    }
  }

  return record;
}

export async function fetchUserHistory(): Promise<HistoryItem[]> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    // Return local cache for guest
    try {
      const rawLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
      return rawLocal ? JSON.parse(rawLocal) : [];
    } catch {
      return [];
    }
  }

  const path = `users/${currentUser.uid}/history`;
  try {
    const colRef = collection(db, 'users', currentUser.uid, 'history');
    const q = query(colRef, orderBy('createdAt', 'desc'), limit(50));
    const snap = await getDocs(q);
    const items: HistoryItem[] = [];
    snap.forEach((d) => {
      items.push(d.data() as HistoryItem);
    });
    return items;
  } catch (err) {
    console.error('Failed to fetch firestore history, falling back to local', err);
    try {
      const rawLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
      return rawLocal ? JSON.parse(rawLocal) : [];
    } catch {
      return [];
    }
  }
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const currentUser = auth.currentUser;

  // Remove from localStorage
  try {
    const rawLocal = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (rawLocal) {
      const list: HistoryItem[] = JSON.parse(rawLocal);
      const filtered = list.filter((i) => i.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (err) {
    console.warn(err);
  }

  if (currentUser) {
    const path = `users/${currentUser.uid}/history/${id}`;
    try {
      await deleteDoc(doc(db, 'users', currentUser.uid, 'history', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, path);
    }
  }
}
