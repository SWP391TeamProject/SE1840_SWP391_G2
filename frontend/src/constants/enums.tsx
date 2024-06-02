export enum Roles {
  MEMBER = "MEMBER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  GUEST = "GUEST",
} // enums.ts

export enum AccountStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  // Add more statuses if needed (e.g., BANNED, SUSPENDED)
}

export enum AuctionSessionStatus {
  TERMINATED = "TERMINATED",
  FINISHED = "FINISHED",
  PROGRESSING = "PROGRESSING",
  SCHEDULED = "SCHEDULED",
}

export enum ConsignmentContactPreference {
  ANY = "ANY",
  TEXT_MESSAGE = "TEXT_MESSAGE",
  PHONE = "PHONE",
  EMAIL = "EMAIL",
}

export enum ConsignmentStatus {
  TERMINATED = "TERMINATED",
  FINISHED = "FINISHED",
  IN_FINAL_EVALUATION = "IN_FINAL_EVALUATION",
  SENDING = "SENDING",
  IN_INITIAL_EVALUATION = "IN_INITIAL_EVALUATION",
  WAITING_STAFF = "WAITING_STAFF",
}

export enum ConsignmentDetailType {
  MANAGER_REJECTED = "MANAGER_REJECTED",
  MANAGER_ACCEPTED = "MANAGER_ACCEPTED",
  FINAL_EVALUATION = "FINAL_EVALUATION",
  INITIAL_EVALUATION = "INITIAL_EVALUATION",
  REQUEST = "REQUEST",
}

export enum ItemStatus {
  UNSOLD = "UNSOLD",
  SOLD = "SOLD",
  IN_AUCTION = "IN_AUCTION",
  QUEUE = "QUEUE",
  VALUATING = "VALUATING",
}

export enum PaymentStatus {
  PENDING = 0,
  COMPLETED = 1,
  FAILED = 2,
}

export enum PaymentType {
  CREDIT_CARD = 0,
  DEBIT_CARD = 1,
  PAYPAL = 2,
  BANK_TRANSFER = 3,
  CASH = 4,
}

export enum RoleName {
  MEMBER = "MEMBER",
  STAFF = "STAFF",
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
}
