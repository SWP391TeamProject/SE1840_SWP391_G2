import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import Consignment from "@/models/consignment.ts";
import React from "react";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {EyeIcon} from "lucide-react";

interface ConsignmentSecretCodeCardProps {
  consignment: Consignment;
  className?: string;
  message?: string;
}

const ConsignmentSecretCodeCard: React.FC<ConsignmentSecretCodeCardProps> = ({
                                                                                               consignment,
                                                                                               className,
                                                                               message
                                                                                             }) => {
  const [showSecretCode, setShowSecretCode] = React.useState(false);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-3xl">Secret Code</CardTitle>
        <CardDescription className="flex gap-3">{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center space-x-2">
          <div
            className="bg-input px-3 py-2 rounded-md text-2xl font-medium uppercase w-16 text-center">
            {showSecretCode ? consignment.secretCode.substring(0, 3) : '***'}
          </div>
          <Separator orientation="vertical" className="h-8"/>
          <div
            className="bg-input px-3 py-2 rounded-md text-2xl font-medium uppercase w-16 text-center">
            {showSecretCode ? consignment.secretCode.substring(3, 6) : '***'}
          </div>
          <Separator orientation="vertical" className="h-8"/>
          <div
            className="bg-input px-3 py-2 rounded-md text-2xl font-medium uppercase w-16 text-center">
            {showSecretCode ? consignment.secretCode.substring(6, 9) : '***'}
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={() => setShowSecretCode(!showSecretCode)}>
            <EyeIcon className="h-5 w-5"/>
            <span className="sr-only">Toggle code visibility</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsignmentSecretCodeCard;