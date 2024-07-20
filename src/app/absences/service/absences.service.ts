import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { AbsenceDefinition } from "./AbsenceDefinition.model";
import { firstValueFrom } from "rxjs";
import { CreateAbsence } from "./createAbsence.dto";
import { Absence } from "./Absence.model";

interface SearchableAbsence extends Absence {
    from: number;
    to: number;
}

@Injectable({
    providedIn: "root",
})
export class UsersService {
    http = inject(HttpClient);

    protected absenceDefCache: AbsenceDefinition[] | undefined;

    public async getAbsenceDefinitions(): Promise<AbsenceDefinition[]> {
        if (this.absenceDefCache) return this.absenceDefCache;

        const response = await firstValueFrom(
            this.http.get<AbsenceDefinition[]>(
                `${environment.apiUrl}/AbsenceDefinitions`,
                { observe: "response" }
            )
        );

        if (!response.ok || !response.body) return [];

        this.absenceDefCache = response.body;
        return this.absenceDefCache;
    }

    protected absenceCache: SearchableAbsence[] | undefined;

    public createAbsence(absence: CreateAbsence) {
        return this.http.post<Absence>(`${environment.apiUrl}/Absences`, absence, {
            observe: "response",
        });
    }

    // the date params on the query seem to search based on creation date,
    // not the actual time of absence, because of that i have to fetch the whole
    // list and do the searching here.
    // potential improvement: move to ServiceWorker
    protected async getAbsences(): Promise<SearchableAbsence[]> {
        if (this.absenceCache) return this.absenceCache;

        const response = await firstValueFrom(
            this.http.get<Absence[]>(`${environment.apiUrl}/Absences`, {
                observe: "response",
            })
        );

        if (!response.ok || !response.body) return [];

        this.absenceCache = response.body.map((x) => ({
            ...x,
            from: x.PartialTimeFrom
                ? new Date(x.PartialTimeFrom).valueOf()
                : -1,
            to: x.PartialTimeTo ? new Date(x.PartialTimeTo).valueOf() : -1,
        }));

        return this.absenceCache;
    }

    public async filteredAbsences(fromD: Date, toD: Date): Promise<Absence[]> {
        const qfrom = fromD.valueOf(),
            qto = toD.valueOf();

        const abs = await this.getAbsences();
        return abs.filter(({ from, to }) => {
            if (from == -1 && to == -1) return false; //no date info
            else if (from == -1) return to >= qfrom; // no start date
            else if (to == -1) return from <= qto; // no end date
            return from <= qto && to >= qfrom; // both are present
        });
    }
}
