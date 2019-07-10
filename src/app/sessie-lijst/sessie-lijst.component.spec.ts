import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessieLijstComponent } from './sessie-lijst.component';

describe('SessieLijstComponent', () => {
  let component: SessieLijstComponent;
  let fixture: ComponentFixture<SessieLijstComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessieLijstComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessieLijstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
