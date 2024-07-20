import { MatDialog } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { debounceTime, merge } from "rxjs";
import { Component, inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { User } from "./service/User.model";
import { UsersService } from "./service/users.service";
import { UserDataSource } from "./UserDataSource";
import { LoadingComponent } from "../common/loading.component";
import { CreateUserComponent } from "./createUserDialog/createUser.component";
import { CreateAbsenceComponent } from "../absences/createAbsenceDialog/createAbsence.component";

@Component({
    selector: "app-users",
    standalone: true,
    imports: [
        MatIconModule,
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        LoadingComponent,
        MatFormFieldModule,
        ReactiveFormsModule,
    ],
    templateUrl: "./users.component.html",
    styleUrl: "./users.component.scss",
})
export class UsersComponent implements OnInit {
    dialogService = inject(MatDialog);
    usersService = inject(UsersService);

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

    loading = false;
    error: string | undefined = undefined;
    users = new UserDataSource([]);

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

        this.usersService.fetchAllUsers().subscribe((x) => {
            this.loading = false;
            if (x.ok) {
                this.users.update(x.body!);
                this.error = undefined;
                return;
            }
            
            this.users.update([]);
            this.error = "Could not fetch users.";
        });
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
