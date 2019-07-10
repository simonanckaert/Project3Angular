import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AankondigingenComponentDialog } from './aankondigingdialog.component';

describe('AankondigingenComponent', () => {
  let component: AankondigingenComponentDialog;
  let fixture: ComponentFixture<AankondigingenComponentDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AankondigingenComponentDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AankondigingenComponentDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});