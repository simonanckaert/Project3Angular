import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BerichtenComponent } from './berichten.component';

describe('BerichtenComponent', () => {
  let component: BerichtenComponent;
  let fixture: ComponentFixture<BerichtenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BerichtenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BerichtenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
