import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../service/auth.service';

interface ReservationRequest {
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
}

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css'],
})
export class BookingComponent implements OnInit {
  roomId!: number;
  hotelId!: number;
  checkInDate!: string;
  checkOutDate!: string;
  guests!: number;

  room: any = null;
  hotel: any = null;
  user: any = null;
  totalPrice: number = 0;
  numberOfNights: number = 0;

  loading = false;
  error: string | null = null;
  bookingConfirmed = false;
  reservationNumber: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['roomId']) {
        this.roomId = +params['roomId'];
        this.hotelId = +params['hotelId'];
        this.checkInDate = params['checkIn'];
        this.checkOutDate = params['checkOut'];
        this.guests = +params['guests'] || 1;
      } else {
        const pendingReservation = sessionStorage.getItem('pendingReservation');
        if (pendingReservation) {
          const data = JSON.parse(pendingReservation);
          this.roomId = data.roomId;
          this.hotelId = data.hotelId;
          this.checkInDate = data.checkInDate;
          this.checkOutDate = data.checkOutDate;
          this.guests = data.guests;
          sessionStorage.removeItem('pendingReservation');
        } else {
          this.router.navigate(['/']);
          return;
        }
      }
    });

    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    this.http.get('http://localhost:8081/user').subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => console.error('Error loading user:', err),
    });

    this.http.get(`http://localhost:8081/room/${this.roomId}`).subscribe({
      next: (room: any) => {
        this.room = room;
        this.calculateTotalPrice();
        this.loadHotelData();
      },
      error: (err) => {
        this.error = 'Nie udało się pobrać danych pokoju';
        this.loading = false;
      },
    });
  }

  loadHotelData(): void {
    this.http.get(`http://localhost:8081/hotels/${this.hotelId}`).subscribe({
      next: (hotel) => {
        this.hotel = hotel;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading hotel:', err);
        this.loading = false;
      },
    });
  }

  calculateTotalPrice(): void {
    if (!this.checkInDate || !this.checkOutDate || !this.room) return;

    const start = new Date(this.checkInDate);
    const end = new Date(this.checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    this.numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.totalPrice = this.room.pricePerNight * this.numberOfNights;
  }

  confirmBooking(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.user?.name || !this.user?.lastName) {
      this.error = 'Podaj imię i nazwisko przed dokonaniem rezerwacji.';
      return;
    }

    if (!this.user?.phoneNumber) {
      this.error = 'Podaj numer telefonu przed dokonaniem rezerwacji.';
      return;
    }

    this.loading = true;
    this.error = null;

    const reservationRequest: ReservationRequest = {
      roomId: this.roomId,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate,
    };

    this.http
      .post('http://localhost:8081/reservations', reservationRequest)
      .subscribe({
        next: (response: any) => {
          this.bookingConfirmed = true;
          this.reservationNumber = response.reservationNumber;
          this.loading = false;

          // setTimeout(() => {
          //   this.router.navigate(['/profile'], {
          //     queryParams: { tab: 'myReservations' },
          //   });
          // }, 3000);
        },

        error: (err: HttpErrorResponse) => {
          if (err.status === 409) {
            this.error =
              'Ten pokój został właśnie zarezerwowany przez innego użytkownika.';
          } else if (err.status === 401) {
            this.error = 'Sesja wygasła. Zaloguj się ponownie.';
            this.router.navigate(['/login']);
          } else if (err.status === 400) {
            this.error = 'Nieprawidłowe dane rezerwacji.';
          } else {
            this.error = 'Nie udało się dokonać rezerwacji. Spróbuj ponownie.';
          }

          this.loading = false;
          console.error('Booking error:', err);
        },
      });
  }

  isUserDataValid(): boolean {
    return !!(this.user?.name && this.user?.lastName && this.user?.phoneNumber);
  }

  goBack(): void {
    this.router.navigate(['/hotel', this.hotelId], {
      queryParams: {
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: this.guests,
      },
    });
  }
}
