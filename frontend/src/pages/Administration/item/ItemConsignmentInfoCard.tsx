import React from 'react';
import Consignment from "@/models/consignment.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import ConsignmentStatusBadge from "@/components/ConsignmentStatusBadge.tsx";
import {formatDate} from "@/lib/utils.ts";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";

interface ItemConsignmentInfoCardProps {
  consignment: Consignment;
}

const ItemConsignmentInfoCard: React.FC<ItemConsignmentInfoCardProps> = ({
                                                                           consignment
                                                                         }) => {


  return (
    <Card>
      <CardHeader>
        This item will be linked to this consignment
        <Separator className="my-5" />
        <CardTitle>
          <h2 className="text-3xl">Consignment
            #{consignment?.consignmentId}</h2>
        </CardTitle>
        <CardDescription className="flex gap-3">
          Status:
          <ConsignmentStatusBadge status={consignment.status}/>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-5">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Create Date:</span>&nbsp;
            {formatDate(consignment?.createDate)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Prefer Contact:</span>&nbsp;
            {consignment?.preferContact ?? 'Not provided'}
          </p>
        </div>
        <Button size="sm" asChild>
          <Link to={`/admin/consignments/${consignment.consignmentId}`} target="_blank">View
            consignment</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default ItemConsignmentInfoCard;