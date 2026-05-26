import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyComponent } from './components/verify/verify.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile-component/profile-component.component';
import { ResendVerifyCodeComponent } from './components/resend-verify-code/resend-verify-code.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { HotelsListComponent } from './components/hotel-list/hotel-list.component';
import { HotelDetailsComponent } from './components/hotel-details/hotel-details.component';
import { BookingComponent } from './components/booking/booking.component';
import { ForgotPasswordComponent } from './components/passwordDetails/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/passwordDetails/reset-password/reset-password.component';
import { ForgotPasswordSentComponent } from './components/passwordDetails/forgot-password-sent/forgot-password-sent.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'register', component: RegisterComponent, canActivate: [LoginGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forgot-password/sent', component: ForgotPasswordSentComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'verify', component: VerifyComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'hotels', component: HotelsListComponent },
  { path: '', component: HomePageComponent },
  { path: 'hotels', component: HotelsListComponent },
  { path: 'hotel/:id', component: HotelDetailsComponent },
  { path: 'booking', component: BookingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'verify/sent', component: ResendVerifyCodeComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
