import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { User } from "./User.model";
import { CreateUser } from "./createUser/createUser.dto";
import { AbsenceDefinition } from "./AbsenceDefinition.model";
import { firstValueFrom } from "rxjs";
import { CreateAbsence } from "./createAbsence/createAbsence.dto";

@Injectable({
    providedIn: "root",
})
export class UsersService {
    http = inject(HttpClient);

    public fetchAllUsers() {
        return this.http.get<User[]>(`${environment.apiUrl}/Users`);
    }

    public createUser(user: CreateUser) {
        return this.http.post<User>(`${environment.apiUrl}/Users`, user, {
            observe: "response",
        });
    }

    protected absenceCache: AbsenceDefinition[] | undefined;

    public async getAbsenceDefinitions(): Promise<AbsenceDefinition[]> {
        if (this.absenceCache) return this.absenceCache;

        const response = await firstValueFrom(
            this.http.get<AbsenceDefinition[]>(
                `${environment.apiUrl}/AbsenceDefinitions`,
                { observe: "response" }
            )
        );

        if (!response.ok || !response.body) return [];

        this.absenceCache = response.body;
        return this.absenceCache;
    }

    public createAbsence(absence: CreateAbsence) {
        return this.http.post<User>(`${environment.apiUrl}/Absences`, absence, {
            observe: "response",
        });
    }
}
