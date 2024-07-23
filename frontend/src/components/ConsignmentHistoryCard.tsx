import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import Consignment from '@/models/consignment.ts';
import { formatDateTime } from '@/lib/utils.ts';
import { ConsignmentDetail } from '@/models/newModel/ConsignmentDetail.ts';
import { useCurrency } from '@/CurrencyProvider.tsx';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ConsignmentAttachmentGallery from '@/pages/Administration/consignments/consignment-components/ConsignmentAttachmentGallery.tsx';
import { useAuth } from '@/AuthProvider.tsx';
import { ConsignmentDetailType, Roles } from '@/constants/enums.tsx';
import AccountRoleBadge from '@/components/AccountRoleBadge.tsx';
import { useEffect, useState } from 'react';

interface ConsignmentHistoryCardProps {
  consignment: Consignment;
  className?: string;
}

function filterConsignmentDetails(consignmentDetails: ConsignmentDetail[], isMember: boolean): ConsignmentDetail[] {
  if (!isMember) {
    return consignmentDetails.sort((a, b) => (b.consignmentDetailId ?? 0) - (a.consignmentDetailId ?? 0));
  }

  const initialEvaluations = consignmentDetails.filter(
    (detail) => detail.type === ConsignmentDetailType.INITIAL_EVALUATION
  );
  const managerAccepted = consignmentDetails.some((detail) => detail.type === ConsignmentDetailType.MANAGER_ACCEPTED);

  if (managerAccepted) {
    const fe = consignmentDetails.filter((detail) => detail.type === ConsignmentDetailType.FINAL_EVALUATION);
    if (fe.length > 0) {
      const lfe = fe.reduce((prev, curr) =>
        (curr.consignmentDetailId ?? 0) > (prev.consignmentDetailId ?? 0) ? curr : prev
      );
      initialEvaluations.push(lfe);
    }
  }

  return initialEvaluations.sort((a, b) => (b.consignmentDetailId ?? 0) - (a.consignmentDetailId ?? 0));
}

const ConsignmentHistoryCard: React.FC<ConsignmentHistoryCardProps> = ({ consignment, className }) => {
  const currency = useCurrency();
  const auth = useAuth();
  const [details, setDetails] = useState<ConsignmentDetail[]>([]);

  const messages = {
    INITIAL_EVALUATION: (cd: ConsignmentDetail) => `sent an initial evaluation of ${currency.format(cd.price)}`,
    FINAL_EVALUATION: (cd: ConsignmentDetail) => `sent a final evaluation of ${currency.format(cd.price)}`,
    MANAGER_REJECTED: (cd: ConsignmentDetail) => `has rejected the evaluation of ${currency.format(cd.price)}`,
    MANAGER_ACCEPTED: (cd: ConsignmentDetail) => `has accepted the evaluation of ${currency.format(cd.price)}`,
  };

  useEffect(() => {
    setDetails(filterConsignmentDetails(consignment.consignmentDetails, auth.user.role === Roles.MEMBER));
  }, [consignment]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-3xl">Activity History</CardTitle>
        <CardDescription>This is where you can see the history of this consignment</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden flex flex-col gap-6">
        {details
          .sort((a, b) => b.consignmentDetailId - a.consignmentDetailId)
          .map((cd) => (
            <div className="flex flex-col" key={cd.consignmentDetailId}>
              <div className="flex flex-row flex-wrap justify-between gap-2">
                <p className="font-semibold text-lg flex flex-row gap-3">
                  <div>
                    <AccountRoleBadge role={cd.account.role} />
                  </div>
                  <p>{cd.account.nickname}</p>
                </p>
                <p className="ml-auto">{formatDateTime(cd.createDate)}</p>
              </div>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    <p className="font-normal">{messages[cd.type](cd)}</p>
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-6">
                    <p>{cd.description}</p>
                    {cd.attachments && cd.attachments.length > 0 && (
                      <ConsignmentAttachmentGallery attachments={cd.attachments} />
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          ))}

        <div className="flex flex-col">
          <div className="flex flex-row flex-wrap justify-between gap-2">
            <p className="font-semibold text-lg flex flex-row gap-3">
              <div>
                <AccountRoleBadge role={consignment.user.role} />
              </div>
              <p>{consignment.user.nickname}</p>
            </p>
            <p className="ml-auto">{formatDateTime(consignment.createDate)}</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <p className="font-normal">requested item consignment.</p>
              </AccordionTrigger>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsignmentHistoryCard;
