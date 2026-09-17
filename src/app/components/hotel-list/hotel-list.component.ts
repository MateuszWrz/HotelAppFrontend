import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService, Hotel } from '../service/hotel.service';
import { FavoriteService, FavoriteHotel } from '../service/favorite.service';
import { AuthService } from '../service/auth.service';
import { SearchEvent } from '../models/search.models';

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
  today: string = '';
  tomorrow: string = '';
  isLoggedIn = false;
  hasSearched = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hotelService: HotelService,
    private favoriteService: FavoriteService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.today = now.toISOString().split('T')[0];

    const tomorrowDate = new Date(now);
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    this.tomorrow = tomorrowDate.toISOString().split('T')[0];

    this.route.queryParams.subscribe((params) => {
      this.city = params['city'] || '';
      this.checkInDate = params['checkIn'] || this.today;
      this.checkOutDate = params['checkOut'] || this.tomorrow;
      this.guests = +params['guests'] || 1;

      if (this.city) {
        this.hasSearched = true;
        this.loading = true;
        this.fetchHotels(this.city);
      }
    });
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  onSearch(event: SearchEvent) {
    this.city = event.city;
    this.checkInDate = event.checkIn;
    this.checkOutDate = event.checkOut;
    this.guests = event.guests;

    this.hasSearched = true;
    this.loading = true;

    this.fetchHotels(this.city);
  }

  // onSearch(searchData: {
  //   city: string;
  //   checkIn: string;
  //   checkOut: string;
  //   guests: number;
  // }) {
  //   this.city = searchData.city;
  //   this.checkInDate = searchData.checkIn;
  //   this.checkOutDate = searchData.checkOut;
  //   this.guests = searchData.guests;

  //   this.hasSearched = true;
  //   this.loading = true;

  //   this.fetchHotels(this.city);
  // }

  // fetchHotels(city: string): void {
  //   this.hotelService.searchHotelsByCity(city).subscribe({
  //     next: (data) => {
  //       this.hotels = data.map((hotel) => ({ ...hotel, isFavorite: false }));

  //       if (this.authService.isLoggedIn()) {
  //         this.favoriteService.getFavorites().subscribe({
  //           next: (favoriteHotels: FavoriteHotel[]) => {
  //             const favoriteHotelIds = favoriteHotels.map((f) => f.id);
  //             this.hotels.forEach((hotel) => {
  //               hotel.isFavorite = favoriteHotelIds.includes(hotel.id);
  //             });
  //           },
  //           error: (err) => console.error('Błąd pobierania ulubionych:', err),
  //         });
  //       }

  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.error = 'Nie udało się pobrać hoteli.';
  //       this.loading = false;
  //     },
  //   });
  // }

  fetchHotels(city: string): void {
    this.loading = true;
    this.error = null;

    this.hotelService.searchHotelsByCity(city).subscribe({
      next: (data) => {
        this.hotels = data.map((hotel) => ({ ...hotel, isFavorite: false }));

        if (this.authService.isLoggedIn()) {
          this.favoriteService.getFavorites().subscribe({
            next: (favoriteHotels: FavoriteHotel[]) => {
              const favoriteHotelIds = favoriteHotels.map((f) => f.id);

              this.hotels.forEach((hotel) => {
                hotel.isFavorite = favoriteHotelIds.includes(hotel.id);
              });
            },
          });
        }

        this.loading = false;
      },
      error: () => {
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

  toggleFavorite(hotel: Hotel) {
    if (!this.authService.isLoggedIn()) {
      alert('Musisz być zalogowany, aby dodać hotel do ulubionych.');
      return;
    }

    if (hotel.isFavorite) {
      this.favoriteService.remove(hotel.id).subscribe({
        next: (res) => {
          hotel.isFavorite = false;
          console.log(res.message);
        },
        error: (err) => console.error('Błąd usuwania z ulubionych:', err),
      });
    } else {
      this.favoriteService.add(hotel.id).subscribe({
        next: (res) => {
          hotel.isFavorite = true;
          console.log(res.message);
        },
        error: (err) => console.error('Błąd dodawania do ulubionych:', err),
      });
    }
  }

  trackByHotelId(index: number, hotel: any) {
    return hotel.id;
  }
}
