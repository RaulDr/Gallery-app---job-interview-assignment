import { inject, Injectable, signal, Signal } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { Photo } from '../models/photo.model';
import { PhotoApiService } from '../data/photo-api.service';
import { LocalStoragePhotoService } from '../data/local-storage-photo.service';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photoApiService: PhotoApiService = inject(PhotoApiService);
  private localStoragePhotoService: LocalStoragePhotoService = inject(LocalStoragePhotoService);
  private readonly _favoritePhotos = signal<Map<string, Photo>>(this.localStoragePhotoService.loadFavoritesFromStorage() || new Map<string, Photo>());
  get favoritePhotos(): Signal<Map<string, Photo>> {
    return this._favoritePhotos;
  }


  loadPhotos(page: number = 1, count?: number): Observable<Photo[]> {
    return this.photoApiService.getPhotos(page, count).pipe(
      map((photos: any[]) => photos.map((photo: any) => ({ id: photo.id, url: photo.download_url }))),
      delay(this.fewSeconds())
    );
  }

  addToFavorites(photo: Photo): void {
    const currentFavorites = this._favoritePhotos();
    if (!currentFavorites.has(photo.id)) {
      currentFavorites.set(photo.id, photo);
      this._favoritePhotos.set(new Map(currentFavorites));
      this.localStoragePhotoService.saveFavoritesToStorage(currentFavorites);
    }
  }

  removeFromFavorites(photoId: string): void {
    const currentFavorites = this._favoritePhotos();
    if (currentFavorites.has(photoId)) {
      currentFavorites.delete(photoId);
      this._favoritePhotos.set(new Map(currentFavorites));
      this.localStoragePhotoService.saveFavoritesToStorage(currentFavorites);
    }
  }

  getPhotoById(photoId: string): Photo | undefined {
    return this._favoritePhotos().get(photoId);
  }

  private fewSeconds(): number {
    return Math.random() * 100 + 200;
  }
}
