import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeForYouComponent } from './home-for-you.component';

describe('HomeForYouComponent', () => {
  let component: HomeForYouComponent;
  let fixture: ComponentFixture<HomeForYouComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeForYouComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeForYouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
