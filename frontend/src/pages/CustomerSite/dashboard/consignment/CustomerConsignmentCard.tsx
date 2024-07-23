import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import Consignment from '@/models/consignment';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ConsignmentDetailType, ConsignmentStatus } from '@/constants/enums.tsx';
import { Button } from '@/components/ui/button.tsx';

interface CustomerConsignmentCardProps {
  consignment: Consignment;
}

const CustomerConsignmentCard: React.FC<CustomerConsignmentCardProps> = ({ consignment }) => {
  const [message, setMessage] = React.useState<string>('');
  const [ping, setPing] = React.useState<boolean>(false);

  useEffect(() => {
    switch (consignment.status) {
      case ConsignmentStatus.WAITING_STAFF: {
        setMessage('Staff will take your request soon!');
        break;
      }
      case ConsignmentStatus.IN_INITIAL_EVALUATION: {
        if (consignment.consignmentDetails.some((v) => v.type === ConsignmentDetailType.INITIAL_EVALUATION)) {
          setMessage('A staff has sent an initial evaluation');
          setPing(true);
        } else {
          setMessage('Please waiting for initial evaluation');
        }
        break;
      }
      case ConsignmentStatus.SENDING: {
        setPing(true);
        setMessage('Please send the jewelry to Biddify office');
        break;
      }
      case ConsignmentStatus.IN_FINAL_EVALUATION: {
        setMessage('We are evaluating your jewelry');
        break;
      }
      case ConsignmentStatus.WAITING_SELLER: {
        setPing(true);
        setMessage('Please respond to the final evaluation');
        break;
      }
      case ConsignmentStatus.TO_ITEM: {
        setMessage('Your jewelry will be listed for public soon!');
        break;
      }
      case ConsignmentStatus.FINISHED: {
        setMessage('This consignment is completed. Check out your jewelry page!');
        break;
      }
      case ConsignmentStatus.TERMINATED: {
        setMessage('This consignment has been terminated');
        break;
      }
      default: {
        break;
      }
    }
  }, []);

  return (
    <>
      <Card className="w-[350px] relative">
        {ping && <div className="w-4 h-4 rounded-full bg-red-500 animate-ping absolute absolute right-0 top-0" />}
        <CardHeader className="w-full">
          {consignment ? (
            <img
              src={consignment?.attachments[0]?.link}
              alt="Auction Item"
              className="rounded-t-lg object-cover"
              height="225"
              style={{ aspectRatio: '400/225', objectFit: 'cover' }}
            />
          ) : (
            <img
              src="https://via.placeholder.com/400x225"
              alt="Auction Item"
              className="rounded-t-lg object-cover"
              height="225"
              style={{ aspectRatio: '400/225', objectFit: 'cover' }}
            />
          )}
          <CardTitle className="text-2xl font-semibold">Consignment #{consignment.consignmentId}</CardTitle>
          <CardDescription>
            <p>{formatDate(consignment.createDate)}</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="mb-5">{message}</p>
          <Button size="sm" asChild>
            <Link to={`/dashboard/consignments/${consignment.consignmentId}`}>View details</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default CustomerConsignmentCard;
