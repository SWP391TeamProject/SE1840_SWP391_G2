import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import Consignment from "@/models/consignment.ts";
import ConsignmentStatusBadge from "@/components/ConsignmentStatusBadge.tsx";
import {formatDate} from "@/lib/utils.ts";
import {ConsignmentStatus} from "@/constants/enums.tsx";
import CustomerInitialEvaluationForm
  from "@/pages/CustomerSite/dashboard/consignment/action-buttons/CustomerInitialEvaluationForm.tsx";
import React from "react";
import CustomerFinalEvaluationForm
  from "@/pages/CustomerSite/dashboard/consignment/action-buttons/CustomerFinalEvaluationForm.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link} from "react-router-dom";
import {Separator} from "@/components/ui/separator.tsx";
import {EyeIcon} from "lucide-react";

interface CustomerConsignmentSecretCodeCardProps {
  consignment: Consignment;
  className?: string;
}

const CustomerConsignmentSecretCodeCard: React.FC<CustomerConsignmentSecretCodeCardProps> = ({
                                                                                     consignment,
                                                                                     className
                                                                                   }) => {
  const [showSecretCode, setShowSecretCode] = React.useState(false);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-3xl">Secret Code</CardTitle>
        <CardDescription className="flex gap-3">
          This is the secret code you should give to the staff to prove your identity. Remember to keep it secret. The code will
          never be changed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-2">
          <div className="bg-input px-3 py-2 rounded-md text-2xl font-medium">
            {showSecretCode ? consignment.secretCode.substring(0, 3) : '***'}
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="bg-input px-3 py-2 rounded-md text-2xl font-medium">
            {showSecretCode ? consignment.secretCode.substring(3, 6) : '***'}
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="bg-input px-3 py-2 rounded-md text-2xl font-medium">
            {showSecretCode ? consignment.secretCode.substring(6, 9) : '***'}
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <EyeIcon className="h-5 w-5" onClick={() => setShowSecretCode(!showSecretCode)} />
            <span className="sr-only">Toggle code visibility</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerConsignmentSecretCodeCard;