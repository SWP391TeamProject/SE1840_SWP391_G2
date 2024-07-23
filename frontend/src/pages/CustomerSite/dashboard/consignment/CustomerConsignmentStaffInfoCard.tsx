import { Account } from '@/models/AccountModel.tsx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';

interface CustomerConsignmentStaffInfoCardProps {
  staff: Account;
  className?: string;
}

const CustomerConsignmentStaffInfoCard: React.FC<CustomerConsignmentStaffInfoCardProps> = ({ staff, className }) => {
  return (
    <Card className={className}>
      <CardContent className="overflow-hidden py-5">
        <h2 className="mb-4 flex flex-row gap-3 items-center">
          <Avatar className="hover:cursor-pointer w-16 h-16">
            <AvatarImage src={staff.avatar?.link} alt="avatar" />
            <AvatarFallback>{staff.nickname[0]}</AvatarFallback>
          </Avatar>
          <span className="text-2xl font-bold text-left">{staff.nickname}</span>
        </h2>
        <div className="flex flex-col gap-5">
          <div className="space-y-2">
            {staff.email && (
              <div className="flex justify-between">
                <span>Contact Email</span>
                <span>{staff.email}</span>
              </div>
            )}
            {staff.phone && (
              <div className="flex justify-between">
                <span>Contact Phone</span>
                <span>{staff.phone}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerConsignmentStaffInfoCard;
