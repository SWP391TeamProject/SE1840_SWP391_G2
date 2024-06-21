import { AuctionStatus } from "./model/auction_session";

export const NUMBER_OF_ACCOUNT = 50;
export const NUMBER_OF_ADMIN = 1;
export const NUMBER_OF_MANAGER = 3;
export const NUMBER_OF_STAFF = 5;
export const HAS_CITIZEN_CARD = 0.7;
export const OLDEST_ACCOUNT_CREATE_YEAR = 3;
export const ACCOUNT_AGE_MAX = 50;
export const ACCOUNT_AGE_MIN = 20;
export const NUMBER_OF_CONSIGNMENT = 500;
export const NUMBER_OF_AUCTION: Map<AuctionStatus, number> = new Map(
  Object.entries({
    SCHEDULED: 5,
    PROGRESSING: 5,
    FINISHED: 5,
  }).map(([key, value]) => [key as AuctionStatus, value])
);
export const MIN_PARTICIPANT = 10;
export const MAX_PARTICIPANT = 20;
export const MIN_ITEM_PER_AUCTION = 5;
export const MAX_ITEM_PER_AUCTION = 15;
export const MIN_AUCTION_MINUTES = 20;
export const MAX_AUCTION_MINUTES = 45;
export const MIN_BID_TIME_INCREMENT = 30;
export const MAX_BID_TIME_INCREMENT = 60;
export const AUCTION_WIN_CHANCE = 0.7;
export const NOTIFICATION_PER_ACCOUNT_MIN = 20;
export const NOTIFICATION_PER_ACCOUNT_MAX = 50;
