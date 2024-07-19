import { ConsignmentStatus } from '@/constants/enums';
import { Account } from '@/constants/interfaces';
import { ConsignmentDetail } from './newModel/consignmentDetail';
import { Attachment } from './Attachment';

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
  createDate: string;
  updateDate: string;
  consignmentDetails: ConsignmentDetail[];
  attachments: Attachment[];
}
export default Consignment;
