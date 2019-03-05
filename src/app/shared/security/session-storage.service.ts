import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorageService {
  static BANK_ACCOUNT_STORAGE_KEY = 'bank_account';
  static ACTIVATE_LATER_STORAGE_KEY = 'activate_later';

  supportsSessionStorage: boolean;

  constructor() {
    try {
      const testKey = 'session-storage-test';
      sessionStorage.setItem(testKey, 'ok');
      sessionStorage.removeItem(testKey);
      this.supportsSessionStorage = true;
    } catch (e) {
      this.supportsSessionStorage = false;
      this.clear();
    }
  }

  hasItem(key: string): boolean {
    if (this.supportsSessionStorage) {
      return this.getItem(key) ? true : false;
    }

    return false;
  }

  setItem(key: string, val: string): void {
    if (this.supportsSessionStorage) {
      sessionStorage.setItem(key, val);
    }
  }

  getItem(key: string): string {
    if (this.supportsSessionStorage) {
      return sessionStorage.getItem(key);
    }
  }

  removeItem(key: string): void {
    if (this.supportsSessionStorage) {
      return sessionStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.supportsSessionStorage) {
      return sessionStorage.clear();
    }
  }
}
