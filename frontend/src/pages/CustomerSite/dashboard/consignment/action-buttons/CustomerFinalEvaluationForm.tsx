import Consignment from "@/models/consignment.ts";
import React, {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";
import {
  acceptFinalEva,
  rejectFinalEva,
} from "@/services/ConsignmentService.tsx";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog.tsx";

interface CustomerFinalEvaluationFormProps {
  consignment: Consignment;
  setConsignment: (v: Consignment) => void;
}

const CustomerFinalEvaluationForm: React.FC<CustomerFinalEvaluationFormProps> = ({
                                                                                   consignment,
                                                                                   setConsignment
                                                                                 }) => {
  const [loading, setLoading] = useState(false);

  const acceptEvaluation = () => {
    setLoading(true);
    toast.promise(acceptFinalEva(consignment.consignmentId), {
      loading: 'Accepting...',
      success: (res) => {
        setLoading(false);
        setConsignment(res.data);
        return 'Final Evaluation Accepted';
      },
      error: (err) => `An error occurred: ${err.message}`,
    });
  };

  const rejectEvaluation = () => {
    setLoading(true);
    toast.promise(rejectFinalEva(consignment.consignmentId), {
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
    <div className="flex flex-row gap-6">
      <AlertDialog>
        <AlertDialogTrigger>
          <Button className="bg-green-500 text-white" disabled={loading}>
            I am satisfied
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Once you have accepted, we will list the jewelry on an upcoming
              auction. We will notice
              you for further updates. Once your item is sold successfully, the
              revenue will be
              transferred to your Biddify wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading}
                               onClick={() => acceptEvaluation()}>Continue</AlertDialogAction>
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
            <AlertDialogDescription>
              This will cancel this consignment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading}
                               onClick={() => rejectEvaluation()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CustomerFinalEvaluationForm;