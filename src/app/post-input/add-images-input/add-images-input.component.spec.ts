import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImagesInputComponent } from './add-images-input.component';

describe('AddImagesInputComponent', () => {
  let component: AddImagesInputComponent;
  let fixture: ComponentFixture<AddImagesInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddImagesInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddImagesInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
