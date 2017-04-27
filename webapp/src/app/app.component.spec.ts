import { TestBed, async } from '@angular/core/testing';

import { UserService, AuthStatus } from './user.service';
import { AppComponent } from './app.component';
import { ProfileComponent } from './profile/profile.component';
import { LunchComponent } from './lunch/lunch.component';
import { Profile } from './types'
import { routes } from        './app.router';

import { Observable } from 'rxjs/Observable';
import {APP_BASE_HREF} from '@angular/common';

class MockUserService {
  public loginStatus: AuthStatus = "Unknown";
  public profile$: Observable<Profile>;
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, ProfileComponent, LunchComponent,
      ],
      providers: [
          { provide: UserService, useClass: MockUserService },
          { provide: APP_BASE_HREF, useValue : '/' }

      ],
      imports: [
        routes
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'All the Hubbub'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toContain('All the Hubbub');
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('All the Hubbub');
  }));
});
