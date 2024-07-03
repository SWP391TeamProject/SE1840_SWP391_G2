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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
export default function KycVerificationPopup() {


    const nav = useNavigate();
    const handleVerify = () => {
        nav("/profile/kyc");
        console.log("Verify KYC");
    }

    return <>
        <AlertDialog defaultOpen >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>KYC Verification Required</AlertDialogTitle>
                    <AlertDialogDescription>
                        To continue using all features, please complete your KYC verification. This process is quick and ensures your account security.
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
    </>;
}
