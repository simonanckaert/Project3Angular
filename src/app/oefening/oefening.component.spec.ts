import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OefeningComponent } from './oefening.component';

describe('OefeningComponent', () => {
  let component: OefeningComponent;
  let fixture: ComponentFixture<OefeningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OefeningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OefeningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
