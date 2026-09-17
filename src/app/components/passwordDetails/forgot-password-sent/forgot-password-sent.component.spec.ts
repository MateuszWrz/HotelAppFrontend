import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordSentComponent } from './forgot-password-sent.component';

describe('ForgotPasswordSentComponent', () => {
  let component: ForgotPasswordSentComponent;
  let fixture: ComponentFixture<ForgotPasswordSentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotPasswordSentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordSentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
