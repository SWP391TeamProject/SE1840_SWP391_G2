import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import Consignment from "@/models/consignment.ts";
import ConsignmentAttachmentGallery
  from "@/pages/Administration/consignments/consignment-components/ConsignmentAttachmentGallery.tsx";
import {Table, TableBody, TableCell, TableRow} from "@/components/ui/table.tsx";

interface ConsignmentCustomerCardProps {
  consignment: Consignment;
  className?: string;
}

const ConsignmentDetailCard: React.FC<ConsignmentCustomerCardProps> = ({
                                                                         consignment,
                                                                         className
                                                                       }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-3xl">Consignment
          Detail</CardTitle>
        <CardDescription>This is the detail that the customer has
          provided</CardDescription>
      </CardHeader>
      <CardContent
        className="bg-white shadow-md rounded-lg flex flex-col gap-4">
        <h2 className="text-2xl">Description</h2>
        <div className="text-gray-700"
             dangerouslySetInnerHTML={{__html: consignment?.description}}></div>
        <h2 className="text-2xl">Properties</h2>
        <Table>
          <TableBody>
            {["color", "weight", "metal", "gemstone", "measurement", "condition", "stamped"]
              .filter((attr) => consignment[attr])
              .map((attr) => {
                return (
                  <TableRow>
                    <TableCell
                      className="font-medium capitalize w-[200px]">{attr}</TableCell>
                    <TableCell>{consignment[attr]}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        <h2 className="text-2xl">Attachments</h2>
        {(consignment.attachments && consignment.attachments.length > 0) && (
          <ConsignmentAttachmentGallery attachments={consignment.attachments}/>
        )}
      </CardContent>
    </Card>
  );
};

export default ConsignmentDetailCard;