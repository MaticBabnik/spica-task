import { Component, inject, OnInit } from "@angular/core";
import * as F from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { User } from "../../users/service/User.model";
import { AbsenceDefinition } from "../service/AbsenceDefinition.model";
import { AbsencesService } from "../service/absences.service";

type mbyDate = Date | null;

@Component({
    selector: "app-create-absence",
    standalone: true,
    imports: [
        MatProgressBar,
        MatInputModule,
        MatDialogModule,
        MatSelectModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDatepickerModule,
        F.ReactiveFormsModule,
    ],
    templateUrl: "./createAbsence.component.html",
    styleUrl: "./createAbsence.component.scss",
})
export class CreateAbsenceComponent implements OnInit {
    absencesService = inject(AbsencesService);
    dialog = inject(MatDialogRef<CreateAbsenceComponent>);
    user: User = inject(MAT_DIALOG_DATA);

    absenceDefinitions: AbsenceDefinition[] = [];

    form = new F.FormGroup(
        {
            comment: new F.FormControl(""),
            endTime: new F.FormControl("", F.Validators.required),
            startTime: new F.FormControl("", F.Validators.required),
            absenceType: new F.FormControl("", F.Validators.required),
            startDate: new F.FormControl<mbyDate>(null, F.Validators.required),
            endDate: new F.FormControl<mbyDate>(null, F.Validators.required),
        },
        {
            validators: [
                (c: F.AbstractControl) => {
                    // validates dates and times
                    const form = c.getRawValue();
                    let start = (form.startDate as Date | null)?.valueOf(),
                        end = (form.endDate as Date | null)?.valueOf();
                    if (!start || !end) return null;

                    if (start > end) return { dateBefore: true };

                    if (start == end) {
                        start = this.parseTime(form.startTime as string | null);
                        end = this.parseTime(form.endTime as string | null);
                        if (start >= end) return { timeBefore: true, test: 1 };
                    }
                    return null;
                },
            ],
        }
    );

    error: string | undefined = undefined;
    loading = false;

    errorMap: Record<string, string | undefined> = {
        required: "Field is required",
        dateBefore: "End date must be after start date",
        timeBefore: "End time must be after start time",
    };

    getError(controlName: keyof typeof this.form.controls) {
        const control = this.form.controls[controlName];
        const error = Object.keys(control.errors ?? {})[0];
        return this.errorMap[error];
    }

    protected parseTime(timeString: string | null | undefined) {
        if (!timeString) return 0;

        const comps = timeString.split(":").map((x) => parseInt(x));
        if (comps.length != 2) return 0;

        const [h, m] = comps;
        const timeMs = (h * 60 + m) * 60_000;

        if (isNaN(timeMs)) return 0;
        return timeMs;
    }

    async ngOnInit() {
        this.absenceDefinitions =
            await this.absencesService.getAbsenceDefinitions();
    }

    protected toDtoTime(date: Date, timeString: string): string {
        return new Date(
            date.valueOf() + this.parseTime(timeString)
        ).toISOString();
    }

    create() {
        if (!this.form.valid) return;
        if (this.loading) return;
        this.loading = true;

        const a = this.form.value;

        this.absencesService
            .createAbsence({
                UserId: this.user.Id,
                AbsenceDefinitionId: a.absenceType!,
                Comment: a.comment ?? undefined,
                Timestamp: new Date().toISOString(),
                PartialTimeFrom: this.toDtoTime(a.startDate!, a.startTime!),
                PartialTimeTo: this.toDtoTime(a.endDate!, a.endTime!),
            })
            .subscribe((res) => {
                if (!res.ok) {
                    this.loading = false;
                    this.error = res.statusText;
                    return;
                }

                this.dialog.close(res.body);
            });
    }
}
