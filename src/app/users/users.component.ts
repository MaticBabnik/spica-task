import { debounceTime, merge } from "rxjs";
import { Component, inject, OnInit } from "@angular/core";
import { FormControl, ReactiveFormsModule } from "@angular/forms";

import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";

import { UsersService } from "./users.service";
import { UserDataSource } from "./UserDataSource";

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
    ],
    templateUrl: "./users.component.html",
    styleUrl: "./users.component.scss",
})
export class UsersComponent implements OnInit {
    usersService = inject(UsersService);
    users = new UserDataSource([]);

    displayedColumns = [
        "name",
        "email",
        "address",
        "phone",
        "mobile",
        "gender",
    ];

    firstNameQuery = new FormControl("");
    lastNameQuery = new FormControl("");

    ngOnInit(): void {
        this.usersService.fetchAllUsers().subscribe((u) => {
            this.users.update(u);
        });

        merge(this.firstNameQuery.valueChanges, this.lastNameQuery.valueChanges)
            .pipe(debounceTime(333))
            .subscribe((x) => console.log(x));

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
