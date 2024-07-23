import { ConsignmentStatus } from '@/constants/enums';
import { ConsignmentDetail } from './newModel/ConsignmentDetail';
import { Attachment } from './Attachment';
import {Account} from "@/models/AccountModel.tsx";

interface Consignment {
  consignmentId: number;
  status: ConsignmentStatus;
  preferContact: string;
  user: Account;
  staff: Account;
  description: string;
  contactEmail: string;
  contactPhone: string;
  contactName: string;
  color: string;
  weight: number;
  metal: string;
  gemstone: string;
  measurement: string;
  condition: string;
  stamped: string;
  createdItemId?: number;
  secretCode?: string;
  createDate: string;
  updateDate: string;
  consignmentDetails: ConsignmentDetail[];
  attachments: Attachment[];
}
export default Consignment;
