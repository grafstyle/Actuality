import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowedComponent } from './home-followed.component';

describe('FollowedComponent', () => {
  let component: FollowedComponent;
  let fixture: ComponentFixture<FollowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FollowedComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FollowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
