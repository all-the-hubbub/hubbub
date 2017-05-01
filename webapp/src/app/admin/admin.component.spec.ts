import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MdButtonModule, MdCardModule, MdListModule, MdMenuModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Slot } from '../types';

import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';

class MockAdminService {
  public slotList$: Observable<Slot[]>;
}

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminComponent ],
      imports: [
        FlexLayoutModule,
        HttpModule,
        MdButtonModule, MdCardModule, MdListModule, MdMenuModule,
      ],
      providers: [
        { provide: AdminService, useClass: MockAdminService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
