export interface ConsignmentDetail {
    consignmentId: number,
    type: ConsignmentDetailType,
    description: string,
    price: number,
    imageURLs: string[],
    accountId: number,
    createDate: Date,
    updateDate: Date
}

export enum ConsignmentDetailType {
    INITIAL_EVALUATION = "INITIAL_EVALUATION",
    FINAL_EVALUATION = "FINAL_EVALUATION",
    MANAGER_ACCEPTED = "MANAGER_ACCEPTED",
    MANAGER_REJECTED = "MANAGER_REJECTED"
}