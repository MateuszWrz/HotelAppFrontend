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

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassowd = form.get('confirmPassword')?.value;
    return password === confirmPassowd ? null : { passwordMismatch: true };
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.serverMessage = null;

    this.http
      .post('http://localhost:8081/register', this.registerForm.value, {
        responseType: 'text',
      })
      .subscribe({
        next: (res: string) => {
          this.serverMessage = res;
          this.registerForm.reset();
          this.isSubmitting = false;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Błąd rejestracji', err);
          this.serverMessage = err.error || 'Wystąpił błąd serwera';
          this.isSubmitting = false;
        },
      });
  }
}
