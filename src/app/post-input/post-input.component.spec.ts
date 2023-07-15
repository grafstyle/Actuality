import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostInputComponent } from './post-input.component';

describe('PostInputComponent', () => {
  let component: PostInputComponent;
  let fixture: ComponentFixture<PostInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PostInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
