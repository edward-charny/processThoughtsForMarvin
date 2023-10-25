import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessThoughtComponent } from './process-thought.component';

describe('ProcessThoughtComponent', () => {
  let component: ProcessThoughtComponent;
  let fixture: ComponentFixture<ProcessThoughtComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessThoughtComponent]
    });
    fixture = TestBed.createComponent(ProcessThoughtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
