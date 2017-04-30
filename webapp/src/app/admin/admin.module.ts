import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
import { MdButtonModule, MdListModule, MdMenuModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AdminComponent } from './admin.component';
import { AdminService } from './admin.service';

const adminRoutes: Routes = [
  { path: 'admin', component: AdminComponent },
];

export const routes: ModuleWithProviders = RouterModule.forChild(adminRoutes);

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    MdButtonModule, MdListModule, MdMenuModule,
    routes
  ],
  declarations: [AdminComponent],
  providers: [
    AdminService,
    AngularFireDatabaseModule
  ]
})
export class AdminModule { }
