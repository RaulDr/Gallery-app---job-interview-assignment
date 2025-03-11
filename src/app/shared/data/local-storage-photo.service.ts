import { Injectable } from '@angular/core';
import { Photo } from '../models/photo.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStoragePhotoService {
  loadFavoritesFromStorage(): Map<string, Photo> {
    const storedFavorites = localStorage.getItem('favoritePhotos');
    if (!storedFavorites) {
      return new Map();
    }
    return new Map(JSON.parse(storedFavorites));
  }

  saveFavoritesToStorage(favorites: Map<string, Photo>): void {
    const serializedMap = JSON.stringify(Array.from(favorites.entries()));
    localStorage.setItem('favoritePhotos', serializedMap);
  }
}
