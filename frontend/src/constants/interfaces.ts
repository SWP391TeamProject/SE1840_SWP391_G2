// interfaces.ts

import {
  AccountStatus,
  AuctionSessionStatus,
  ConsignmentContactPreference,
  ConsignmentStatus,
  ConsignmentDetailType,
  ItemStatus,
  PaymentStatus,
  PaymentType,
  RoleName,
} from "./enums";

export interface Account {
  account_id?: number;
  balance?: number;
  create_date?: Date;
  email?: string;
  nickname?: string;
  password?: string;
  phone?: string;
  status?: AccountStatus;
  update_date?: Date;
  avatar_url_attachment_id?: number;
}

export interface Attachment {
  attachment_id?: number;
  blob_id?: string;
  create_date?: Date;
  link?: string;
  update_date?: Date;
  account_id?: number;
  auction_session_id?: number;
  consignment_id?: number;
  consignment_detail_id?: number;
  item_id?: number;
  post_id?: number;
}

export interface AuctionItem {
  auction_item_id?: number;
  current_price?: number;
  auction_session_id?: number;
  item_id?: number;
}

export interface AuctionSession {
  auction_session_id?: number;
  create_date?: Date;
  end_date?: Date;
  start_date?: Date;
  status?: AuctionSessionStatus;
  title?: string;
  update_date?: Date;
}

export interface Bid {
  bid_id?: number;
  create_date?: Date;
  price?: number;
  account_id?: number;
  auction_item_id?: number;
}

// ... (interfaces for BlogCategory, BlogPost, CitizenCard, Consignment, etc.)
// interfaces.ts (continued)

export interface BlogCategory {
  blog_category_id?: number;
  create_date?: Date;
  name?: string;
  update_date?: Date;
}

export interface BlogPost {
  post_id?: number;
  content?: string;
  create_date?: Date;
  title?: string;
  update_date?: Date;
  author_id?: number;
  blog_category_id?: number;
}

export interface CitizenCard {
  account_id: number;
  address?: string;
  birthday?: Date;
  card_id?: string;
  city?: string;
  create_date?: Date;
  full_name?: string;
  gender?: boolean;
  update_date?: Date;
}

export interface Consignment {
  consignment_id?: number;
  create_date?: Date;
  prefer_contact?: ConsignmentContactPreference;
  status?: ConsignmentStatus;
  update_date?: Date;
}

export interface ConsignmentDetail {
  consignment_detail_id?: number;
  description?: string;
  price?: number;
  type?: ConsignmentDetailType;
  account_id?: number;
  consignment_id?: number;
  attachments: [Attachment];
}

export interface Deposit {
  deposit_id?: number;
  deposit_amount: number;
  deposit_date?: string;
  account_id?: number;
  auction_session_id?: number;
}

export interface Item {
  item_id?: number;
  buy_in_price?: number;
  create_date?: Date;
  description?: string;
  name?: string;
  reserve_price?: number;
  status?: ItemStatus;
  update_date?: Date;
  item_category_id?: number;
  order_id?: number;
  owner_id?: number;
}

export interface ItemCategory {
  item_category_id?: number;
  create_date?: Date;
  name?: string;
  update_date?: Date;
}

export interface Notification {
  notification_id?: number;
  create_date?: Date;
  is_read?: boolean;
  message?: string;
  type?: string; // Consider using an enum for notification types
  update_date?: Date;
  account_id?: number;
}

export interface Order {
  order_id?: number;
  order_date?: Date;
  ship_address?: string;
  account_id?: number;
}

export interface Payment {
  payment_id?: number;
  create_date?: Date;
  payment_amount?: number;
  payment_date?: string;
  payment_status?: PaymentStatus;
  payment_type?: PaymentType;
  update_date?: Date;
  account_id?: number;
  bid_id?: number;
  deposit_id?: number;
  order_id?: number;
}

export interface Role {
  role_id?: number;
  role_name?: RoleName;
}

export interface RoleAccount {
  account_id: number;
  role_id: number;
}
