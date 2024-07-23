import Consignment from '@/models/consignment.ts';
import { useState } from 'react';
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
import { Button } from '@/components/ui/button.tsx';
import { takeConsignment } from '@/services/ConsignmentService.tsx';
import { toast } from 'sonner';
import { useAuth } from '@/AuthProvider.tsx';
import { Roles } from '@/constants/enums.tsx';

interface ConsignmentStaffTakeButtonProps {
  consignment: Consignment;
  setConsignment: (v: Consignment) => void;
}

const ConsignmentStaffTakeButton: React.FC<ConsignmentStaffTakeButtonProps> = ({ consignment, setConsignment }) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const handleTake = () => {
    setLoading(true);
    toast.promise(takeConsignment(consignment.consignmentId), {
      loading: 'Updating consignment...',
      success: (res) => {
        setLoading(false);
        setConsignment(res.data);
        return `Consignment taken successfully!`;
      },
      error: (err) => `An error occurred: ${err.message}`,
    });
  };

  return auth.user.role === Roles.STAFF ? (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="default" disabled={loading}>
          Take this consignment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. You must take this consignment and support the customer a long the way until
            this consignment is done.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={() => handleTake()}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
      <h2 className="text-2xl font-bold mb-4">Information</h2>
      <p>Waiting for staff to take this consignment</p>
    </div>
  );
};

export default ConsignmentStaffTakeButton;
