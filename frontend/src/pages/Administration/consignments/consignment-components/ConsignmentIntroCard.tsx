import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card.tsx";
import Consignment from "@/models/consignment.ts";
import ConsignmentStatusBadge
  from "@/components/ConsignmentStatusBadge.tsx";
import {formatDate} from "@/lib/utils.ts";
import {getCookie} from "@/utils/cookies.ts";
import {
  ConsignmentDetailType,
  ConsignmentStatus,
  Roles
} from "@/constants/enums.tsx";
import SendEvaluationForm
  from "@/pages/Administration/consignments/consignment-components/SendEvaluation.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Button} from "@/components/ui/button.tsx";
import React, {useState} from "react";
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
import {
  acceptEvaluation,
  receivedConsignment,
  rejectEvaluation
} from "@/services/ConsignmentService.tsx";
import {toast} from "sonner";
import {showErrorToast} from "@/lib/handle-error.ts";
import {useNavigate} from "react-router-dom";
import ConsignmentStaffTakeButton
  from "@/pages/Administration/consignments/consignment-components/action-buttons/ConsignmentStaffTakeButton.tsx";
import ConsignmentInitialEvaluationForm
  from "@/pages/Administration/consignments/consignment-components/action-buttons/ConsignmentInitialEvaluationForm.tsx";
import ConsignmentStaffItemReceiveButton
  from "@/pages/Administration/consignments/consignment-components/action-buttons/ConsignmentStaffItemReceiveButton.tsx";
import ConsignmentFinalEvaluationForm
  from "@/pages/Administration/consignments/consignment-components/action-buttons/ConsignmentFinalEvaluationForm.tsx";
import ManagerFinalEvaluationForm
  from "@/pages/Administration/consignments/consignment-components/action-buttons/ManagerFinalEvaluationForm.tsx";
import ConsignmentManagerItemCreateButton
  from "@/pages/Administration/consignments/consignment-components/action-buttons/ConsignmentManagerItemCreateButton.tsx";

interface ConsignmentIntroCardProps {
  consignment: Consignment;
  className?: string;
  setConsignment: (v: Consignment) => void;
}

const ConsignmentIntroCard: React.FC<ConsignmentIntroCardProps> = ({
                                                                     consignment,
                                                                     className,
                                                                     setConsignment
                                                                   }) => {
  const nav = useNavigate();
  const [state, setState] = useState(false);

  const ConfirmReceive = (consignmentId: any) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="default">Confirm item received</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleRecieve(consignmentId);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const handleRecieve = (consignmentId: any) => {
    receivedConsignment(consignmentId?.consignmentId)
      .then((res) => {
        console.log(res);
        setConsignment(res.data);
        toast.success('Received consignment successfully', {});
        setState(!state);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
      });
  };

  const handleCreateItem = () => {
    const price = consignment?.consignmentDetails?.filter((detail) => {
      return detail.status === ConsignmentDetailType.MANAGER_ACCEPTED;
    })[0].price;
    const ownerId = consignment?.user?.accountId;
    if (!price || !ownerId || !consignment) {
      return;
    }
    nav('/admin/items/create', {
      state: {
        price: price.toString(),
        ownerId: ownerId,
        consignmentId: consignment.consignmentId
      },
    });
  };

  const callBackFunction = () => {
    setState(!state);
  };
  // const Action1 = () => {
  //   const length = consignment?.consignmentDetails?.length;
  //   if (JSON.parse(getCookie('user')).role === Roles.STAFF) {
  //     if (consignment?.status === ConsignmentStatus.IN_INITIAL_EVALUATION) {
  //       if (!consignment?.consignmentDetails?.some((detail) => detail?.status === 'INITIAL_EVALUATION')) {
  //         return <SendEvaluationForm callBack={() => callBackFunction()}
  //                                    consignmentParent={consignment}/>;
  //       } else {
  //         return <Badge className="bg-amber-400">Waiting Seller Accept</Badge>;
  //       }
  //     }
  //     if (consignment?.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
  //       if (consignment?.consignmentDetails?.some((detail) => detail?.status === 'MANAGER_ACCEPTED')) {
  //         return <Badge className="bg-green-300">Success</Badge>;
  //       } else if (consignment?.consignmentDetails[length - 1]?.status === 'FINAL_EVALUATION') {
  //         return <Badge className="bg-amber-400">Waiting Manager Accept</Badge>;
  //       } else {
  //         return <SendEvaluationForm callBack={() => callBackFunction()}
  //                                    consignmentParent={consignment}/>;
  //       }
  //     }
  //     if (consignment?.status === ConsignmentStatus.SENDING) {
  //       return <ConfirmReceive consignmentId={consignment?.consignmentId}/>;
  //     }
  //     if (consignment?.status === ConsignmentStatus.WAITING_STAFF) {
  //       return <ConfirmReceive consignmentId={consignment?.consignmentId}/>;
  //       // return <ConfirmTake consignmentId={consignment?.consignmentId}/>;
  //     }
  //   } else if (JSON.parse(getCookie('user')).role === Roles.MANAGER) {
  //     if (consignment?.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
  //       if (consignment?.consignmentDetails[length - 1]?.status === 'FINAL_EVALUATION') {
  //         return (
  //           <>
  //             <Button
  //               className="bg-red-400 mr-16 w-24"
  //               onClick={() => rejectConsignment(consignment.consignmentId, null)}
  //             >
  //               Reject
  //             </Button>
  //             <Button className="bg-green-400  mr-16 w-24"
  //                     onClick={() => acceptConsignment(consignment.consignmentId)}>
  //               Accept
  //             </Button>
  //           </>
  //         );
  //       }
  //     }
  //     if (consignment?.status === ConsignmentStatus.TO_ITEM) {
  //       return <Button onClick={() => handleCreateItem()}>Create Item</Button>;
  //     }
  //   }
  // };


  const Action = () => {
    switch (consignment.status) {
      case ConsignmentStatus.WAITING_STAFF: {
        return (<ConsignmentStaffTakeButton consignment={consignment} setConsignment={setConsignment} />)
      }
      case ConsignmentStatus.IN_INITIAL_EVALUATION: {
        return (<ConsignmentInitialEvaluationForm consignment={consignment} setConsignment={setConsignment} />)
      }
      case ConsignmentStatus.SENDING: {
        return (<ConsignmentStaffItemReceiveButton consignment={consignment} setConsignment={setConsignment} />)
      }
      case ConsignmentStatus.IN_FINAL_EVALUATION: {
        const details = consignment.consignmentDetails
          .sort((a, b) => b.consignmentDetailId - a.consignmentDetailId);

        if (details.length > 0) {
          const latest = details[0];
          if (latest.type === ConsignmentDetailType.FINAL_EVALUATION) {
            return (<ManagerFinalEvaluationForm consignment={consignment} setConsignment={setConsignment} />)
          }
        }
        return (<ConsignmentFinalEvaluationForm consignment={consignment} setConsignment={setConsignment} />)
      }
      case ConsignmentStatus.WAITING_SELLER: {
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <p>Waiting for customer to respond to the final evaluation</p>
          </div>)
      }
      case ConsignmentStatus.TO_ITEM: {
        return (<ConsignmentManagerItemCreateButton consignment={consignment} setConsignment={setConsignment} />)
      }
      case ConsignmentStatus.TERMINATED: {
        return (
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 w-full">
            <h2 className="text-2xl font-bold mb-4">Information</h2>
            <p>This consignment has been terminated</p>
          </div>)
      }
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-3xl">Consignment
          #{consignment?.consignmentId}</CardTitle>
        <CardDescription className="flex gap-3">
          Status:
          <ConsignmentStatusBadge status={consignment.status}/>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">Create Date:</span>&nbsp;
            {formatDate(consignment?.createDate)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Prefer Contact:</span>&nbsp;
            {consignment?.preferContact ?? 'Not provided'}
          </p>
        </div>
      </CardContent>
      <CardFooter>{Action()}</CardFooter>
    </Card>
  );
};

export default ConsignmentIntroCard;