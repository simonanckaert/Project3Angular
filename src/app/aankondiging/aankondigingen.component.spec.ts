import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AankondigingenComponent } from './aankondigingen.component';

describe('AankondigingenComponent', () => {
  let component: AankondigingenComponent;
  let fixture: ComponentFixture<AankondigingenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AankondigingenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AankondigingenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});