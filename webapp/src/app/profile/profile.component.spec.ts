import { Component } from '@angular/core'
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MdCardModule } from '@angular/material';
import { Observable } from 'rxjs/Observable';

import { ProfileComponent } from './profile.component';
import { Profile } from '../types'

// TODO: add more test data
const profileTestData = {
    uid: '1234',
    photo: 'https://whatever.com/photo.jpg',
    email: 'someone@whatever.com',
    name: 'Maria Sanchez'
};

@Component({
  selector: 'test-component-wrapper',
  template: '<profile [observableData]="data$"></profile>',
})
class TestComponentWrapper {
  data = new Profile(profileTestData)
  data$ = Observable.create((observer) => {
    observer.next(this.data);
  });
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<TestComponentWrapper>;
  let element: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestComponentWrapper, ProfileComponent ],
      imports: [
        MdCardModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestComponentWrapper);
    component = fixture.debugElement.children[0].componentInstance;
    element = fixture.debugElement.children[0].nativeElement;
    fixture.detectChanges();
  }));

  it('should render some profile info', async(() => {
    expect(element.textContent).toContain(profileTestData.name);
  }));

});
