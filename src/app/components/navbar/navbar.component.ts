import { Component, OnInit, HostListener } from '@angular/core';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(public authService: AuthService) {}

  menuIsOpen = false;

  ngOnInit(): void {}

  toggleMenu() {
    this.menuIsOpen = !this.menuIsOpen;
  }

  closeMenu() {
    this.menuIsOpen = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const w = (event.target as Window).innerWidth;
    if (w > 768 && this.menuIsOpen) {
      this.closeMenu();
    }
  }
}
