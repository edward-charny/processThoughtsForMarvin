import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Component } from '@angular/core';

// Add mock component
@Component({
  selector: 'app-process-thought',
  template: ''
})
class MockProcessThoughtComponent {}

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule, MatToolbarModule],
    declarations: [
      AppComponent,
      MockProcessThoughtComponent  // Add mock component to declarations
    ]
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'processThoughtsForMarvin'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('processThoughtsForMarvin');
  });

  it('should render toolbar with correct text', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('mat-toolbar span')?.textContent).toContain('Additional Interface');
  });

  it('should render the Amazing Marvin logo', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const logo = compiled.querySelector('img.logo');
    expect(logo).toBeTruthy();
    expect(logo?.getAttribute('alt')).toBe('Amazing Marvin');
  });
});
