import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KellypoolComponent } from './kellypool.component';

describe('KellypoolComponent', () => {
  let component: KellypoolComponent;
  let fixture: ComponentFixture<KellypoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KellypoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KellypoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
