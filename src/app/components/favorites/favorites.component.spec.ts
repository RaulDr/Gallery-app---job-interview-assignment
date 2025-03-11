import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoritesComponent } from './favorites.component';
import { Router } from '@angular/router';
import { PhotoService } from 'src/app/shared/service/photo.service';
import { Photo } from 'src/app/shared/models/photo.model';
import { PhotoGridComponent } from '../photo-grid/photo-grid.component';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

describe('FavoritesComponent', () => {
  let component: FavoritesComponent;
  let fixture: ComponentFixture<FavoritesComponent>;
  let photoService: jasmine.SpyObj<PhotoService>;
  let router: Router;
  const mockPhotos: Photo[] = [
    { id: '1', url: 'https://picsum.photos/id/1/400/300' },
    { id: '2', url: 'https://picsum.photos/id/2/400/300' },
  ];

  beforeEach(async () => {
    const photoServiceSpy = jasmine.createSpyObj('PhotoService', ['favoritePhotos']);
    photoServiceSpy.favoritePhotos.and.returnValue(new Map(mockPhotos.map(photo => [photo.id, photo])));

    await TestBed.configureTestingModule({
      imports: [FavoritesComponent, PhotoGridComponent],
      providers: [
        provideRouter([
          { path: 'detail/:id', component: FavoritesComponent },
        ]),
        { provide: PhotoService, useValue: photoServiceSpy },
      ],
    }).compileComponents();

    photoService = TestBed.inject(PhotoService) as jasmine.SpyObj<PhotoService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load favorite photos on init', () => {
    expect(component.favoritePhotos()).toEqual(mockPhotos);
  });

  it('should navigate to detail view when a photo is clicked', () => {
    spyOn(router, 'navigate');

    const photoToView = mockPhotos[0];
    component.viewPhoto(photoToView);

    expect(router.navigate).toHaveBeenCalledWith([`/detail/${photoToView.id}`]);
  });

  it('should pass the correct photos to PhotoGridComponent', () => {
    const photoGridComponent = fixture.debugElement.query(By.directive(PhotoGridComponent)).componentInstance as PhotoGridComponent;
    expect(photoGridComponent.photos).toEqual(mockPhotos);
  });
});