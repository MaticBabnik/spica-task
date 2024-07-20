import { Location } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { Component, inject, Input, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { Absence } from "./service/Absence.model";
import { UsersService } from "../users/service/users.service";
import { AbsencesService } from "./service/absences.service";
import { LoadingComponent } from "../common/loading.component";
import { AbsenceCardComponent } from "./absenceCard/absenceCard.component";

@Component({
    selector: "app-absences",
    standalone: true,
    imports: [
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatDatepickerModule,
        AbsenceCardComponent,
        LoadingComponent,
    ],
    templateUrl: "./absences.component.html",
    styleUrl: "./absences.component.scss",
})
export class AbsencesComponent implements OnInit {
    route = inject(ActivatedRoute);
    location = inject(Location);
    absencesService = inject(AbsencesService);

    dateQuery = new FormControl(this.today());

    absences: Absence[] = [];
    loading = false;
    error: string | undefined = undefined;

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

    async fetchAbsences(forceFetch = false) {
        if (this.loading) return;
        if (!this.dateQuery.value) return;
        this.loading = true;

        const nextDay = new Date(
            this.dateQuery.value.valueOf() + 24 * 60 * 60 * 1000
        );

        this.absencesService
            .filteredAbsences(this.dateQuery.value, nextDay, forceFetch)
            .then((x) => {
                this.loading = false;
                this.absences = x;
            });
    }

    async ngOnInit() {
        this.fetchAbsences();

        this.dateQuery.valueChanges.subscribe(() => {
            this.fetchAbsences();
        });
    }
}
