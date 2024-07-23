import {Roles} from "@/constants/enums.tsx";
import {Badge} from "@/components/ui/badge.tsx";

interface AccountRoleBadgeProps {
  className?: string;
  role?: Roles;
}

const AccountRoleBadge: React.FC<AccountRoleBadgeProps> = ({
                                                             className,
                                                             role
                                                           }) => {
  switch (role) {
    case Roles.MEMBER:
      return (
        <Badge
          variant="default"
          className={`bg-gray-500 hover:bg-gray-500 ${className}`}
        >
          Member
        </Badge>
      );
    case Roles.STAFF:
      return (
        <Badge
          variant="default"
          className={`bg-blue-500 hover:bg-blue-500 ${className}`}
        >
          Staff
        </Badge>
      );
    case Roles.MANAGER:
      return (
        <Badge
          variant="default"
          className={`bg-pink-500 hover:bg-pink-500 ${className}`}
        >
          Manager
        </Badge>
      );
    case Roles.ADMIN:
      return (
        <Badge
          variant="default"
          className={`bg-red-500 hover:bg-red-500 ${className}`}
        >
          Admin
        </Badge>
      );
    default:
      return <Badge variant="destructive">Unknown Role</Badge>;
  }
};

export default AccountRoleBadge;