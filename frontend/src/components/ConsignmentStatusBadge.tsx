import {ConsignmentStatus} from "@/constants/enums.tsx";
import {Badge} from "@/components/ui/badge.tsx";

interface ConsignmentStatusBadgeProps {
  status: ConsignmentStatus;
  className?: string;
}

const ConsignmentStatusBadge: React.FC<ConsignmentStatusBadgeProps> = ({
                                                                         status,
                                                                         className
                                                                       }) => {
  switch (status) {
    case ConsignmentStatus.WAITING_STAFF:
      return (
        <Badge
          variant="default"
          className={`bg-yellow-500 w-[150px] text-center flex justify-center items-center ${className}`}
        >
          Waiting for Staff
        </Badge>
      );
    case ConsignmentStatus.IN_INITIAL_EVALUATION:
      return (
        <Badge
          variant="default"
          className={`bg-blue-500 w-[150px] text-center flex justify-center items-center ${className}`}
        >
          In Initial Evaluation
        </Badge>
      );
    case ConsignmentStatus.IN_FINAL_EVALUATION:
      return (
        <Badge
          variant="default"
          className={`bg-indigo-500 w-[150px] text-center flex justify-center items-center ${className}`}
        >
          In Final Evaluation
        </Badge>
      );
    case ConsignmentStatus.SENDING:
      return (
        <Badge
          variant="default"
          className={`bg-purple-500 w-[150px] text-center flex justify-center items-center ${className}`}
        >
          Sending
        </Badge>
      );
    case ConsignmentStatus.TERMINATED:
      return (
        <Badge
          variant="default"
          className={`bg-red-500 w-[150px] text-center flex justify-center items-center ${className}`}
        >
          Terminated
        </Badge>
      );
    case ConsignmentStatus.WAITING_SELLER:
      return (
        <Badge
          variant="default"
          className={`bg-pink-400 w-[150px] text-center flex justify-center items-center ${className}`}
        >
          Waiting seller
        </Badge>
      );
    case ConsignmentStatus.TO_ITEM:
      return (
        <Badge
          variant="default"
          className={`bg-cyan-400 w-[150px] text-center flex justify-center items-center ${className}`}
        >
          To Item
        </Badge>
      );
    default:
      return <Badge variant="destructive">Unknown Status</Badge>;
  }
};

export default ConsignmentStatusBadge;