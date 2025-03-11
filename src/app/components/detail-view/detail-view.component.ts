import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { PhotoService } from 'src/app/shared/service/photo.service';
import { Photo } from 'src/app/shared/models/photo.model';
import { ROUTES } from 'src/app/shared/utils/routes.constants';
import { environment } from '../../../environments/environment';
import { PhotoCardComponent } from '../photo-card/photo-card.component';
@Component({
  selector: 'app-detail-view',
  imports: [CommonModule, MatCardModule, MatButtonModule, PhotoCardComponent],
  templateUrl: './detail-view.component.html',
  styleUrls: ['./detail-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailViewComponent implements OnInit {
  photo!: Photo;
  private readonly router = inject(Router);
  readonly notFoundPhotoUrl = environment.notFoundPhotoUrl;
  private photoService = inject(PhotoService);
  private activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.loadPhoto();
  }

  private loadPhoto(): void {
    const photoId = this.activatedRoute.snapshot.params['id'];
    const loadedPhoto = this.photoService.getPhotoById(photoId);

    if (loadedPhoto) {
      this.photo = loadedPhoto;
    }
  }

  removeFromFavorites(): void {
    if (this.photo) {
      this.photoService.removeFromFavorites(this.photo.id);
    }
    this.router.navigate(['/' + ROUTES.FAVORITES]);
  }
}
