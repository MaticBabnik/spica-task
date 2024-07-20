export interface User {
    Id: string;
    FirstName: string;
    LastName: string;
    MiddleName?: string;
    FullName?: string;
    BirthDate?: string;
    Address?: string;
    City?: string;
    State?: string;
    Phone?: string;
    Mobile?: string;
    Email?: string;
    Gender?: string;
    PictureUri?: string;
    IsTimeAttendanceUser: boolean;
    IsArchived: boolean;
    UserName: string;
}
