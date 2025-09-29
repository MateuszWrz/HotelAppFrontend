import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  ngOnInit(): void {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.checkInDate = this.today;
    this.checkOutDate = tomorrow.toISOString().split('T')[0];
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
}
