import { TestBed } from '@angular/core/testing';
import { LocalStoragePhotoService } from './local-storage-photo.service';
import { Photo } from '../models/photo.model';

describe('LocalStoragePhotoService', () => {
  let service: LocalStoragePhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStoragePhotoService],
    });
    service = TestBed.inject(LocalStoragePhotoService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('loadFavoritesFromStorage', () => {
    it('should return an empty Map if no favorites are stored', () => {
      const result = service.loadFavoritesFromStorage();
      expect(result).toEqual(new Map());
    });

    it('should return a Map with data when favorites are stored', () => {
      const mockFavorites: [string, Photo][] = [
        ['1', { id: '1', url: 'http://example.com/photo1.jpg' }],
        ['2', { id: '2', url: 'http://example.com/photo2.jpg' }],
      ];
      localStorage.setItem('favoritePhotos', JSON.stringify(mockFavorites));

      const result = service.loadFavoritesFromStorage();

      expect(result).toEqual(new Map(mockFavorites));
      expect(result.size).toBe(2);
    });
  });

  describe('saveFavoritesToStorage', () => {
    it('should save an empty Map to localStorage', () => {
      const favorites = new Map<string, Photo>();

      service.saveFavoritesToStorage(favorites);

      expect(localStorage.getItem('favoritePhotos')).toEqual(
        JSON.stringify([])
      );
    });

    it('should save a Map with data to localStorage', () => {
      const mockFavorites: Map<string, Photo> = new Map([
        ['1', { id: '1', url: 'http://example.com/photo1.jpg' }],
        ['2', { id: '2', url: 'http://example.com/photo2.jpg' }],
      ]);

      service.saveFavoritesToStorage(mockFavorites);

      const storedData = localStorage.getItem('favoritePhotos');
      expect(storedData).toEqual(
        JSON.stringify(Array.from(mockFavorites.entries()))
      );
    });

    it('should overwrite existing localStorage data', () => {
      localStorage.setItem(
        'favoritePhotos',
        JSON.stringify([
          ['3', { id: '3', url: 'http://example.com/photo3.jpg' }],
        ])
      );

      const newFavorites: Map<string, Photo> = new Map([
        ['1', { id: '1', url: 'http://example.com/photo1.jpg' }],
      ]);

      service.saveFavoritesToStorage(newFavorites);

      const storedData = localStorage.getItem('favoritePhotos');
      expect(storedData).toEqual(
        JSON.stringify(Array.from(newFavorites.entries()))
      );
    });
  });
});
