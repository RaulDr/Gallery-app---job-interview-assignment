import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPhotos(page: number = 1, limit: number = 10): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }
}
