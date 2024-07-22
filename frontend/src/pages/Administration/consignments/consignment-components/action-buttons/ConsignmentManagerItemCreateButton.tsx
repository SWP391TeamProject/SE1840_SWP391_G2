import Consignment from "@/models/consignment.ts";
import {useState} from "react";
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
import {Button} from "@/components/ui/button.tsx";
import {takeConsignment} from "@/services/ConsignmentService.tsx";
import {toast} from "sonner";
import {useAuth} from "@/AuthProvider.tsx";
import {Roles} from "@/constants/enums.tsx";

interface ConsignmentManagerItemCreateButtonProps {
  consignment: Consignment;
  setConsignment: (v: Consignment) => void;
}

const ConsignmentManagerItemCreateButton: React.FC<ConsignmentManagerItemCreateButtonProps> = ({
                                                                                 consignment,
                                                                                 setConsignment
                                                                               }) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const handleTake = () => {
    setLoading(true);

  };

  return (
    auth.user.role === Roles.MANAGER ?
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="default" disabled={loading}>Create item?</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will link the item with this consignment. You might edit the item later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading}
              onClick={() => handleTake()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> :
      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
        <h2 className="text-2xl font-bold mb-4">Information</h2>
        <p>Waiting for manager to create the item</p>
      </div>
  )
};

export default ConsignmentManagerItemCreateButton;