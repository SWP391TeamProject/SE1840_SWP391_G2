import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {Account} from "@/constants/interfaces.ts";
import {Separator} from "@/components/ui/separator.tsx";

interface AccountTooltipProps {
  account: Account;
  children: React.ReactNode; // Content to be displayed within TooltipTrigger
}

const AccountTooltip: React.FC<AccountTooltipProps> = ({ account, children }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent className="p-5 flex flex-col gap-3">
          <h1 className="text-lg font-semibold">{account.nickname}</h1>
          <p>ID: {account.accountId}</p>
          <Separator />
          <p>Click to view details</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AccountTooltip;