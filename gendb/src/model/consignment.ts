export interface Consignment {
    senderId: number,
    id: number,
    status: ConsignmentStatus,
    preferContact: string,
    staffId: number,
    createDate: Date,
    updateDate: Date
}

export enum ConsignmentStatus {
    EVALUATING = "EVALUATING",
    FINISHED = "FINISHED",
    TERMINATED = "TERMINATED"
}

export enum ContactPreference {
    EMAIL = "EMAIL", PHONE = "PHONE", TEXT = "TEXT", ANY = "ANY"
}