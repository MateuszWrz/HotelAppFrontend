import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent implements OnInit, OnDestroy {
  email: string = '';
  token: string = '';
  serverMessage: string | null = null;
  success: boolean | null = null;
  loading: boolean = false;
  isSubmitting: boolean = false;
  isResendClicked: boolean = false;

  redirectCountdown: number = 5;
  private countdownSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';

      if (!this.token) {
        this.success = false;
        this.serverMessage = 'Nieprawidłowy link weryfikacyjny.';
        return;
      }

      this.loading = true;
      this.authService.verifyAccount(this.token).subscribe({
        next: (res: any) => {
          this.loading = false;
          this.success = res.status === 'success';
          this.serverMessage = res.message;
        },
        error: (err) => {
          this.loading = false;
          this.success = false;
          if (err.error?.status && err.error?.message) {
            this.serverMessage = err.error.message;
          } else {
            this.serverMessage =
              err.error?.message || 'Nie udało się aktywować konta';
          }
          this.isResendClicked = false;
        },
      });
    });
  }

  startRedirectCountdown() {
    this.countdownSub = interval(1000).subscribe(() => {
      if (this.redirectCountdown > 0) {
        this.redirectCountdown--;
      } else {
        this.countdownSub?.unsubscribe();
        this.router.navigate(['/login']);
      }
    });
  }

  resendCode() {
    if (!this.email) {
      alert('Nie udało się wysłać kodu – brak adresu email.');
      return;
    }

    this.isSubmitting = true;
    this.serverMessage = null;

    this.authService.resendVerification(this.email).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.isResendClicked = true;
        this.serverMessage = res;
      },
      error: (err) => {
        this.serverMessage =
          err.error?.message || 'Wystąpił błąd podczas wysyłania kodu';
        this.isSubmitting = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.countdownSub?.unsubscribe();
  }
}
