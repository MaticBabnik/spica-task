export type CreateAbsence = {
    UserId: string,
    AbsenceDefinitionId: string,
    Comment: string,
    PartialTimeFrom: string,
    PartialTimeTo: string,
}