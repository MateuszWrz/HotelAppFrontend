import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent implements OnInit {
  email: string = '';
  token: string = '';
  serverMessage: string | null = null;
  success: boolean | null = null;
  loading: boolean = false;
  isSubmitting: boolean = false;
  isResendClicked: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email']; // ← zapisz do pola klasy
      this.token = params['token']; // ← zapisz do pola klasy

      if (this.email && this.token) {
        this.authService.verifyAccount(this.email, this.token).subscribe({
          next: (res: any) => {
            this.success = res.status === 'success';
            this.serverMessage = res.message;

            if (this.success) {
              setTimeout(() => this.router.navigate(['/login']), 5000);
            }
          },
          error: (err) => {
            this.success = false;
            this.serverMessage =
              err.error?.message || 'Błąd weryfikacji konta.';
          },
        });
      } else {
        this.success = false;
        this.serverMessage = 'Nieprawidłowy link weryfikacyjny.';
      }
    });
  }

  resendCode() {
    if (!this.email) return;

    this.isSubmitting = true;
    this.serverMessage = null;

    this.authService.resendVerification(this.email).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.router.navigate(['/verify/sent'], {
          queryParams: { email: this.email },
        });
      },
      error: (err) => {
        this.serverMessage =
          err.error?.message || 'Wystąpił błąd podczas wysyłania kodu';
        this.isSubmitting = false;
      },
    });
  }
}
