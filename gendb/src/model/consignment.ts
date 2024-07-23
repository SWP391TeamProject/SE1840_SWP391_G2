import {ConsignmentDetail} from "./consignment_detail";

export interface Consignment {
  __name: string, // lưu tạm
  __categoryId: number, // lưu tạm
  userId: number,
  staffId?: number,
  id: number,
  status: ConsignmentStatus,
  preferContact: string,
  contactEmail: string,
  contactPhone: string,
  contactName: string,
  description: string,
  color: string,
  measurement: string,
  weight: number,
  condition: string,
  stamped: string,
  metal: string;
  gemstone: string;
  secretCode?: string,
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
  WAITING_SELLER = "WAITING_SELLER",
  TO_ITEM = "TO_ITEM",
  FINISHED = "FINISHED",
  TERMINATED = "TERMINATED"
}

export enum ContactPreference {
  EMAIL = "EMAIL", PHONE = "PHONE", TEXT = "TEXT", ANY = "ANY"
}