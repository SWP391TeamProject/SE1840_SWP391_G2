import { ConsignmentStatus } from "@/constants/enums";
import { IAccount, IConsignmentDetail } from "@/constants/interfaces";

interface Consignment {
    consignmentId?: number;
    preferContact?: string;
    description?: string;
    status?: ConsignmentStatus;
    createDate?: Date;
    updateDate?: Date;
    staff?: IAccount;
    consignmentDetails?: [IConsignmentDetail];
}
export default Consignment;
