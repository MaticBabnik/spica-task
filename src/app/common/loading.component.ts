import { Component } from "@angular/core";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
    standalone: true,
    selector: "app-loading",
    templateUrl: "loading.component.html",
    styleUrl: "loading.component.scss",
    imports: [MatProgressSpinnerModule],
})
export class LoadingComponent {}
