import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PhotoApiService } from './photo-api.service';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('PhotoApiService', () => {
  let service: PhotoApiService;
  let httpMock: HttpTestingController;
  const apiUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PhotoApiService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PhotoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPhotos', () => {
    it('should fetch photos with default pagination', () => {
      const mockPhotos = [
        { id: 1, title: 'Photo 1' },
        { id: 2, title: 'Photo 2' },
      ];

      service.getPhotos().subscribe((photos) => {
        expect(photos).toEqual(mockPhotos);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=1&limit=10`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPhotos);
    });

    it('should fetch photos with specified pagination', () => {
      const mockPhotos = [
        { id: 1, title: 'Photo 1' },
        { id: 2, title: 'Photo 2' },
      ];
      const page = 2;
      const limit = 5;

      service.getPhotos(page, limit).subscribe((photos) => {
        expect(photos).toEqual(mockPhotos);
      });

      const req = httpMock.expectOne(`${apiUrl}?page=${page}&limit=${limit}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPhotos);
    });

    it('should handle errors gracefully', () => {
      const errorMessage = 'Failed to fetch photos';

      service.getPhotos().subscribe({
        next: () => fail('Expected an error, but got data instead'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });

      const req = httpMock.expectOne(`${apiUrl}?page=1&limit=10`);
      req.flush(errorMessage, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
