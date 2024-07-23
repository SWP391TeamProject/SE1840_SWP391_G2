import { Account } from '@/models/AccountModel.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { BadgeCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card.tsx';
import AccountTooltip from '@/pages/Administration/Tooltip/AccountTooltip.tsx';
import { Link } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import Consignment from '@/models/consignment.ts';

interface ConsignmentCustomerCardProps {
  customer: Account;
  consignment: Consignment;
  className?: string;
}

const ConsignmentCustomerCard: React.FC<ConsignmentCustomerCardProps> = ({ customer, consignment, className }) => {
  return (
    <Card className={className}>
      <CardContent className="overflow-hidden py-5">
        <h2 className="mb-4 flex flex-row gap-3 items-center">
          <Avatar className="hover:cursor-pointer w-16 h-16">
            <AvatarImage src={customer.avatar?.link} alt="avatar" />
            <AvatarFallback>{customer.nickname[0]}</AvatarFallback>
          </Avatar>
          <span>
            <AccountTooltip account={customer}>
              <Link to={`/admin/customers/${customer.accountId}`} className="flex justify-center items-center gap-2">
                {customer.kyc && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <BadgeCheck className="size-5" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>KYC Verified</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <span className="text-2xl font-bold">{customer.nickname}</span>
              </Link>
            </AccountTooltip>
          </span>
        </h2>
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            {consignment.contactName && (
              <div className="flex justify-between">
                <span>Contact Name</span>
                <span>{consignment.contactName}</span>
              </div>
            )}
            {consignment.contactEmail && (
              <div className="flex justify-between">
                <span>Contact Email</span>
                <span>{consignment.contactEmail}</span>
              </div>
            )}
            {consignment.contactPhone && (
              <div className="flex justify-between">
                <span>Contact Phone</span>
                <span>{consignment.contactPhone}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsignmentCustomerCard;
