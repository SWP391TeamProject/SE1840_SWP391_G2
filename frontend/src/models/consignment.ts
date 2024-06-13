import { ConsignmentStatus } from "@/constants/enums";
import { Account, ConsignmentDetail } from "@/constants/interfaces";

interface Consignment {
    consignmentId?: number;
    preferContact?: string;
    description?: string;
    status?: ConsignmentStatus;
    createDate?: Date;
    updateDate?: Date;
    staff?: Account;
    consignmentDetails?: [ConsignmentDetail];
}
export default Consignment;
