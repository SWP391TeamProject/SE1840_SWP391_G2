import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button.tsx';
import { BadgeCheck, ScanSearch } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useEffect, useState } from 'react';
import { fetchConsignmentBySecretCode } from '@/services/ConsignmentService.tsx';
import { toast } from 'sonner';
import Consignment from '@/models/consignment.ts';
import { Input } from '@/components/ui/input.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Link } from 'react-router-dom';
import AccountTooltip from '@/pages/Administration/Tooltip/AccountTooltip.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import ConsignmentStatusBadge from '@/components/ConsignmentStatusBadge.tsx';

type FormData = {
  code?: string;
};

export function ConsignmentsSecretCodeFinder() {
  const form = useForm<FormData>({
    defaultValues: {
      code: '',
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastCode, setLastCode] = useState<string>(undefined);
  const [consignment, setConsignment] = useState<Consignment>(undefined);
  const formValues = form.watch();

  useEffect(() => {
    const handleFieldChange = () => {
      const code = formValues.code.replace(/\s+/g, '');
      if (code && code.length === 9 && /^[a-fA-F0-9]+$/.test(code) && !isLoading && lastCode !== code) {
        setConsignment(undefined);
        setLastCode(code);
        setIsLoading(true);
        toast.promise(fetchConsignmentBySecretCode(code), {
          loading: 'Loading consignment...',
          success: (res) => {
            setIsLoading(false);
            setConsignment(res.data);
            return `Consignment loaded successfully!`;
          },
          error: () => {
            setIsLoading(false);
            setConsignment(undefined);
            return `Consignment not found!`;
          },
        });
      }
    };
    handleFieldChange();
  }, [formValues]);

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="outline" size="sm">
          <ScanSearch className="mr-2 size-4" aria-hidden="true" />
          Secret code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <h1 className="text-2xl font-semibold">Find consignment by Secret Code</h1>
        <div>
          <Form {...form}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="text" placeholder="Enter the secret code to search" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </Form>
        </div>
        {consignment && (
          <div>
            <Separator />
            <div className="flex flex-col gap-3 mb-5">
              <h2 className="text-lg mt-5 font-semibold">Consignment #{consignment.consignmentId}</h2>
              <ConsignmentStatusBadge status={consignment.status} />
              <p className="">Secret code: {consignment.secretCode}</p>
              {consignment.contactName && <p>Contact Name: {consignment.contactName}</p>}
              {consignment.contactEmail && <p>Contact Name: {consignment.contactEmail}</p>}
              {consignment.contactPhone && <p>Contact Name: {consignment.contactPhone}</p>}
              <p className="">
                Initiated by:&nbsp;
                <AccountTooltip account={consignment.user}>
                  <Link
                    to={`/admin/customers/${consignment.user.accountId}`}
                    className="flex justify-center items-center gap-2"
                  >
                    {consignment.user.kyc && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <BadgeCheck className="size-5" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>KYC Verified</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    {consignment.user.nickname}
                  </Link>
                </AccountTooltip>
              </p>
            </div>
            <Button size="sm" asChild>
              <Link to={`/admin/consignments/${consignment.consignmentId}`}>View details</Link>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
