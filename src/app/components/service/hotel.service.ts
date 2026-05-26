import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Hotel {
  id: number;
  name: string;
  city: string;
  address: string;
  description: string;
  isFavorite: boolean;
  lowestPrice?: number;
}

@Injectable({
  providedIn: 'root',
})
export class HotelService {
  private apiUrl = 'http://localhost:8081/hotels';

  constructor(private http: HttpClient) {}

  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.apiUrl);
  }

  searchHotelsByCity(city: string): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(`${this.apiUrl}/city/${city}`);
  }
  getHotelById(id: number): Observable<Hotel> {
    return this.http.get<Hotel>(`${this.apiUrl}/${id}`);
  }

  searchCities(query: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/cities/search?query=${query}`,
    );
  }
}
