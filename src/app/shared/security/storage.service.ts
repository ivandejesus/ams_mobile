import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {
  supportsLocalStorage: boolean;

  constructor() {
    try {
      const testKey = 'storage-test';
      localStorage.setItem(testKey, 'ok');
      localStorage.removeItem(testKey);
      this.supportsLocalStorage = true;
    } catch (e) {
      this.supportsLocalStorage = false;
      this.clear();
    }
  }

  setItem(key: string, val: string): void {
    if (this.supportsLocalStorage) {
      localStorage.setItem(key, val);
    }

    // handle if local storage not supported.
  }

  getItem(key: string): string {
    if (this.supportsLocalStorage) {
      return localStorage.getItem(key);
    }

    // handle if local storage not supported.
  }

  removeItem(key: string): void {
    if (this.supportsLocalStorage) {
      return localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.supportsLocalStorage) {
      return localStorage.clear();
    }
  }
}
