import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface FavoriteHotel {
  id: number;
  name: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private api = 'http://localhost:8081/favorites';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<FavoriteHotel[]> {
    return this.http.get<FavoriteHotel[]>(this.api);
  }

  add(hotelId: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.api}/${hotelId}`, {});
  }

  remove(hotelId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/${hotelId}`);
  }
}
