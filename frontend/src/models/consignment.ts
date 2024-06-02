import { ConsignmentStatus } from "@/constants/enums";
import { IConsignmentDetail } from "@/constants/interfaces";

interface Consignment {
    consignmentId?: number;
    preferContact?: string;
    description?: string;
    status?: ConsignmentStatus;
    createDate?: Date;
    updateDate?: Date;
    staffId?: number;
    consignmentDetails?: [IConsignmentDetail];
}
export default Consignment;
