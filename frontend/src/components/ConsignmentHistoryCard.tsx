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

interface ConsignmentHistoryCardProps {
  consignment: Consignment;
  className?: string;
}

const ConsignmentHistoryCard: React.FC<ConsignmentHistoryCardProps> = ({ consignment, className }) => {
  const currency = useCurrency();
  const auth = useAuth();

  const messages = {
    INITIAL_EVALUATION: (cd: ConsignmentDetail) => `sent an initial evaluation of ${currency.format(cd.price)}`,
    FINAL_EVALUATION: (cd: ConsignmentDetail) => `sent a final evaluation of ${currency.format(cd.price)}`,
    MANAGER_REJECTED: (cd: ConsignmentDetail) => `has rejected the evaluation of ${currency.format(cd.price)}`,
    MANAGER_ACCEPTED: (cd: ConsignmentDetail) => `has accepted the evaluation of ${currency.format(cd.price)}`,
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-3xl">Activity History</CardTitle>
        <CardDescription>This is where you can see the history of this consignment</CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden flex flex-col gap-6">
        {consignment.consignmentDetails
          .filter(
            (cd) =>
              auth.user.role !== Roles.MEMBER ||
              cd.type === ConsignmentDetailType.INITIAL_EVALUATION ||
              cd.type === ConsignmentDetailType.MANAGER_ACCEPTED
          )
          .sort((a, b) => b.consignmentDetailId - a.consignmentDetailId)
          .map((cd) => (
            <div className="flex flex-col" key={cd.consignmentDetailId}>
              <div className="flex flex-row justify-between gap-2">
                <p className="font-semibold text-lg flex flex-row gap-3">
                  <AccountRoleBadge role={cd.account.role} />
                  <p>{cd.account.nickname}</p>
                </p>
                <p>{formatDateTime(cd.createDate)}</p>
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

        <div className="flex flex-col flex-row">
          <div className="flex flex-row justify-between gap-2">
            <p className="font-semibold text-lg flex flex-row gap-3">
              <AccountRoleBadge role={consignment.user.role} />
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
