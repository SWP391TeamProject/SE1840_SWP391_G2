import { AuctionSession } from '@/models/AuctionSessionModel';
import { getAuctionSessionById } from '@/services/AuctionSessionService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/handle-error';
import { AuctionDetailCard } from '@/pages/Administration/Auction-session/Auction-Session-Detail/AuctionDetailCard.tsx';
import { AuctionItemListCard } from '@/pages/Administration/Auction-session/Auction-Session-Detail/AuctionItemListCard.tsx';
import { AuctionStateCard } from '@/pages/Administration/Auction-session/Auction-Session-Detail/AuctionStateCard.tsx';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation.tsx';
import { AuctionSessionStatus } from '@/constants/enums.tsx';
import { AuctionControlCard } from '@/pages/Administration/Auction-session/Auction-Session-Detail/AuctionControlCard.tsx';

export default function AuctionSessionView() {
  const auctionId = parseInt(useParams<{ id: string }>().id);
  const [auction, setAuction] = useState<AuctionSession>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    toast.promise(getAuctionSessionById(auctionId), {
      loading: 'Loading Auction Session...',
      success: (res) => {
        setIsLoading(false);
        setAuction(res.data);
        return 'Auction Session Loaded Successfully';
      },
      error: (error) => {
        return getErrorMessage(error);
      },
    });
  }, []);

  return isLoading ? (
    <LoadingAnimation />
  ) : (
    <div className="flex flex-row w-full gap-3 p-3">
      <div className="basis-8/12 flex flex-col gap-2">
        <AuctionStateCard auction={auction} />
        <AuctionItemListCard auction={auction} />
      </div>
      <div className="grow flex flex-col gap-2">
        {(auction.status === AuctionSessionStatus.SCHEDULED || auction.status === AuctionSessionStatus.PROGRESSING) && (
          <AuctionControlCard auction={auction} />
        )}
        <AuctionDetailCard auction={auction} />
      </div>
    </div>
  );
}
