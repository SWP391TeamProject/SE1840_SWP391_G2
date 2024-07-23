import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import Consignment from '@/models/consignment.ts';
import ConsignmentStatusBadge from '@/components/ConsignmentStatusBadge.tsx';
import { formatDate } from '@/lib/utils.ts';
import { ConsignmentStatus } from '@/constants/enums.tsx';
import CustomerInitialEvaluationForm from '@/pages/CustomerSite/dashboard/consignment/action-buttons/CustomerInitialEvaluationForm.tsx';
import React from 'react';
import CustomerFinalEvaluationForm from '@/pages/CustomerSite/dashboard/consignment/action-buttons/CustomerFinalEvaluationForm.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';

interface CustomerConsignmentIntroCardProps {
  consignment: Consignment;
  className?: string;
  setConsignment: (v: Consignment) => void;
}

const CustomerConsignmentIntroCard: React.FC<CustomerConsignmentIntroCardProps> = ({
  consignment,
  className,
  setConsignment,
}) => {
  const Action = () => {
    switch (consignment.status) {
      case ConsignmentStatus.IN_INITIAL_EVALUATION: {
        return <CustomerInitialEvaluationForm consignment={consignment} setConsignment={setConsignment} />;
      }
      case ConsignmentStatus.SENDING: {
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Your action</h2>
            <p>Please send the jewelry to our office for further evaluation.
              Give the secret code in the top right corner to the staff to prove your identity.</p>
          </div>
        );
      }
      case ConsignmentStatus.IN_FINAL_EVALUATION: {
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <p>Your jewelry is under evaluation by our experts</p>
          </div>
        );
      }
      case ConsignmentStatus.WAITING_SELLER: {
        return <CustomerFinalEvaluationForm consignment={consignment} setConsignment={setConsignment} />;
      }
      case ConsignmentStatus.TO_ITEM: {
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <p>Your jewelry will be listed for public soon</p>
          </div>
        );
      }
      case ConsignmentStatus.FINISHED: {
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <p>A dedicated page has been made for your jewelry. You might check everything about it there.</p>
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
              <Link to={`/jewelries/${consignment.createdItemId}`}>View item</Link>
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

export default CustomerConsignmentIntroCard;
