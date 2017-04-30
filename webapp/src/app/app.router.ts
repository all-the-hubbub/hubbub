import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminModule} from './admin/admin.module';
import { LunchComponent } from './lunch/lunch.component';

const appRoutes: Routes = [
  { path: '', component: LunchComponent },
];

export const routes: ModuleWithProviders = RouterModule.forRoot(appRoutes);
