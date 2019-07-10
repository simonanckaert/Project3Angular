import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerwijderAlertComponent } from './verwijder-alert.component';

describe('VerwijderAlertComponent', () => {
  let component: VerwijderAlertComponent;
  let fixture: ComponentFixture<VerwijderAlertComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerwijderAlertComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerwijderAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
