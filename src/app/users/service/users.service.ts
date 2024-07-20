import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { User } from "./User.model";
import { CreateUser } from "./createUser.dto";

@Injectable({
    providedIn: "root",
})
export class UsersService {
    http = inject(HttpClient);

    public fetchAllUsers() {
        return this.http.get<User[]>(`${environment.apiUrl}/Users`, {
            observe: "response",
        });
    }

    public createUser(user: CreateUser) {
        return this.http.post<User>(`${environment.apiUrl}/Users`, user, {
            observe: "response",
        });
    }
}
