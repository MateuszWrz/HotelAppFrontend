import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { HotelService } from '../service/hotel.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
  @Input() destination: string = '';
  @Output() destinationChange = new EventEmitter<string>();

  @Input() checkInDate: string = '';
  @Output() checkInDateChange = new EventEmitter<string>();

  @Input() checkOutDate: string = '';
  @Output() checkOutDateChange = new EventEmitter<string>();

  @Input() guests: number = 1;
  @Output() guestsChange = new EventEmitter<number>();

  @Input() disableDestination: boolean = false;

  @Output() search = new EventEmitter<{
    city: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  }>();

  cityError: boolean = false;
  today: string = '';
  suggestions: string[] = [];
  debounceTimeout: any;

  constructor(private hotelService: HotelService) {}

  ngOnInit(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const todayStr = now.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (!this.checkInDate || new Date(this.checkInDate) < now) {
      this.checkInDate = todayStr;
    }

    if (
      !this.checkOutDate ||
      new Date(this.checkOutDate) <= new Date(this.checkInDate)
    ) {
      this.checkOutDate = tomorrowStr;
    }

    this.today = todayStr;
  }

  onDestinationChange(value: string) {
    this.destination = value;
    this.destinationChange.emit(value);
    this.cityError = false;
    this.onSearchInput();
  }

  isDateRangeValid(): boolean {
    if (!this.checkInDate || !this.checkOutDate) return false;
    return new Date(this.checkOutDate) > new Date(this.checkInDate);
  }

  onSearchInput() {
    if (this.disableDestination) return;

    clearTimeout(this.debounceTimeout);
    if (!this.destination || this.destination.length < 2) {
      this.suggestions = [];
      return;
    }

    this.debounceTimeout = setTimeout(() => {
      this.hotelService.searchCities(this.destination).subscribe((data) => {
        this.suggestions = data;
      });
    }, 50);
  }

  hideSuggestions() {
    setTimeout(() => (this.suggestions = []), 200);
  }

  selectCity(city: string) {
    if (this.disableDestination) return;
    this.destination = city;
    this.destinationChange.emit(city);
    this.suggestions = [];
  }

  submitSearch() {
    this.cityError = false;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (!this.disableDestination && !this.destination.trim()) {
      this.cityError = true;
      return;
    }

    if (new Date(this.checkInDate) < now) {
      this.checkInDate = todayStr;
      this.checkInDateChange.emit(this.checkInDate);
    }

    if (new Date(this.checkOutDate) <= new Date(this.checkInDate)) {
      this.checkOutDate = tomorrowStr;
      this.checkOutDateChange.emit(this.checkOutDate);
    }

    if (!this.isDateRangeValid()) {
      return;
    }

    this.search.emit({
      city: this.destination,
      checkIn: this.checkInDate,
      checkOut: this.checkOutDate,
      guests: this.guests,
    });
  }
}
