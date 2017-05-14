import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { OnlyIfLoggedOut } from './loggedout.guard';
import { LunchComponent } from './lunch/lunch.component';
import { LoginComponent } from './login/login.component';
import { UpcomingEventsComponent } from './upcoming-events/upcoming-events.component';

const appRoutes: Routes = [
  { path: 'home', component: UpcomingEventsComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard] },
  { path: 'request', component: LunchComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [OnlyIfLoggedOut] },
  { path: '', component: AppComponent, canActivate: [OnlyIfLoggedOut] },
 ];

export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
