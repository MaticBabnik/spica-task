import { Pipe, PipeTransform } from "@angular/core";
import { Absence } from "../service/Absence.model";

@Pipe({
    name: "dateRange",
    standalone: true,
})
export class DateRangePipe implements PipeTransform {
    dateMaybe(dateStr: string | undefined) {
        if (!dateStr) return undefined;
        return new Date(dateStr);
    }

    fullLocaleString(date: Date) {
        return date.toLocaleTimeString(undefined, {
            year: "numeric",
            day: '2-digit',
            month: "short",
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    timeString(date: Date) {
        return date.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit'
        });
    }

    transform(value: Absence): string {
        const start = this.dateMaybe(value.PartialTimeFrom);
        const end = this.dateMaybe(value.PartialTimeTo);

        // handle partial date info
        if (!start && !end) {
            return "No date information";
        } else if (!start) {
            return `? - ${this.fullLocaleString(end!)}`;
        } else if (!end) {
            return `${this.fullLocaleString(start!)} - ?`;
        }

        const dstrStart = start.toLocaleDateString();
        const dstrEnd = end.toLocaleDateString();

        if (dstrStart == dstrEnd) {
            return `${dstrStart} ${this.timeString(start)} - ${this.timeString(end)}`;
        }

        return `${this.fullLocaleString(start)} - ${this.fullLocaleString(end)}`
    }
}
