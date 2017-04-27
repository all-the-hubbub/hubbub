import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';

const adminRoutes: Routes = [
  { path: 'admin', component: AdminComponent },
];

export const routes: ModuleWithProviders = RouterModule.forChild(adminRoutes);

@NgModule({
  imports: [
    CommonModule,
    routes
  ],
  declarations: [AdminComponent]
})
export class AdminModule { }
