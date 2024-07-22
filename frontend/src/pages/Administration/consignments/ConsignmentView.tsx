import {
  fetchConsignmentByConsignmentId
} from '@/services/ConsignmentService';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import Consignment from '@/models/consignment';
import ConsignmentCustomerCard
  from "@/pages/Administration/consignments/consignment-components/ConsignmentCustomerCard.tsx";
import {Account} from "@/models/AccountModel.tsx";
import {fetchAccountById} from "@/services/AccountsServices.ts";
import LoadingAnimation from "@/components/loadingAnimation/LoadingAnimation.tsx";
import ConsignmentDetailCard
  from "@/components/ConsignmentDetailCard.tsx";
import ConsignmentHistoryCard
  from "@/components/ConsignmentHistoryCard.tsx";
import ConsignmentIntroCard
  from "@/pages/Administration/consignments/consignment-components/ConsignmentIntroCard.tsx";

export default function ConsignmentView() {
  const consignmentId = parseInt(useParams().id);

  const [isLoading, setIsLoading] = useState(true);
  const [consignment, setConsignment] = useState<Consignment>(undefined);
  const [customer, setCustomer] = useState<Account>(undefined);

  useEffect(() => {
    setIsLoading(true);
    toast.promise(fetchConsignmentByConsignmentId(consignmentId), {
      loading: 'Loading consignment...',
      success: (res) => {
        setConsignment(res.data);

        toast.promise(fetchAccountById(res.data.user.accountId), {
          loading: 'Loading customer...',
          success: (res) => {
            setIsLoading(false);
            setCustomer(res.data);
            return `Customer loaded successfully!`;
          },
          error: (err) => `An error occurred: ${err.message}`,
        })

        return `Consignment loaded successfully!`;
      },
      error: (err) => `An error occurred: ${err.message}`,
    })
  }, []);

  return (
    isLoading ? <LoadingAnimation /> : <>
        <div className="grid grid-cols-5 gap-6 p-10">
          <div className="col-span-3 flex flex-col gap-6 flex-wrap">
            <ConsignmentIntroCard consignment={consignment} setConsignment={setConsignment} />
            <ConsignmentDetailCard consignment={consignment} />
          </div>
          <div className="col-span-2 flex flex-col gap-6 flex-wrap">
            {customer != null && <ConsignmentCustomerCard customer={customer} consignment={consignment} />}
            <ConsignmentHistoryCard consignment={consignment} />
          </div>
        </div>
      </>);
}
