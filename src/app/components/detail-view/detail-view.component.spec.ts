import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailViewComponent } from './detail-view.component';
import { ActivatedRoute, provideRouter, Router } from '@angular/router';
import { PhotoService } from 'src/app/shared/service/photo.service';
import { Photo } from 'src/app/shared/models/photo.model';
import { PhotoCardComponent } from '../photo-card/photo-card.component';
import { By } from '@angular/platform-browser';
import { ROUTES } from 'src/app/shared/utils/routes.constants';

describe('DetailViewComponent', () => {
  let component: DetailViewComponent;
  let fixture: ComponentFixture<DetailViewComponent>;
  let photoService: jasmine.SpyObj<PhotoService>;
  let router: Router;
  const mockPhoto: Photo = { id: '1', url: 'https://picsum.photos/id/1/400/300' };

  beforeEach(async () => {
    const photoServiceSpy = jasmine.createSpyObj('PhotoService', ['getPhotoById', 'removeFromFavorites']);

    await TestBed.configureTestingModule({
      imports: [DetailViewComponent, PhotoCardComponent],
      providers: [
        provideRouter([]),
        { provide: PhotoService, useValue: photoServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } },
        },
      ],
    }).compileComponents();

    photoService = TestBed.inject(PhotoService) as jasmine.SpyObj<PhotoService>;
    router = TestBed.inject(Router);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailViewComponent);
    component = fixture.componentInstance;
    photoService.getPhotoById.and.returnValue(mockPhoto);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load photo on init', () => {
    expect(photoService.getPhotoById).toHaveBeenCalledWith('1');
    expect(component.photo).toEqual(mockPhoto);
  });

  it('should navigate to favorites after removing from favorites', () => {
    spyOn(router, 'navigate');

    component.removeFromFavorites();

    expect(photoService.removeFromFavorites).toHaveBeenCalledWith(mockPhoto.id);
    expect(router.navigate).toHaveBeenCalledWith(['/' + ROUTES.FAVORITES]);
  });

  it('should pass the correct inputs to PhotoCardComponent', () => {
    const photoCardComponent = fixture.debugElement.query(By.directive(PhotoCardComponent)).componentInstance as PhotoCardComponent;
    expect(photoCardComponent.photo).toEqual(mockPhoto);
    expect(photoCardComponent.showRemoveButton).toBeTrue();
  });
});