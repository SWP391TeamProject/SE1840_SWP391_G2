import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
export default function KycVerificationPopup({ open, setOpen }) {
  const nav = useNavigate();
  const handleVerify = () => {
    nav('/profile/kyc');
    console.log('Verify KYC');
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>KYC Verification Required</AlertDialogTitle>
            <AlertDialogDescription>
              To participate in bidding, ease complete your KYC verification. This process is quick and ensures your
              account security.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button onClick={handleVerify}>Verify KYC</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
