import {AuctionSessionStatus} from '@/constants/enums.tsx';
import { Badge } from '@/components/ui/badge.tsx';

interface AuctionStatusBadgeProps {
  status: AuctionSessionStatus;
  className?: string;
}

const AuctionStatusBadge: React.FC<AuctionStatusBadgeProps> = ({ status, className }) => {
  switch (status) {
    case AuctionSessionStatus.SCHEDULED:
      return (
        <Badge
          variant="default"
          className={`bg-gray-500 hover:bg-gray-500 text-center flex justify-center items-center ${className}`}
        >
          Scheduled
        </Badge>
      );
    case AuctionSessionStatus.PROGRESSING:
      return (
        <Badge
          variant="default"
          className={`bg-green-500 hover:bg-green-500 text-center flex justify-center items-center ${className}`}
        >
          Progressing
        </Badge>
      );
    case AuctionSessionStatus.FINISHED:
      return (
        <Badge
          variant="default"
          className={`bg-indigo-500 hover:bg-red-500 text-center flex justify-center items-center ${className}`}
        >
          Finished
        </Badge>
      );
    case AuctionSessionStatus.TERMINATED:
      return (
        <Badge
          variant="default"
          className={`bg-red-500 hover:bg-red-500 text-center flex justify-center items-center ${className}`}
        >
          Terminated
        </Badge>
      );
    default:
      return <Badge variant="destructive">Unknown Status</Badge>;
  }
};

export default AuctionStatusBadge;
