import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ReservationService } from '../service/reservation.service';
import { ReservationDTO } from '../models/reservation.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { FavoriteService, FavoriteHotel } from '../service/favorite.service';

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.css'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  activeTab: 'myData' | 'history' | 'myReservations' | 'favorites' = 'myData';
  historyReservations: ReservationDTO[] = [];
  activeReservations: ReservationDTO[] = [];
  editMode: { [key: string]: boolean } = {};
  loading = false;
  error: string | null = null;
  showConfirmModal: boolean = false;
  showCancelModal: boolean = false;
  showCannotCancelModal = false;
  showCancelSuccessModal = false;
  pendingReservation: ReservationDTO | null = null;
  canceledReservationNumber: string = '';
  favorites: any[] = [];

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
      placeholder: 'Podaj numer telefonu',
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
    private reservationService: ReservationService,
    private router: Router,
    private favoriteService: FavoriteService,
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

    this.http.get<User>('https://hotel-backend-1-0.onrender.com/user').subscribe({
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
        this.historyReservations = data;
        this.loading = false;
      },
      error: (err) => {
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
        this.activeReservations = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Nie udało się pobrać aktywnych rezerwacji';
        this.loading = false;
      },
    });
  }

  selectTab(tab: 'myData' | 'history' | 'myReservations' | 'favorites') {
    this.activeTab = tab;
    this.error = null;

    if (tab === 'history') {
      this.loadHistoryReservations();
    }
    if (tab === 'myReservations') {
      this.loadActiveReservations();
    }
    if (tab === 'favorites') {
      this.loadFavoriteHotels();
    }
  }

  loadFavoriteHotels() {
    this.favoriteService.getFavorites().subscribe({
      next: (favorites: FavoriteHotel[]) => {
        this.favorites = favorites;
        this.loading = false;
      },
      error: (err) => {
        console.error('Błąd pobierania ulubionych:', err);
        this.error = 'Nie udało się pobrać ulubionych hoteli';
        this.loading = false;
      },
    });
  }

  viewHotel(hotelId: number) {
    this.router.navigate(['/hotel', hotelId]);
  }

  removeFavorite(hotelId: number) {
    this.favoriteService.remove(hotelId).subscribe({
      next: () => {
        this.favorites = this.favorites.filter((h) => h.id !== hotelId);
      },
      error: (err) => {
        console.error('Nie udało się usunąć hotelu z ulubionych', err);
      },
    });
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

    this.http.put<User>('https://hotel-backend-1-0.onrender.com/user', this.user).subscribe({
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

  canCancelReservation(checkInDate: string): boolean {
    const today = new Date();
    const checkIn = new Date(checkInDate);

    const diffTime = checkIn.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    return diffDays >= 2;
  }

  calculateNights(checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  openCancelModal(reservation: ReservationDTO) {
    this.pendingReservation = reservation;

    if (this.canCancelReservation(reservation.checkInDate)) {
      this.showConfirmModal = true;
    } else {
      this.showCannotCancelModal = true;
    }
  }

  closeConfirmModal() {
    this.showConfirmModal = false;
    this.pendingReservation = null;
  }

  confirmCancelReservation() {
    if (!this.pendingReservation) return;

    this.reservationService
      .cancelReservation(this.pendingReservation.id)
      .subscribe({
        next: () => {
          this.activeReservations = this.activeReservations.filter(
            (r) => r.id !== this.pendingReservation?.id,
          );

          this.showConfirmModal = false;
          this.showCancelSuccessModal = true;

          this.pendingReservation = null;
        },
        error: () => {
          alert('Nie udało się anulować rezerwacji');
        },
      });
  }

  closeCannotCancelModal() {
    this.showCannotCancelModal = false;
  }

  closeCancelSuccessModal() {
    this.showCancelSuccessModal = false;
  }

  isUpcoming(checkInDate: string): boolean {
    return new Date(checkInDate) > new Date();
  }

  isPast(checkOutDate: string): boolean {
    return new Date(checkOutDate) < new Date();
  }
}
