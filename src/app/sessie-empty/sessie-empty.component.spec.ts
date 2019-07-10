import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessieEmptyComponent } from './sessie-empty.component';

describe('SessieEmptyComponent', () => {
  let component: SessieEmptyComponent;
  let fixture: ComponentFixture<SessieEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SessieEmptyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessieEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
