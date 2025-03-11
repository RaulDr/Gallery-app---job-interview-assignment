import { CommonModule } from '@angular/common';
import { Component, inject, signal, Signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, RouterModule } from '@angular/router';
import { Photo } from 'src/app/shared/models/photo.model';
import { PhotoService } from 'src/app/shared/service/photo.service';
import { PhotoGridComponent } from '../photo-grid/photo-grid.component';
import { ROUTES } from '../../shared/utils/routes.constants';

@Component({
  selector: 'app-favorites',
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    RouterModule,
    PhotoGridComponent,
  ],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss',
})
export class FavoritesComponent {
  private readonly ROUTES = ROUTES;
  private photoService = inject(PhotoService);
  private router = inject(Router);
  favoritePhotos: Signal<Photo[]> = signal(
    Array.from(this.photoService.favoritePhotos().values())
  );

  viewPhoto(photo: Photo) {
    this.router.navigate([`/${this.ROUTES.DETAIL}/${photo.id}`]);
  }
}
