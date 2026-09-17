import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  // private apiUrl = 'http://localhost:8081';
   private apiUrl = 'https://hotel-backend-1-0.onrender.com';

  constructor(private http: HttpClient) {}

  getRoomsByHotel(
    hotelId: number,
    guests: number,
    checkIn: string,
    checkOut: string,
  ) {
    return this.http.get<any[]>(
      `https://hotel-backend-1-0.onrender.com/${hotelId}/rooms`,
      {
        params: {
          guests,
          checkIn,
          checkOut,
        },
      },
    );
  }

  getRoomById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rooms/${id}`);
  }
}
