import { debounceTime, merge } from "rxjs";
import { Component, inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";

import { UsersService } from "./service/users.service";
import { UserDataSource } from "./UserDataSource";
import { MatDialog } from "@angular/material/dialog";

import { CreateUserComponent } from "./createUserDialog/createUser.component";
import { CreateAbsenceComponent } from "../absences/createAbsenceDialog/createAbsence.component";
import { User } from "./service/User.model";
import { LoadingComponent } from "../common/loading.component";

@Component({
    selector: "app-users",
    standalone: true,
    imports: [
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    LoadingComponent
],
    templateUrl: "./users.component.html",
    styleUrl: "./users.component.scss",
})
export class UsersComponent implements OnInit {
    readonly dialogService = inject(MatDialog);
    readonly usersService = inject(UsersService);

    loading = false;
    error: string | undefined = undefined;
    users = new UserDataSource([]);

    displayedColumns = [
        "name",
        "email",
        "address",
        "phone",
        "mobile",
        "gender",
        "actions",
    ];

    firstNameQuery = new FormControl("");
    lastNameQuery = new FormControl("");

    addUser() {
        this.dialogService
            .open(CreateUserComponent)
            .afterClosed()
            .subscribe((x) => {
                if (x) this.users.append(x);
            });
    }

    addAbsence(user: User) {
        this.dialogService.open(CreateAbsenceComponent, { data: user });
    }

    fetchUsers() {
        if (this.loading) return;
        this.loading = true;

        this.usersService.fetchAllUsers().subscribe(x=>{
            this.loading = false;
            if (x.ok) {
                this.users.update(x.body!);
                this.error = undefined;
                return;
            }

            this.users.update([]);
            this.error = 'Could not fetch users.'
        })
    }

    ngOnInit(): void {
        this.fetchUsers();

        merge(this.firstNameQuery.valueChanges, this.lastNameQuery.valueChanges)
            .pipe(debounceTime(333))
            .subscribe(() => {
                this.users.updateQuery(
                    this.firstNameQuery.value ?? "",
                    this.lastNameQuery.value ?? ""
                );
            });
    }
}
