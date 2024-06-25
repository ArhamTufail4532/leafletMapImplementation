import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleMachineViewExtendComponent } from './single-machine-view-extend.component';

describe('SingleMachineViewExtendComponent', () => {
  let component: SingleMachineViewExtendComponent;
  let fixture: ComponentFixture<SingleMachineViewExtendComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SingleMachineViewExtendComponent]
    });
    fixture = TestBed.createComponent(SingleMachineViewExtendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
