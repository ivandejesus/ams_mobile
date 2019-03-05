import { StorageService } from "./storage.service";
import { TestBed } from "@angular/core/testing";

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService]
    });

    service = TestBed.get(StorageService);

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    // Whenever a function on localstorage is called
    // call our mock storage instead.
    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy(service);
  });

  it('should set value on the storage correctly', () => {
    service.setItem('zimitech', 'some-item');
    expect(localStorage.getItem('zimitech')).toEqual('some-item');
  });

  it('should get value from storage correctly', () => {
    localStorage.setItem('zimitech', 'some-item')
    expect(service.getItem('zimitech')).toEqual('some-item');
  });

  it('should remove a value from storage correctly', () => {
    localStorage.setItem('zimitech', 'some-item')
    service.removeItem('zimitech');
    expect(service.getItem('zimitech')).toBeNull();
  });

  it('should return null on non-existing item.', () => {
    expect(service.getItem('nonExisting')).toBeNull();
  });
});
