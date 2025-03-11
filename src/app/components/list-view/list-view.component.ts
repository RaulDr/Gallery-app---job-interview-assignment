import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { Photo } from 'src/app/shared/models/photo.model';
import { InfiniteScrollDirective } from 'src/app/shared/service/infinite-scroll-directive.service';
import { PhotoService } from 'src/app/shared/service/photo.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PhotoGridComponent } from '../photo-grid/photo-grid.component';
@Component({
  selector: 'app-list-view',
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    InfiniteScrollDirective,
    PhotoGridComponent,
  ],
  templateUrl: './list-view.component.html',
  styleUrl: './list-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListViewComponent implements OnInit {
  readonly photos = signal<Photo[]>([]);
  readonly isLoading = signal<boolean>(false);
  private readonly photoService = inject(PhotoService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private currentPage = 1;

  ngOnInit() {
    this.loadMorePhotos();
  }

  loadMorePhotos(): void {
    if (this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.photoService
      .loadPhotos(this.currentPage)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (newPhotos: Photo[]) => {
          this.photos.update((photos) => [...photos, ...newPhotos]);
          this.currentPage++;
          this.isLoading.set(false);
          this.cdr.detectChanges();
          this.loadMorePhotosIfNeeded();
        },
        error: (error) => {
          console.error('Error loading photos:', error);
          this.isLoading.set(false);
        },
      });
  }
  
  private loadMorePhotosIfNeeded(): void {
    const container = document.querySelector('.photo-grid-container') as HTMLElement;
    if (!container) return;
  
    const viewportHeight = window.innerHeight;
    const contentHeight = container.scrollHeight;
  
    if (contentHeight <= viewportHeight) {
      this.loadMorePhotos();
    }
  }

  addToFavorites(photo: Photo): void {
    this.photoService.addToFavorites(photo);
  }
}
