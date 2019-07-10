import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OefeningEmptyComponent } from './oefening-empty.component';

describe('OefeningEmptyComponent', () => {
  let component: OefeningEmptyComponent;
  let fixture: ComponentFixture<OefeningEmptyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OefeningEmptyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OefeningEmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
