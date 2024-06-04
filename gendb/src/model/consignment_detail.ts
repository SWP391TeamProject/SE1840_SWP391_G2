export interface ConsignmentDetail {
    consignmentId: number,
    id: number,
    __name: string, // lưu tạm
    __categoryId: number, // lưu tạm
    status: ConsignmentDetailStatus,
    description: string,
    price: number,
    imageUrls: string[],
    createDate: Date,
    updateDate: Date
}

export enum ConsignmentDetailStatus {
    WAITING_STAFF = "WAITING_STAFF",
    IN_INITIAL_EVALUATION = "IN_INITIAL_EVALUATION",
    SENDING = "SENDING",
    IN_FINAL_EVALUATION = "IN_FINAL_EVALUATION",
    FINISHED = "FINISHED",
    TERMINATED = "TERMINATED"
}