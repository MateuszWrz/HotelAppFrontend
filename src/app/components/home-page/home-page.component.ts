import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotelService } from '../service/hotel.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  destination: string = '';
  checkInDate: string = '';
  checkOutDate: string = '';
  guests: number = 1;
  today: string = '';
  suggestions: string[] = [];
  debounceTimeout: any;

  constructor(
    private router: Router,
    private hotelService: HotelService,
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.checkInDate = this.today;
    this.checkOutDate = tomorrow.toISOString().split('T')[0];
  }

  onSearch(event: {
    city: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }) {
    this.destination = event.city;
    this.checkInDate = event.checkIn;
    this.checkOutDate = event.checkOut;
    this.guests = event.guests;

    this.router.navigate(['/hotels'], {
      queryParams: {
        city: this.destination,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: this.guests,
      },
    });
  }

  isDateRangeValid(): boolean {
    if (!this.checkInDate || !this.checkOutDate) {
      return false;
    }
    return new Date(this.checkOutDate) > new Date(this.checkInDate);
  }

  searchHotels(): void {
    if (!this.destination.trim()) {
      alert('Proszę wpisać miasto');
      return;
    }

    if (!this.isDateRangeValid()) {
      alert('Proszę wybrać poprawne daty');
      return;
    }

    this.router.navigate(['/hotels'], {
      queryParams: {
        city: this.destination,
        checkIn: this.checkInDate,
        checkOut: this.checkOutDate,
        guests: this.guests,
      },
    });
  }

  quickSearch(city: string): void {
    this.destination = city;
    this.searchHotels();
  }
  onSearchChange() {
    clearTimeout(this.debounceTimeout);

    if (!this.destination || this.destination.length < 2) {
      this.suggestions = [];
      return;
    }

    this.debounceTimeout = setTimeout(() => {
      this.hotelService.searchCities(this.destination).subscribe((data) => {
        this.suggestions = data;
      });
    }, 300);
  }

  hideSuggestions() {
    setTimeout(() => (this.suggestions = []), 200);
  }
  selectCity(city: string) {
    this.destination = city;
    this.suggestions = [];
  }
}
