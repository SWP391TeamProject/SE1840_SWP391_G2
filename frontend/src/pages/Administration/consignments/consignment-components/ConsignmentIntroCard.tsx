import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import Consignment from '@/models/consignment.ts';
import ConsignmentStatusBadge from '@/components/ConsignmentStatusBadge.tsx';
import { formatDate } from '@/lib/utils.ts';
import { ConsignmentDetailType, ConsignmentStatus } from '@/constants/enums.tsx';
import React from 'react';
import ConsignmentStaffTakeButton from '@/pages/Administration/consignments/consignment-components/action-buttons/ConsignmentStaffTakeButton.tsx';
import ConsignmentInitialEvaluationForm from '@/pages/Administration/consignments/consignment-components/action-buttons/ConsignmentInitialEvaluationForm.tsx';
import ConsignmentStaffItemReceiveButton from '@/pages/Administration/consignments/consignment-components/action-buttons/ConsignmentStaffItemReceiveButton.tsx';
import ConsignmentFinalEvaluationForm from '@/pages/Administration/consignments/consignment-components/action-buttons/ConsignmentFinalEvaluationForm.tsx';
import ManagerFinalEvaluationForm from '@/pages/Administration/consignments/consignment-components/action-buttons/ManagerFinalEvaluationForm.tsx';
import ConsignmentManagerItemCreateButton from '@/pages/Administration/consignments/consignment-components/action-buttons/ConsignmentManagerItemCreateButton.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';

interface ConsignmentIntroCardProps {
  consignment: Consignment;
  className?: string;
  setConsignment: (v: Consignment) => void;
}

const ConsignmentIntroCard: React.FC<ConsignmentIntroCardProps> = ({ consignment, className, setConsignment }) => {
  const Action = () => {
    switch (consignment.status) {
      case ConsignmentStatus.WAITING_STAFF: {
        return <ConsignmentStaffTakeButton consignment={consignment} setConsignment={setConsignment} />;
      }
      case ConsignmentStatus.IN_INITIAL_EVALUATION: {
        return <ConsignmentInitialEvaluationForm consignment={consignment} setConsignment={setConsignment} />;
      }
      case ConsignmentStatus.SENDING: {
        return <ConsignmentStaffItemReceiveButton consignment={consignment} setConsignment={setConsignment} />;
      }
      case ConsignmentStatus.IN_FINAL_EVALUATION: {
        const details = consignment.consignmentDetails.sort((a, b) => b.consignmentDetailId - a.consignmentDetailId);

        if (details.length > 0) {
          const latest = details[0];
          if (latest.type === ConsignmentDetailType.FINAL_EVALUATION) {
            return <ManagerFinalEvaluationForm consignment={consignment} setConsignment={setConsignment} />;
          }
        }
        return <ConsignmentFinalEvaluationForm consignment={consignment} setConsignment={setConsignment} />;
      }
      case ConsignmentStatus.WAITING_SELLER: {
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <p>Waiting for customer to respond to the final evaluation</p>
          </div>
        );
      }
      case ConsignmentStatus.TO_ITEM: {
        return <ConsignmentManagerItemCreateButton consignment={consignment} />;
      }
      case ConsignmentStatus.FINISHED: {
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <p>This consignment has finished with an item created</p>
          </div>
        );
      }
      case ConsignmentStatus.TERMINATED: {
        return (
          <div className="bg-red-100 dark:bg-gray-800 rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <p>This consignment has been terminated</p>
          </div>
        );
      }
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <h2 className="text-3xl">Consignment #{consignment?.consignmentId}</h2>
          {consignment.createdItemId && (
            <Button size="sm" asChild>
              <Link to={`/item/${consignment.createdItemId}`}>View item</Link>
            </Button>
          )}
        </CardTitle>
        <CardDescription className="flex gap-3">
          Status:
          <ConsignmentStatusBadge status={consignment.status} />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Create Date:</span>&nbsp;
            {formatDate(consignment?.createDate)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Prefer Contact:</span>&nbsp;
            {consignment?.preferContact ?? 'Not provided'}
          </p>
        </div>
      </CardContent>
      <CardFooter>{Action()}</CardFooter>
    </Card>
  );
};

export default ConsignmentIntroCard;
