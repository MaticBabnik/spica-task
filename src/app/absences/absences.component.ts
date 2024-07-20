import { Component, inject, Input, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { UsersService } from "../users/users.service";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { Absence } from "./Absence.model";
import { MatCardModule } from "@angular/material/card";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { FullNamePipe } from "./FullName.pipe";
import { DateRangePipe } from "./DateRange.pipe";

@Component({
    selector: "app-absences",
    standalone: true,
    imports: [
        FullNamePipe,
        DateRangePipe,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        MatCardModule,
    ],
    templateUrl: "./absences.component.html",
    styleUrl: "./absences.component.scss",
})
export class AbsencesComponent implements OnInit {
    readonly usersService = inject(UsersService);
    readonly route = inject(ActivatedRoute);
    readonly location = inject(Location);

    @Input()
    set date(d: string | undefined) {
        // mm-dd-yyyy
        if (d) this.dateQuery.setValue(new Date(d));
    }

    today() {
        const date = new Date();
        date.setMilliseconds(0);
        date.setSeconds(0);
        date.setMinutes(0);
        date.setHours(0);
        return date;
    }

    toRouterParam(date: Date): string {
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        return `${m}-${d}-${y}`;
    }

    dateQuery = new FormControl(this.today());
    absences: Absence[] = [];

    // Todo(mbabnik): loading indicator

    refresh() {}

    async ngOnInit() {
        const nextDay = new Date(
            this.dateQuery.value!.valueOf() + 24 * 60 * 60 * 1000
        );

        await this.usersService
            .filteredAbsences(this.dateQuery.value!, nextDay)
            .then((x) => {
                this.absences = x; //todo: errors; loading
            });

        this.dateQuery.valueChanges.subscribe((x) => {
            if (!x) return;
            const r = this.toRouterParam(x);
            this.location.replaceState(`/absences/${r}`);

            const nextDay = new Date(x.valueOf() + 24 * 60 * 60 * 1000);

            this.usersService.filteredAbsences(x, nextDay).then((y) => {
                this.absences = y; //todo: errors; loading
            });
        });
    }
}
