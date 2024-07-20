import { Routes } from "@angular/router";

import { authGuard } from "./settings/auth.guard";
import { UsersComponent } from "./users/users.component";
import { AbsencesComponent } from "./absences/absences.component";
import { SettingsComponent } from "./settings/settings.component";

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "settings",
    },
    {
        path: "settings",
        component: SettingsComponent,
    },
    {
        path: "users",
        component: UsersComponent,
        canActivate: [authGuard],
    },
    {
        path: "absences",
        component: AbsencesComponent,
        canActivate: [authGuard],
    },
    {
        path: "absences/:date",
        component: AbsencesComponent,
        canActivate: [authGuard],
    },
];
