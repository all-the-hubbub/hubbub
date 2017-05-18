import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubComponent } from './bub.component';

describe('BubComponent', () => {
  let component: BubComponent;
  let fixture: ComponentFixture<BubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
