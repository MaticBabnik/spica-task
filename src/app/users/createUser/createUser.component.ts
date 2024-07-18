import { Component } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
    selector: "app-create-user",
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        ReactiveFormsModule,
    ],
    templateUrl: "./createUser.component.html",
    styleUrl: "./createUser.component.scss",
})
export class CreateUser {
    userForm = new FormGroup({
        firstName: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        lastName: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required],
        }),
        email: new FormControl("", {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
    });

    private errorMap: Record<string, string | undefined> = {
        email: 'Enter an email address',
        required: 'Field is required'
    }

    getError(controlName: keyof typeof this.userForm.controls) {
        const control = this.userForm.controls[controlName];
        const error = Object.keys(control.errors ?? {})[0];
        return this.errorMap[error] ?? '';
    }
}
