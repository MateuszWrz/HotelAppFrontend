import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-resend-verify-code',
  templateUrl: './resend-verify-code.component.html',
  styleUrls: ['./resend-verify-code.component.css'],
})
export class ResendVerifyCodeComponent implements OnInit {
  email: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
