import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {AuctionSession} from "@/models/AuctionSessionModel.ts";
import {AuctionSessionStatus} from "@/models/newModel/auctionSession.ts";
import {
  ConfirmationButton
} from "@/components/confirmation/confirmation-button.tsx";
import {useState} from "react";
import {
  terminateAuctionSession
} from "@/services/AuctionSessionService.tsx";
import {toast} from "sonner";
import {getErrorMessage} from "@/lib/handle-error.ts";

export const AuctionControlCard: React.FC<{
  auction: AuctionSession
}> = ({auction}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleTerminateSession = () => {
    if (isLoading) return;
    setIsLoading(true);
    const terminateAuctionSessionPromise = terminateAuctionSession(auction.auctionSessionId);
    toast.promise(terminateAuctionSessionPromise, {
      loading: 'Terminating Auction Session...',
      success: () => {
        window.location.reload();
        setIsLoading(false);
        return 'Auction Session Terminated Successfully';
      },
      error: (error) => {
        setIsLoading(false);
        return getErrorMessage(error);
      },
    });
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions</CardTitle>
        <CardDescription>Actions that can be performed on the auction
          session</CardDescription>
      </CardHeader>
      <CardContent className="flex">
        {(auction?.status !== AuctionSessionStatus.FINISHED &&
          auction?.status !== AuctionSessionStatus.TERMINATED) && (
          <>
            <ConfirmationButton
              onSuccess={handleTerminateSession}
              message={'Are you sure to Terminate this session?'}
              title={'Confirmation'}
              label={'Terminate'}
              description={'This action cannot be undone.'}
              className="m-2"
            >
              Terminate Session
            </ConfirmationButton>
          </>
        )}
      </CardContent>
    </Card>
  );
}
