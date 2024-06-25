import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeafletDashboardComponent } from './leaflet-dashboard.component';

describe('LeafletDashboardComponent', () => {
  let component: LeafletDashboardComponent;
  let fixture: ComponentFixture<LeafletDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeafletDashboardComponent]
    });
    fixture = TestBed.createComponent(LeafletDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
