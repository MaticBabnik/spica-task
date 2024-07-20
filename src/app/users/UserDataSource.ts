import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable } from "rxjs";

import { User } from "./service/User.model";

export class UserDataSource extends DataSource<User> {
    protected dataSubject: BehaviorSubject<User[]>;
    protected firstName = "";
    protected lastName = "";

    public constructor(protected data: User[]) {
        super();
        this.dataSubject = new BehaviorSubject(data);
    }

    public updateQuery(first: string, last: string) {
        first = first.toLocaleLowerCase().trim();
        last = last.toLocaleLowerCase().trim();

        if (first == this.firstName && last == this.lastName) return;

        this.firstName = first;
        this.lastName = last;
        this.pushUpdate();
    }

    public update(newData: User[]) {
        this.data = newData;
        this.pushUpdate();
    }

    public append(newUser: User) {
        this.data.push(newUser);
        this.pushUpdate();
    }

    protected pushUpdate() {
        if (this.firstName == "" && this.lastName == "")
            this.dataSubject.next(this.data);

        const f = this.firstName,
            l = this.lastName;

        const filtered = this.data.filter(({ FirstName, LastName }) => {
            if (f != "") {
                if (!FirstName.toLocaleLowerCase().includes(f)) return false;
            }
            if (l != "") {
                if (!LastName.toLocaleLowerCase().includes(l)) return false;
            }

            return true;
        });

        this.dataSubject.next(filtered);
    }

    public override connect(): Observable<readonly User[]> {
        return this.dataSubject.asObservable();
    }

    public override disconnect(): void {
        this.dataSubject.complete();
    }
}
