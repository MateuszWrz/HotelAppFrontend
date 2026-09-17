import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  token: string = '';
  message: string = '';
  error: string = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(4)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatch },
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.error = 'Nieprawidłowy link resetu hasła.';
      }
    });
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid || !this.token) {
      this.form.markAllAsTouched();
      if (!this.token) {
        this.error = 'Nieprawidłowy link resetu hasła.';
      }
      return;
    }

    this.isSubmitting = true;
    this.error = '';
    this.message = '';

    const newPassword = this.form.get('newPassword')?.value;

    this.message = 'Trwa resetowanie hasła...';

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (res) => {
        this.message = 'Hasło zostało zmienione.';
        this.isSubmitting = false;
        this.form.reset();

        // setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err: HttpErrorResponse) => {
        console.log('ERROR:', err);
        this.isSubmitting = false;
        this.message = '';
        if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else {
          this.error = 'Wystąpił błąd podczas resetu hasła.';
        }
      },
    });
  }

  get newPassword() {
    return this.form.get('newPassword');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
}
