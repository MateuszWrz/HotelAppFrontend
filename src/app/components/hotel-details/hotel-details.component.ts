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

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private hotelService: HotelService,
    private roomService: RoomService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.hotelId = +this.route.snapshot.params['id'];

    this.route.queryParams.subscribe((params) => {
      this.checkInDate = params['checkIn'] || '';
      this.checkOutDate = params['checkOut'] || '';
      this.guests = +params['guests'] || 1;
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
    this.roomService.getRoomsByHotel(this.hotelId).subscribe({
      next: (data) => {
        this.rooms = data;
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

  calculateTotalPrice(pricePerNight: number): number {
    return pricePerNight * this.calculateNights();
  }

  selectRoom(room: any): void {
    this.selectedRoom = room;
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
        })
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
}
