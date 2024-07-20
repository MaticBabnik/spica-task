import { Pipe, PipeTransform } from "@angular/core";
import { Absence } from "../service/Absence.model";

@Pipe({
    name: "fullName",
    standalone: true,
})
export class FullNamePipe implements PipeTransform {
    transform(value: Absence): string {
        return [value.FirstName, value.MiddleName, value.LastName]
            .filter((x) => !!x)
            .join(" ");
    }
}
