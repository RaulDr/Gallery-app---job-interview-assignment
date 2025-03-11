import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListViewComponent } from './list-view.component';
import { PhotoService } from 'src/app/shared/service/photo.service';
import { of, throwError } from 'rxjs';
import { Photo } from 'src/app/shared/models/photo.model';
import { By } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PhotoGridComponent } from '../photo-grid/photo-grid.component';
import { InfiniteScrollDirective } from 'src/app/shared/service/infinite-scroll-directive.service';

describe('ListViewComponent', () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;
  let photoService: jasmine.SpyObj<PhotoService>;

  /*
    We hve 5 photos in the array because 5 photos are enough to fill the viewport,
    less would be contentHeight <= viewportHeight and the loadMorePhotos() method would be called
  */
  const mockPhotos: Photo[] = [
    { id: '1', url: 'https://picsum.photos/id/1/400/300' },
    { id: '2', url: 'https://picsum.photos/id/2/400/300' },
    { id: '3', url: 'https://picsum.photos/id/2/400/300' },
    { id: '4', url: 'https://picsum.photos/id/2/400/300' },
    { id: '5', url: 'https://picsum.photos/id/2/400/300' },
  ];

  beforeEach(async () => {
    const photoServiceSpy = jasmine.createSpyObj('PhotoService', ['loadPhotos', 'addToFavorites']);
    photoServiceSpy.loadPhotos.and.returnValue(of(mockPhotos));

    await TestBed.configureTestingModule({
      imports: [ListViewComponent, MatProgressSpinnerModule, PhotoGridComponent, InfiniteScrollDirective],
      providers: [
        { provide: PhotoService, useValue: photoServiceSpy },
      ],
    }).compileComponents();

    photoService = TestBed.inject(PhotoService) as jasmine.SpyObj<PhotoService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load photos on init', () => {
    expect(photoService.loadPhotos).toHaveBeenCalledWith(1);
    expect(component.photos()).toEqual(mockPhotos);
  });

  it('should load more photos when scrolled', () => {
    component.loadMorePhotos();
    fixture.detectChanges();
    expect(photoService.loadPhotos).toHaveBeenCalledWith(1);
    expect(component.photos()).toEqual([...mockPhotos, ...mockPhotos]);
  });

  it('should handle errors when loading photos', () => {
    photoService.loadPhotos.and.returnValue(throwError('Error loading photos'));
    spyOn(console, 'error');

    component.loadMorePhotos();
    fixture.detectChanges();
    expect(console.error).toHaveBeenCalledWith('Error loading photos:', 'Error loading photos');
  });

  it('should add photo to favorites when clicked', () => {
    const photo = mockPhotos[0];
    component.addToFavorites(photo);
    expect(photoService.addToFavorites).toHaveBeenCalledWith(photo);
  });

  it('should show loading spinner when loading', () => {
    component.isLoading.set(true);
    fixture.detectChanges();

    const spinner = fixture.debugElement.query(By.css('mat-progress-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should not load more photos if already loading', () => {
    component.isLoading.set(true);
    component.loadMorePhotos();
    expect(photoService.loadPhotos).toHaveBeenCalledTimes(1);
  });
});