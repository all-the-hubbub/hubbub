import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MdButtonModule, MdCardModule, MdCheckboxModule, MdDialogModule, MdListModule, MdMenuModule, MdSidenavModule, MdToolbarModule, MdProgressSpinnerModule } from '@angular/material';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';


import 'hammerjs';   // for Material gestures
import { routes } from        './app.router';
import { AppComponent } from  './app.component';
import { AdminService } from   './admin/admin.service';
import { UserService } from   './user.service';
import { SlotService } from './slot.service';

import { AuthGuard } from './auth.guard';

import { AdminComponent } from './admin/admin.component';
import { LunchComponent } from './lunch/lunch.component';
import { ProfileComponent } from './profile/profile.component';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';
import { LoginComponent } from './login/login.component';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AdminComponent,
    LunchComponent,
    AppComponent,
    ProfileComponent,
    UpcomingEventsComponent,
    LoginComponent,
  ],
  imports: [
    AngularFireModule.initializeApp(environment.config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,  // used by Material components
    BrowserModule,
    FlexLayoutModule,
    FormsModule,
    HttpModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdListModule,
    MdMenuModule,
    MdSidenavModule,
    MdToolbarModule,
    MdDialogModule,
    MdProgressSpinnerModule,
    routes
  ],
  providers: [AdminService, AuthGuard, UserService, SlotService],
  bootstrap: [AppComponent]
})
export class AppModule { }
