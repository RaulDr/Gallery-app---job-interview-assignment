import { TestBed } from '@angular/core/testing';
import { PhotoService } from './photo.service';
import { PhotoApiService } from '../data/photo-api.service';
import { LocalStoragePhotoService } from '../data/local-storage-photo.service';
import { of } from 'rxjs';
import { Photo } from '../models/photo.model';

describe('PhotoService', () => {
  let service: PhotoService;
  let photoApiService: jasmine.SpyObj<PhotoApiService>;
  let localStoragePhotoService: jasmine.SpyObj<LocalStoragePhotoService>;

  beforeEach(() => {
    const photoApiSpy = jasmine.createSpyObj('PhotoApiService', ['getPhotos']);
    const localStorageSpy = jasmine.createSpyObj('LocalStoragePhotoService', [
      'loadFavoritesFromStorage',
      'saveFavoritesToStorage',
    ]);

    TestBed.configureTestingModule({
      providers: [
        PhotoService,
        { provide: PhotoApiService, useValue: photoApiSpy },
        { provide: LocalStoragePhotoService, useValue: localStorageSpy },
      ],
    });

    service = TestBed.inject(PhotoService);
    photoApiService = TestBed.inject(
      PhotoApiService
    ) as jasmine.SpyObj<PhotoApiService>;
    localStoragePhotoService = TestBed.inject(
      LocalStoragePhotoService
    ) as jasmine.SpyObj<LocalStoragePhotoService>;

    localStoragePhotoService.loadFavoritesFromStorage.and.returnValue(
      new Map()
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#loadPhotos', () => {
    it('should return a list of photos', (done: DoneFn) => {
      const mockPhotos = [{ id: '1', download_url: 'url1' }, { id: '2', download_url: 'url2' }];
      photoApiService.getPhotos.and.returnValue(of(mockPhotos));

      service.loadPhotos().subscribe(photos => {
        expect(photos).toEqual([
          { id: '1', url: 'url1' },
          { id: '2', url: 'url2' }
        ]);
        done();
      });
    });
  });

  describe('#addToFavorites', () => {
    it('should add a photo to favorites if not already present', () => {
      const photo: Photo = { id: '1', url: 'url1' };
      service.addToFavorites(photo);
      expect(service.favoritePhotos().size).toBe(1);
      expect(service.favoritePhotos().get('1')).toEqual(photo);
      expect(
        localStoragePhotoService.saveFavoritesToStorage
      ).toHaveBeenCalledWith(service.favoritePhotos());
    });

    it('should not add a photo to favorites if already present', () => {
      const photo: Photo = { id: '1', url: 'url1' };
      service.addToFavorites(photo);
      service.addToFavorites(photo);
      expect(service.favoritePhotos().size).toBe(1);
      expect(
        localStoragePhotoService.saveFavoritesToStorage
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('#removeFromFavorites', () => {
    it('should remove a photo from favorites if present', () => {
      const photo: Photo = { id: '1', url: 'url1' };
      service.addToFavorites(photo);
      service.removeFromFavorites(photo.id);
      expect(service.favoritePhotos().size).toBe(0);
      expect(
        localStoragePhotoService.saveFavoritesToStorage
      ).toHaveBeenCalledWith(service.favoritePhotos());
    });
    it('should do nothing if the photo is not in favorites', () => {
      service.removeFromFavorites('non-existent-id');
      expect(service.favoritePhotos().size).toBe(0);
      expect(
        localStoragePhotoService.saveFavoritesToStorage
      ).not.toHaveBeenCalled();
    });
  });

  describe('#getPhotoById', () => {
    it('should return the photo if it exists in favorites', () => {
      const photo: Photo = { id: '1', url: 'url1' };
      service.addToFavorites(photo);
      const result = service.getPhotoById(photo.id);
      expect(result).toEqual(photo);
    });
    it('should return undefined if the photo does not exist in favorites', () => {
      const result = service.getPhotoById('non-existent-id');
      expect(result).toBeUndefined();
    });
  });
});
