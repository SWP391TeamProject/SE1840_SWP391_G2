import { AlertDialogHeader } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ConsignmentDetailType, ConsignmentStatus } from '@/constants/enums';
import { getErrorMessage, showErrorToast } from '@/lib/handle-error';
import { formatDate } from '@/lib/utils';
import Consignment from '@/models/consignment';
import { acceptFinalEva, acceptInitialEva, rejectFinalEva, rejectInitialEva } from '@/services/ConsignmentService';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function CustomerConsigmentCard({ consignment }) {
  const navigate = useNavigate();

  const [custConsignment, setCusConsignment] = React.useState<Consignment>(consignment);
  console.log(custConsignment);
  if (consignment.status === ConsignmentStatus.WAITING_SELLER) {
    consignment.status = ConsignmentStatus.IN_FINAL_EVALUATION;
    setCusConsignment(consignment);
  }

  const acceptEvaluation = () => {
    if (custConsignment.status === ConsignmentStatus.IN_INITIAL_EVALUATION) {
      toast.promise(acceptInitialEva(custConsignment.consignmentId), {
        loading: 'Accepting...',
        success: (res) => {
          setCusConsignment(res.data);
          return 'Initial Evaluation Accepted';
        },
        error: (err) => {
          return getErrorMessage(err);
        },
      });

      // acceptInitialEva(custConsignment.consignmentId)
      //   .then((res) => {
      //     setCusConsignment(res.data);
      //     toast.success('Initial Evaluation Accepted', {});
      //   })
      //   .catch((err) => {
      //     showErrorToast(err);
      //   });
    } else if (custConsignment.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
      toast.promise(acceptFinalEva(custConsignment.consignmentId), {
        loading: 'Accepting...',
        success: (res) => {
          setCusConsignment(res.data);
          return 'Final Evaluation Accepted';
        },
        error: (err) => {
          return getErrorMessage(err);
        },
      });

      // acceptFinalEva(custConsignment.consignmentId)
      //   .then((res) => {
      //     setCusConsignment(res.data);
      //     toast.success('Final Evaluation Accepted', {});
      //   })
      //   .catch((err) => {
      //     showErrorToast(err);
      //   });
    }
  };
  const rejectEvaluation = () => {
    if (custConsignment.status === ConsignmentStatus.IN_INITIAL_EVALUATION) {
      toast.promise(rejectInitialEva(custConsignment.consignmentId), {
        loading: 'Rejecting...',
        success: (res) => {
          setCusConsignment(res.data);
          return 'Initial Evaluation Rejected';
        },
        error: (err) => {
          return getErrorMessage(err);
        },
      });

      // rejectInitialEva(custConsignment.consignmentId)
      //   .then((res) => {
      //     setCusConsignment(res.data);
      //     toast.success('Initial Evaluation Rejected', {});
      //   })
      //   .catch((err) => {
      //     showErrorToast(err);
      //   });
    } else if (custConsignment.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
      toast.promise(rejectFinalEva(custConsignment.consignmentId), {
        loading: 'Rejecting...',
        success: (res) => {
          setCusConsignment(res.data);
          return 'Final Evaluation Rejected';
        },
        error: (err) => {
          return getErrorMessage(err);
        },
      });

      // rejectFinalEva(custConsignment.consignmentId)
      //   .then((res) => {
      //     setCusConsignment(res.data);
      //     toast.success('Final Evaluation Rejected', {});
      //   })
      //   .catch((err) => {
      //     showErrorToast(err);
      //   });
    }
  };
  const ActionButton = () => {
    return (
      <div className="flex justify-evenly">
        <Button className="w-1/3 bg-red-500 text-foreground" onClick={rejectEvaluation}>
          I'm not satisfied
        </Button>
        <Button className="w-1/3 bg-green-500 text-foreground" onClick={acceptEvaluation}>
          Proceed to send item
        </Button>
      </div>
    );
  };
  const OpenConsignmentDetail = () => {
    let custConsignmentDetail = null;
    switch (consignment.status) {
      case ConsignmentStatus.WAITING_STAFF:
        custConsignmentDetail = custConsignment.consignmentDetails.filter(
          (consignmentDetail) => consignmentDetail.status === ConsignmentDetailType.REQUEST
        )[0];
        break;
      case ConsignmentStatus.IN_INITIAL_EVALUATION:
        custConsignmentDetail = custConsignment.consignmentDetails.filter(
          (consignmentDetail) => consignmentDetail.status === ConsignmentDetailType.INITIAL_EVALUATION
        )[0];
        break;
      case ConsignmentStatus.IN_FINAL_EVALUATION:
        custConsignmentDetail = custConsignment.consignmentDetails.filter(
          (consignmentDetail) => consignmentDetail.status === ConsignmentDetailType.MANAGER_ACCEPTED
        )[0];
        break;
      default:
        break;
    }
    console.log(custConsignmentDetail);

    return (
      <Dialog>
        <DialogTrigger className="w-full">
          <Button className="w-full">View Detail</Button>
        </DialogTrigger>
        <DialogContent>
          <AlertDialogHeader>
            <DialogTitle className=" text-2xl font-bold text-foreground">
              {custConsignmentDetail?.status === ConsignmentDetailType.REQUEST && 'Your Consignment Request'}
              {custConsignmentDetail?.status === ConsignmentDetailType.INITIAL_EVALUATION &&
                'Initial Evaluation of Your Consignment'}
              {custConsignmentDetail?.status === ConsignmentDetailType.MANAGER_ACCEPTED &&
                'Final Evaluation of Your Consignment'}
            </DialogTitle>
            <DialogDescription>
              <h1 className="block text-xl font-medium text-foreground">
                {custConsignmentDetail == null
                  ? 'Your consignment is in evaluation process. Please wait for the result.'
                  : 'Description'}
              </h1>
              {custConsignmentDetail?.description}
              <h1 className="block text-xl font-medium text-foreground">
                {custConsignmentDetail == null || custConsignmentDetail.status === ConsignmentDetailType.REQUEST
                  ? ''
                  : 'Price'}
              </h1>
              {custConsignmentDetail?.price}
              <div className="flex justify-center flex-wrap">
                <Link to={consignment?.attachment?.link} target="_blank" className="w-1/4 h-1/4 m-1 rounded-sm">
                  <img src={consignment?.attachment?.link} alt="attachment" className="rounded-md" />
                </Link>
              </div>
              <div className="text-foreground opacity-50">*Click on the image to download</div>
              {custConsignmentDetail?.status === ConsignmentDetailType.INITIAL_EVALUATION ||
              custConsignmentDetail?.status === ConsignmentDetailType.MANAGER_ACCEPTED ? (
                <ActionButton />
              ) : null}
            </DialogDescription>
          </AlertDialogHeader>
        </DialogContent>
      </Dialog>
    );
  };

  const handleViewDetailsClick = (consignment: any, consignmentId: number) => {
    console.log(consignment, consignmentId);
    navigate(`${consignmentId}`, {
      state: {
        consignmentId: consignmentId,
        consignment: consignment,
      },
    });
  };

  return (
    <>
      <Card className="w-[350px]  ">
        <CardHeader className="w-full">
          {custConsignment ? (
            <img
              src={custConsignment?.attachments[0]?.link}
              alt="Auction Item"
              className="rounded-t-lg object-cover"
              height="225"
              style={{ aspectRatio: '400/225', objectFit: 'cover' }}
            />
          ) : (
            <img
              src="https://via.placeholder.com/400x225"
              alt="Auction Item"
              className="rounded-t-lg object-cover"
              height="225"
              style={{ aspectRatio: '400/225', objectFit: 'cover' }}
            />
          )}
          <CardTitle className="text-lg font-semibold">ID: {custConsignment.consignmentId}</CardTitle>
          <CardDescription className="text-lg font-semibold">
            <p>Create Date: {formatDate(custConsignment.createDate)}</p>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2">
          {/* <p className="text-lg font-semibold">{custConsignment.description}</p> */}
          <div className="p-4 flex gap-3">
            <div>
              <p>
                <strong>Color:</strong> {custConsignment.color}
              </p>
              <p>
                <strong>Condition:</strong>
                {custConsignment.condition}
              </p>
              <p>
                <strong>Stamped:</strong> {custConsignment.stamped}
              </p>
            </div>
            <div>
              <p>
                <strong>Gemstone:</strong> {custConsignment.gemstone}
              </p>
              <p>
                <strong>Measurement:</strong> {custConsignment.measurement}
              </p>
              <p>
                <strong>Metal:</strong> {custConsignment.metal}
              </p>
            </div>
          </div>
          <div className="">
            {(custConsignment.status === ConsignmentStatus.WAITING_STAFF ||
              custConsignment.status === ConsignmentStatus.IN_INITIAL_EVALUATION ||
              custConsignment.status === ConsignmentStatus.IN_FINAL_EVALUATION) && (
              <Button
                onClick={() => {
                  handleViewDetailsClick(consignment, consignment.consignmentId);
                }}
                className="w-full"
              >
                View Detail
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
