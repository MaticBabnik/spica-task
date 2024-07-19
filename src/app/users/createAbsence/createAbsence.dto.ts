export type CreateAbsence = {
    UserId: string,
    AbsenceDefinitionId: string,
    Comment?: string,
    Timestamp: string,
    PartialTimeFrom: string,
    PartialTimeTo: string,
}