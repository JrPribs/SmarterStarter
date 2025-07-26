import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookAuthButtonComponent } from './facebook-auth-button.component';

describe('FacebookAuthButtonComponent', () => {
  let component: FacebookAuthButtonComponent;
  let fixture: ComponentFixture<FacebookAuthButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ FacebookAuthButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookAuthButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
