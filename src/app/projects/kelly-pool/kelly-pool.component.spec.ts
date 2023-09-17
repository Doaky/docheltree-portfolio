import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KellyPoolComponent } from './kelly-pool.component';

describe('KellyPoolComponent', () => {
  let component: KellyPoolComponent;
  let fixture: ComponentFixture<KellyPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KellyPoolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KellyPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
