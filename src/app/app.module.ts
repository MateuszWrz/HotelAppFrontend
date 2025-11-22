import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RegisterComponent } from './components/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './components/login/login.component';
import { AuthInterceptor } from './components/interceptor/auth.interceptor';
import { ProfileComponent } from './components/profile-component/profile-component.component';
import { LogoutComponent } from './components/logout/logout.component';
import { HotelsListComponent } from './components/hotel-list/hotel-list.component';
import { HotelDetailsComponent } from './components/hotel-details/hotel-details.component';
import { BookingComponent } from './components/booking/booking.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResendVerifyCodeComponent } from './components/resend-verify-code/resend-verify-code.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    LogoutComponent,
    HotelsListComponent,
    HotelDetailsComponent,
    BookingComponent,
    VerifyComponent,
    ResendVerifyCodeComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
