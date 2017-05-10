import { Component } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdCardModule } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { ProfileComponent } from './profile.component';
import { Profile } from '../types'

import { UserService, AuthStatus } from '../user.service';

import { subjectUid, subjectProfileData, UserServiceMock } from '../user.service.mock';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let element: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      imports: [
        MdCardModule
      ],
      providers: [
          { provide: UserService, useClass: UserServiceMock },
      ],

    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render some profile info', async(() => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.textContent).toContain(subjectProfileData.name);
  }));

});
