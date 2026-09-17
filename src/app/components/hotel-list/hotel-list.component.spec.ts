import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsListComponent } from './hotel-list.component';

describe('HotelListComponent', () => {
  let component: HotelsListComponent;
  let fixture: ComponentFixture<HotelsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HotelsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HotelsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
