import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  isSubmitting = false;
  serverMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassowd = form.get('confirmPassword')?.value;
    return password === confirmPassowd ? null : { passwordMismatch: true };
  }

  register() {
    if (this.registerForm.invalid || this.isSubmitting) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.serverMessage = 'Na Twój email został wysłany link aktywacyjny.';

    this.http
      .post('https://hotel-backend-1-0.onrender.com/register', this.registerForm.value, {
        responseType: 'text',
      })
      .subscribe({
        next: (res: string) => {
          console.log('Rejestracja wysłana:', res);
          this.registerForm.reset();
          this.isSubmitting = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Błąd rejestracji', err);
          if (err.error && typeof err.error === 'object' && err.error.message) {
            this.serverMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            this.serverMessage = err.error;
          } else {
            this.serverMessage = 'Wystąpił błąd serwera';
          }
          this.isSubmitting = false;
        },
      });
  }
}
