import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaPostsComponent } from './multimedia-posts.component';

describe('MultimediaPostsComponent', () => {
  let component: MultimediaPostsComponent;
  let fixture: ComponentFixture<MultimediaPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MultimediaPostsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultimediaPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
