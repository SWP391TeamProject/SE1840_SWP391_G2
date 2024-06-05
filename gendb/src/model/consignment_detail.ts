export interface ConsignmentDetail {
    consignmentId: number,
    status: ConsignmentDetailStatus,
    description: string,
    price: number,
    imageURLs: string[],
    createDate: Date,
    updateDate: Date
}

export enum ConsignmentDetailStatus {
    REQUEST = "REQUEST",
    INITIAL_EVALUATION = "INITIAL_EVALUATION",
    FINAL_EVALUATION = "FINAL_EVALUATION",
    MANAGER_ACCEPTED = "MANAGER_ACCEPTED",
    MANAGER_REJECTED = "MANAGER_REJECTED"
}