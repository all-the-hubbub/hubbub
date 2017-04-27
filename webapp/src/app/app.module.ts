import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MdButtonModule, MdCheckboxModule } from '@angular/material';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';

import 'hammerjs';   // for Material gestures
import { routes } from        './app.router';
import { AppComponent } from  './app.component';
import { UserService } from   './user.service';

import { AdminModule } from './admin/admin.module';
import { LunchComponent } from './lunch/lunch.component';
import { ProfileComponent } from './profile/profile.component';

// For AoT compatibility, this needs to be exported so that Angular
// can statically analyze the NgModule declaration
export const config = {
    apiKey: "AIzaSyC2nnXNrZafMKoAqrwU69AkSJP6iwqJFJ0",
    authDomain: "hubbub-159904.firebaseapp.com",
    databaseURL: "https://hubbub-159904.firebaseio.com",
    projectId: "hubbub-159904",
    storageBucket: "hubbub-159904.appspot.com",
    messagingSenderId: "113654972557"
  };

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LunchComponent
  ],
  imports: [
    AdminModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,  // used by Material components
    BrowserModule,
    FormsModule,
    HttpModule,
    MdButtonModule,
    MdCheckboxModule,
    routes
  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
