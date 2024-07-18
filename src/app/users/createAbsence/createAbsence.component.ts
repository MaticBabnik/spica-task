import { Component, inject } from "@angular/core";
import {
    ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatSelectModule } from "@angular/material/select";
import { UsersService } from "../users.service";

@Component({
    selector: "app-create-user",
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
export class CreateAbsence {
    usersService = inject(UsersService);
    dialog = inject(MatDialogRef<CreateAbsence>);
    error: string | undefined = undefined;
    loading = false;

}
