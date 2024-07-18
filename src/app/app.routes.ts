import { Routes } from '@angular/router';

import { UsersComponent } from "./users/users.component"
import { SettingsComponent } from "./settings/settings.component"
import { authGuard } from "./auth.guard"

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'settings'
    },
    {
        path: 'settings',
        component: SettingsComponent
    },
    {
        path: 'users',
        component: UsersComponent,
        canActivate: [authGuard]
    }
];
