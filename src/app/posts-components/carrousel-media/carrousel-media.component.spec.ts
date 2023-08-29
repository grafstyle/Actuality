import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrouselMediaComponent } from './carrousel-media.component';

describe('CarrouselMediaComponent', () => {
  let component: CarrouselMediaComponent;
  let fixture: ComponentFixture<CarrouselMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CarrouselMediaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrouselMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
