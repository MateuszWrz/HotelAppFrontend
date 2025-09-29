import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HotelService, Hotel } from '../service/hotel.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hotels-list',
  templateUrl: './hotel-list.component.html',
  styleUrls: ['./hotel-list.component.css'],
})
export class HotelsListComponent implements OnInit {
  city: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  guests: number = 1;
  hotels: Hotel[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.city = params['city'] || '';
      this.checkInDate = params['checkIn'] || '';
      this.checkOutDate = params['checkOut'] || '';
      this.guests = +params['guests'] || 1;

      if (this.city) {
        this.fetchHotels(this.city);
      }
    });
  }

  fetchHotels(city: string): void {
    this.loading = true;
    this.error = null;

    this.hotelService.searchHotelsByCity(city).subscribe({
      next: (data) => {
        this.hotels = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Nie udało się pobrać hoteli.';
        this.loading = false;
      },
    });
  }

  goToHotelDetails(hotelId: number): void {
    this.router.navigate(['/hotel', hotelId], {
      queryParams: {
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: this.guests,
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
}
