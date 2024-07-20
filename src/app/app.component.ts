import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Component, inject } from "@angular/core";

import { AuthService } from "./settings/auth.service";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [
        RouterModule,
        MatButtonModule,
        MatToolbarModule,
    ],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent {
    auth = inject(AuthService);
}
