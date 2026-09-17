// services/reservation.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationDTO } from '../models/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private apiUrl = 'http://localhost:8081';

  constructor(private http: HttpClient) {}

  getActiveReservations(): Observable<ReservationDTO[]> {
    return this.http.get<ReservationDTO[]>(
      `${this.apiUrl}/my/reservations/active`
    );
  }

  getHistoryReservations(): Observable<ReservationDTO[]> {
    return this.http.get<ReservationDTO[]>(
      `${this.apiUrl}/my/reservations/history`
    );
  }

  cancelReservation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservations/${id}`);
  }
}
