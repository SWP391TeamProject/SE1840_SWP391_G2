import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchConsignmentByConsignmentId } from '@/services/ConsignmentService.tsx';
import { toast } from 'sonner';
import Consignment from '@/models/consignment.ts';
import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation.tsx';
import ConsignmentDetailCard from '@/components/ConsignmentDetailCard.tsx';
import ConsignmentHistoryCard from '@/components/ConsignmentHistoryCard.tsx';
import CustomerConsignmentIntroCard from '@/pages/CustomerSite/dashboard/consignment/CustomerConsignmentIntroCard.tsx';
import ConsignmentSecretCodeCard from '@/components/ConsignmentSecretCodeCard.tsx';

export default function CustomerConsignmentDetail() {
  const consignmentId = parseInt(useParams().id);
  const [isLoading, setIsLoading] = useState(true);
  const [consignment, setConsignment] = useState<Consignment>(undefined);

  useEffect(() => {
    setIsLoading(true);
    toast.promise(fetchConsignmentByConsignmentId(consignmentId), {
      loading: 'Loading consignment...',
      success: (res) => {
        setIsLoading(false);
        setConsignment(res.data);
        return `Consignment loaded successfully!`;
      },
      error: (err) => `An error occurred: ${err.message}`,
    });
  }, []);

  return isLoading ? (
    <LoadingAnimation />
  ) : (
    <>
      <div className="grid grid-cols-5 gap-6 px-20 pt-16 pb-32">
        <div className="col-span-3 flex flex-col gap-6 flex-wrap">
          <CustomerConsignmentIntroCard consignment={consignment} setConsignment={setConsignment} />
          <ConsignmentDetailCard consignment={consignment} />
        </div>
        <div className="col-span-2 flex flex-col gap-6 flex-wrap">
          {consignment.secretCode && (
            <ConsignmentSecretCodeCard
              consignment={consignment}
              message="This is the secret code you should give to the staff to prove your identity.
                                       Remember to keep it secret. The code will never be changed."
            />
          )}
          <ConsignmentHistoryCard consignment={consignment} />
        </div>
      </div>
    </>
  );
}
