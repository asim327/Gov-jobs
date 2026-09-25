/**
 * Centralized LocalStorage Service Layer for CareerHub Pakistan
 */

export const STORAGE_KEYS = {
  JOBS: 'careerhub_jobs',
  USERS: 'careerhub_users',
  CURRENT_USER: 'careerhub_current_user',
  SAVED_JOBS: 'careerhub_saved_jobs',
  APPLICATIONS: 'careerhub_applications',
  NOTIFICATIONS: 'careerhub_notifications',
  JOB_ALERTS: 'careerhub_job_alerts',
  COMPANIES: 'careerhub_companies',
  DEPARTMENTS: 'careerhub_departments',
  CATEGORIES: 'careerhub_categories',
  ARTICLES: 'careerhub_articles',
  CV_DATA: 'careerhub_cv_data',
  SAVED_CVS: 'careerhub_cv_data',
  COVER_LETTERS: 'careerhub_cover_letters',
  RECENTLY_VIEWED: 'careerhub_recently_viewed',
  SITE_SETTINGS: 'careerhub_site_settings',
  THEME: 'careerhub_theme',
} as const;

export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return defaultValue;
    }
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error reading key "${key}" from localStorage:`, error);
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting key "${key}" to localStorage:`, error);
    return false;
  }
}

export function removeStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing key "${key}" from localStorage:`, error);
    return false;
  }
}

export function updateStorageItem<T>(
  key: string,
  updateFn: (prev: T) => T,
  defaultValue: T
): T {
  const current = getStorageItem<T>(key, defaultValue);
  const updated = updateFn(current);
  setStorageItem(key, updated);
  return updated;
}

export function resetAllStorageToDefaults(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage keys:', error);
  }
}

