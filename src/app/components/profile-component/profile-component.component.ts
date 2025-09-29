import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ReservationService } from '../service/reservation.service';
import { ReservationDTO } from '../models/reservation.model';
import { User } from '../models/user.model';

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  activeTab: 'myData' | 'history' | 'myReservations' = 'myData';
  historyReservations: ReservationDTO[] = [];
  activeReservations: ReservationDTO[] = [];
  editMode: { [key: string]: boolean } = {};
  editForm!: FormGroup;
  loading = false;
  error: string | null = null;

  userFields = [
    {
      key: 'email',
      label: 'Adres e-mail',
      placeholder: 'Podaj email',
      editable: false,
    },
    {
      key: 'name',
      label: 'Imię',
      placeholder: 'Podaj swoje imię',
      editable: true,
    },
    {
      key: 'lastName',
      label: 'Nazwisko',
      placeholder: 'Podaj swoje nazwisko',
      editable: true,
    },
    {
      key: 'phoneNumber',
      label: 'Numer telefonu',
      placeholder: 'Dodaj numer telefonu',
      editable: true,
    },
    {
      key: 'country',
      label: 'Narodowość',
      placeholder: 'Podaj swój kraj',
      editable: true,
    },
    {
      key: 'city',
      label: 'Miasto',
      placeholder: 'Podaj miasto',
      editable: true,
    },
    {
      key: 'address',
      label: 'Adres',
      placeholder: 'Podaj nazwę ulicy i numer domu lub mieszkania',
      editable: true,
    },
    {
      key: 'zipCode',
      label: 'Kod pocztowy',
      placeholder: 'Dodaj swój kod pocztowy',
      editable: true,
    },
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder
  ) {}

  getUserFieldValue(fieldKey: string): any {
    if (!this.user) return null;
    return (this.user as any)[fieldKey];
  }

  setUserFieldValue(fieldKey: string, value: any): void {
    if (!this.user) return;
    (this.user as any)[fieldKey] = value;
  }

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData() {
    this.loading = true;
    this.error = null;

    this.http.get<User>('http://localhost:8081/user').subscribe({
      next: (data) => {
        this.user = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading user:', err);
        this.error = 'Nie udało się pobrać danych użytkownika';
        this.loading = false;
      },
    });
  }

  loadHistoryReservations() {
    this.loading = true;
    this.error = null;

    this.reservationService.getHistoryReservations().subscribe({
      next: (data) => {
        console.log('Historia rezerwacji:', data);
        this.historyReservations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading history:', err);
        this.error = 'Nie udało się pobrać historii rezerwacji';
        this.loading = false;
      },
    });
  }

  loadActiveReservations() {
    this.loading = true;
    this.error = null;

    this.reservationService.getActiveReservations().subscribe({
      next: (data) => {
        console.log('Aktywne rezerwacje:', data);
        this.activeReservations = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading reservations:', err);
        this.error = 'Nie udało się pobrać aktywnych rezerwacji';
        this.loading = false;
      },
    });
  }

  selectTab(tab: 'myData' | 'history' | 'myReservations') {
    this.activeTab = tab;
    this.error = null;

    if (tab === 'history') {
      this.loadHistoryReservations();
    }
    if (tab === 'myReservations') {
      this.loadActiveReservations();
    }
  }

  toggleEdit(key: string) {
    this.editMode[key] = !this.editMode[key];

    if (!this.editMode[key]) {
      this.loadUserData();
    }
  }

  anyFieldEditing(): boolean {
    return Object.values(this.editMode).some((v) => v);
  }

  saveUserData() {
    if (!this.user) return;

    this.loading = true;
    this.error = null;

    this.http.put<User>('http://localhost:8081/user', this.user).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        Object.keys(this.editMode).forEach((k) => (this.editMode[k] = false));
        this.loading = false;
      },
      error: (err) => {
        console.error('Błąd zapisu', err);
        this.error = 'Nie udało się zapisać danych';
        this.loading = false;
      },
    });
  }

  formatDate(date: string): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  calculateNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  cancelReservation(reservation: ReservationDTO) {
    if (
      confirm(
        `Czy na pewno chcesz anulować rezerwację nr ${reservation.reservationNumber}?`
      )
    ) {
      this.loading = true;

      this.reservationService.cancelReservation(reservation.id).subscribe({
        next: () => {
          this.loadActiveReservations();
        },
        error: (err) => {
          console.error('Błąd anulowania:', err);
          this.loading = false;
        },
      });
    }
  }

  isUpcoming(checkInDate: string): boolean {
    return new Date(checkInDate) > new Date();
  }

  isPast(checkOutDate: string): boolean {
    return new Date(checkOutDate) < new Date();
  }
}
