import { Component, inject } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatProgressBar } from "@angular/material/progress-bar";
import { UsersService } from "../users.service";

@Component({
    selector: "app-create-user",
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatInputModule,
        MatProgressBar,
        MatFormFieldModule,
        ReactiveFormsModule,
    ],
    templateUrl: "./createUser.component.html",
    styleUrl: "./createUser.component.scss",
})
export class CreateUser {
    usersService = inject(UsersService);
    dialog = inject(MatDialogRef<CreateUser>);
    error: string | undefined = undefined;    
    loading = false;

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

    create() {
        if (this.loading) return;
        this.loading = true;

        const u = this.userForm.value
        this.usersService.createUser({
            Email: u.email!,
            FirstName: u.firstName!,
            LastName: u.lastName!
        }).subscribe(res => {
            if (!res.ok) {
                this.loading = false;
                this.error = res.statusText;
                return;
            }

            this.dialog.close(res.body);
        })
    }
}
