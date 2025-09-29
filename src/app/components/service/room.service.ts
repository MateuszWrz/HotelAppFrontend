import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  getRoomsByHotel(hotelId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/hotels/${hotelId}/rooms`);
  }

  getRoomById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rooms/${id}`);
  }
}
