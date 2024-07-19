import { Component, inject, OnInit } from "@angular/core";
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
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
import { UsersService } from "../users.service";
import { User } from "../User.model";
import { AbsenceDefinition } from "../AbsenceDefinition.model";

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
        ReactiveFormsModule,
    ],
    templateUrl: "./createAbsence.component.html",
    styleUrl: "./createAbsence.component.scss",
})
export class CreateAbsence implements OnInit {
    usersService = inject(UsersService);
    dialog = inject(MatDialogRef<CreateAbsence>);
    user: User = inject(MAT_DIALOG_DATA);
    error: string | undefined = undefined;
    loading = false;

    absenceDefinitions: AbsenceDefinition[] = [];

    form = new FormGroup(
        {
            absenceType: new FormControl("", Validators.required),
            comment: new FormControl(""),
            startDate: new FormControl<Date | null>(null, Validators.required),
            endDate: new FormControl<Date | null>(null, Validators.required),
            startTime: new FormControl("", Validators.required),
            endTime: new FormControl("", Validators.required),
        },
        {
            validators: [
                (c: AbstractControl) => {
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
            await this.usersService.getAbsenceDefinitions();
    }
}
