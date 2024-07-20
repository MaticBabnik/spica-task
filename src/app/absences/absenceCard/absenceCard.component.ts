import { Component, Input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { DateRangePipe } from "./DateRange.pipe";
import { FullNamePipe } from "./FullName.pipe";
import { Absence } from "../service/Absence.model";

@Component({
    standalone: true,
    selector: "app-absence-card",
    templateUrl: "./absenceCard.component.html",
    styles: `
        :host {display: contents} 
        .custom-elevation {box-shadow: var(--mat-app-elevation-shadow-level-4)}
    `,
    imports: [MatCardModule, DateRangePipe, FullNamePipe],
})
export class AbsenceCardComponent {
    @Input({ required: true })
    absence: Absence = {} as Absence;
}
