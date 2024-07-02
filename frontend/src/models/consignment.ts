import { ConsignmentStatus } from "@/constants/enums";
import { Account } from "@/constants/interfaces";
import { ConsignmentDetail } from "./newModel/consignmentDetail";

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
