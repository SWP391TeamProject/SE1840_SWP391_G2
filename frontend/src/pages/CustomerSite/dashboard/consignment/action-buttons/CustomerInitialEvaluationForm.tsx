import Consignment from '@/models/consignment.ts';
import {ConsignmentDetailType} from '@/constants/enums.tsx';
import React, {useState} from 'react';
import {Button} from '@/components/ui/button.tsx';
import {toast} from 'sonner';
import {
  acceptInitialEva,
  rejectInitialEva
} from '@/services/ConsignmentService.tsx';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog.tsx';
import {useCurrency} from "@/CurrencyProvider.tsx";

interface CustomerInitialEvaluationFormProps {
  consignment: Consignment;
  setConsignment: (v: Consignment) => void;
}

const CustomerInitialEvaluationForm: React.FC<CustomerInitialEvaluationFormProps> = ({
                                                                                       consignment,
                                                                                       setConsignment,
                                                                                     }) => {
  const [loading, setLoading] = useState(false);
  const currency = useCurrency();

  if (consignment.consignmentDetails.every((v) => v.type !== ConsignmentDetailType.INITIAL_EVALUATION)) {
    return (
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">Information</h2>
        <p>A staff is evaluating your jewelry for initial evaluation</p>
      </div>
    );
  }

  const acceptEvaluation = () => {
    setLoading(true);
    toast.promise(acceptInitialEva(consignment.consignmentId), {
      loading: 'Accepting...',
      success: (res) => {
        setLoading(false);
        setConsignment(res.data);
        return 'Initial Evaluation Accepted';
      },
      error: (err) => `An error occurred: ${err.message}`,
    });
  };

  const rejectEvaluation = () => {
    setLoading(true);
    toast.promise(rejectInitialEva(consignment.consignmentId), {
      loading: 'Rejecting...',
      success: (res) => {
        setLoading(false);
        setConsignment(res.data);
        return 'Consignment cancelled';
      },
      error: (err) => `An error occurred: ${err.message}`,
    });
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">Information</h2>
        <p>The staff has evaluated that your jewelry is worth {currency.format(
          consignment.consignmentDetails.filter(detail =>
            detail.type === ConsignmentDetailType.INITIAL_EVALUATION)
            .sort((a, b) =>
              (b.consignmentDetailId ?? 0) - (a.consignmentDetailId ?? 0))
            .map(cd => cd.price)[0]
        )}</p>
      </div>
      <div className="flex flex-row gap-6">
        <AlertDialog>
          <AlertDialogTrigger>
            <Button className="bg-green-500 text-white" disabled={loading}>
              Proceed to send item
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                One you have accepted, please send the jewelry to our office for
                comprehensive evaluation from our
                experts. The worth of your item might subject to change.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={loading}
                                 onClick={() => acceptEvaluation()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger>
            <Button className="bg-red-500 text-white" disabled={loading}>
              Close the request
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This will cancel this
                consignment.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={loading}
                                 onClick={() => rejectEvaluation()}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CustomerInitialEvaluationForm;
