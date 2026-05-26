import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService } from '../service/hotel.service';
import { RoomService } from '../service/room.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-hotel-details',
  templateUrl: './hotel-details.component.html',
  styleUrls: ['./hotel-details.component.css'],
})
export class HotelDetailsComponent implements OnInit {
  hotelId!: number;
  hotel: any = null;
  rooms: any[] = [];
  checkInDate: string = '';
  checkOutDate: string = '';
  guests: number = 1;
  loading = false;
  selectedRoom: any = null;

  sortOption: 'priceAsc' | 'priceDesc' = 'priceAsc';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private hotelService: HotelService,
    private roomService: RoomService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.hotelId = +this.route.snapshot.params['id'];

    this.route.queryParams.subscribe((params) => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      this.checkInDate =
        params['checkIn'] && new Date(params['checkIn']) >= today
          ? params['checkIn']
          : todayStr;
      this.checkOutDate =
        params['checkOut'] &&
        new Date(params['checkOut']) > new Date(this.checkInDate)
          ? params['checkOut']
          : tomorrowStr;

      this.guests = +params['guests'] || 1;

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          checkIn: this.checkInDate,
          checkOut: this.checkOutDate,
          guests: this.guests,
        },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    });

    this.loadHotelDetails();
    this.loadRooms();
  }

  loadHotelDetails(): void {
    this.loading = true;
    this.hotelService.getHotelById(this.hotelId).subscribe({
      next: (data) => {
        this.hotel = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading hotel:', err);
        this.loading = false;
      },
    });
  }

  loadRooms(): void {
    this.roomService
      .getRoomsByHotel(
        this.hotelId,
        this.guests,
        this.checkInDate,
        this.checkOutDate,
      )
      .subscribe({
        next: (data) => {
          this.rooms = data;
          this.sortRooms();
        },
        error: (err) => {
          console.error('Error loading rooms:', err);
        },
      });
  }

  calculateNights(): number {
    if (!this.checkInDate || !this.checkOutDate) return 0;
    const start = new Date(this.checkInDate);
    const end = new Date(this.checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  calculateTotalPrice(pricePerNight: number): string {
    const total = pricePerNight * this.calculateNights();
    return total.toFixed(2);
  }

  formatPrice(price: number): string {
    return price.toFixed(2);
  }

  selectRoom(room: any): void {
    this.selectedRoom = room;
  }

  onFilterChange(): void {
    if (!this.checkInDate || !this.checkOutDate || this.guests < 1) {
      return;
    }
    this.loadRooms();
  }

  bookRoom(room: any): void {
    if (!this.authService.isLoggedIn()) {
      sessionStorage.setItem(
        'pendingReservation',
        JSON.stringify({
          roomId: room.id,
          hotelId: this.hotelId,
          checkInDate: this.checkInDate,
          checkOutDate: this.checkOutDate,
          guests: this.guests,
        }),
      );

      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/booking' },
      });
      return;
    }

    this.router.navigate(['/booking'], {
      queryParams: {
        roomId: room.id,
        hotelId: this.hotelId,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: this.guests,
      },
    });
  }

  onSearch(event: {
    city: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) {
    this.checkInDate = event.checkIn;
    this.checkOutDate = event.checkOut;
    this.guests = event.guests;
    this.loadRooms();
  }

  sortRooms(): void {
    this.rooms = [...this.rooms].sort((a, b) => {
      if (a.available !== b.available) {
        return a.available ? -1 : 1;
      }

      if (this.sortOption === 'priceAsc') {
        return a.pricePerNight - b.pricePerNight;
      } else {
        return b.pricePerNight - a.pricePerNight;
      }
    });
  }

  onSortChange(value: string): void {
    this.sortOption = value as 'priceAsc' | 'priceDesc';
    this.sortRooms();
  }
}
