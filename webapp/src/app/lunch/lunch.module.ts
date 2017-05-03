import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpModule } from '@angular/http';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdListModule, MdMenuModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { LunchComponent } from './lunch.component';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { SlotService } from '../slot.service';
import { UserService } from '../user.service';

const moduleRoutes: Routes = [
  { path: '', component: UpcomingEventsComponent },
  { path: 'request', component: LunchComponent },
];

export const routes: ModuleWithProviders = RouterModule.forChild(moduleRoutes);

@NgModule({
  imports: [
    AngularFireDatabaseModule,
    CommonModule,
    FlexLayoutModule,
    HttpModule,
    MdButtonModule, MdCardModule,
    MdCheckboxModule,
    MdListModule, MdMenuModule,
    routes
  ],
  declarations: [
    LunchComponent,
    UpcomingEventsComponent
  ],
  providers: [
    SlotService,
    UserService
  ]
})
export class LunchModule { }
