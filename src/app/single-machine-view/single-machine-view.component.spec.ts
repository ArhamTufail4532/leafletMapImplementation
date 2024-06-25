import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMachineViewComponent } from './single-machine-view.component';

describe('SingleMachineViewComponent', () => {
  let component: SingleMachineViewComponent;
  let fixture: ComponentFixture<SingleMachineViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleMachineViewComponent]
    });
    fixture = TestBed.createComponent(SingleMachineViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
