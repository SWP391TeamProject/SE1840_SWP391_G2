import {ConsignmentDetail} from "./consignment_detail";

export interface Consignment {
    __name: string, // lưu tạm
    __categoryId: number, // lưu tạm
    senderId: number,
    id: number,
    status: ConsignmentStatus,
    preferContact: string,
    description: string,
    color: string,
    size: string,
    weight: string,
    brand: string,
    age: number,
    material: string;
    createDate: Date,
    updateDate: Date,
    imageURLs: string[],
    details: ConsignmentDetail[]
}

export enum ConsignmentStatus {
    WAITING_STAFF = "WAITING_STAFF",
    IN_INITIAL_EVALUATION = "IN_INITIAL_EVALUATION",
    SENDING = "SENDING",
    IN_FINAL_EVALUATION = "IN_FINAL_EVALUATION",
    FINISHED = "FINISHED",
    TERMINATED = "TERMINATED"
}

export enum ContactPreference {
    EMAIL = "EMAIL", PHONE = "PHONE", TEXT = "TEXT", ANY = "ANY"
}