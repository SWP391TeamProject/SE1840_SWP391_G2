import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/redux/hooks';
import {
  acceptEvaluation,
  fetchConsignmentByConsignmentId,
  receivedConsignment,
  rejectEvaluation,
  takeConsignment,
} from '@/services/ConsignmentService';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import ConsignmentDetailDialog from './ConsignmentDetailDialog';
import SendEvaluationForm from './SendEvaluation';
import { ConsignmentDetailType, ConsignmentStatus, Roles } from '@/constants/enums';
import { getCookie } from '@/utils/cookies';
import { Badge } from '@/components/ui/badge';
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
} from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import ConsignmentDialog from './ConsignmentDialog';
import { showErrorToast } from '@/lib/handle-error';
import Consignment from '@/models/consignment';
import { formatDate } from '@/lib/utils';

export default function ConsignmentDetail() {
  const param = useParams();
  const nav = useNavigate();

  const [consignment, setConsignment] = useState<Consignment | undefined>(undefined);
  const [state, setState] = useState(false);
  useEffect(() => {
    console.log(param);
    // dispatch(setCurrentConsignment(param.id));
    fetchConsignmentByConsignmentId(param.id)
      .then((res) => {
        console.log(res.data);
        setConsignment(res.data);
      })
      .catch((error) => {
        showErrorToast(error);
      });
  }, [state]);

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
              This action cannot be undone. This will permanently delete your account and remove your data from our
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

  const ConfirmTake = (consignmentId: any) => {
    return (
      <AlertDialog>
        <AlertDialogTrigger>
          <Button variant="default">Take this consignment</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleTake(consignmentId)}>Continue</AlertDialogAction>
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
  const handleTake = (consignmentId: any) => {
    takeConsignment(consignmentId?.consignmentId)
      .then((res) => {
        console.log(res);
        setConsignment(res.data);
        toast.success('Take consignment successfully', {});
        setState(!state);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
      });
  };

  const rejectConsignment = (consignmentId: number, reasonInput: any) => {
    console.log(consignmentId);

    const accountId = JSON.parse(getCookie('user')).id;
    const reason = reasonInput == null ? 'reject by manager' : reasonInput;
    rejectEvaluation(consignmentId.toString(), accountId, reason)
      .then((res) => {
        console.log(res);
        toast.success('Reject consignment successfully', {});
        setState(!state);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
      });
  };
  const acceptConsignment = (consignmentId: number) => {
    console.log(consignmentId);

    const accountId = JSON.parse(getCookie('user')).id;
    acceptEvaluation(consignmentId.toString(), accountId)
      .then((res) => {
        console.log(res);
        toast.success('Accept consignment successfully', {});
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
      state: { price: price.toString(), ownerId: ownerId, consignmentId: consignment.consignmentId },
    });
  };

  const callBackFunction = () => {
    setState(!state);
  }

  const Action = () => {
    const length = consignment?.consignmentDetails?.length;
    if (JSON.parse(getCookie('user')).role === Roles.STAFF) {
      if (consignment?.status === ConsignmentStatus.IN_INITIAL_EVALUATION) {
        if (!consignment?.consignmentDetails?.some((detail) => detail?.status === 'INITIAL_EVALUATION')) {
          return <SendEvaluationForm callBack={() => callBackFunction()} consignmentParent={consignment} />;
        } else {
          return <Badge className="bg-amber-400">Waiting Seller Accept</Badge>;
        }
      }
      if (consignment?.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
        if (consignment?.consignmentDetails?.some((detail) => detail?.status === 'MANAGER_ACCEPTED')) {
          return <Badge className="bg-green-300">Success</Badge>;
        } else if (consignment?.consignmentDetails[length - 1]?.status === 'FINAL_EVALUATION') {
          return <Badge className="bg-amber-400">Waiting Manager Accept</Badge>;
        } else {
          return <SendEvaluationForm callBack={() => callBackFunction()} consignmentParent={consignment} />;
        }
      }
      if (consignment?.status === ConsignmentStatus.SENDING) {
        return <ConfirmReceive consignmentId={consignment?.consignmentId} />;
      }
      if (consignment?.status === ConsignmentStatus.WAITING_STAFF) {
        return <ConfirmTake consignmentId={consignment?.consignmentId} />;
      }
    } else if (JSON.parse(getCookie('user')).role === Roles.MANAGER) {
      if (consignment?.status === ConsignmentStatus.IN_FINAL_EVALUATION) {
        if (consignment?.consignmentDetails[length - 1]?.status === 'FINAL_EVALUATION') {
          return (
            <>
              <Button
                className="bg-red-400 mr-16 w-24"
                onClick={() => rejectConsignment(consignment.consignmentId, null)}
              >
                Reject
              </Button>
              <Button className="bg-green-400  mr-16 w-24" onClick={() => acceptConsignment(consignment.consignmentId)}>
                Accept
              </Button>
            </>
          );
        }
      }
      if (consignment?.status === ConsignmentStatus.TO_ITEM) {
        return <Button onClick={() => handleCreateItem()}>Create Item</Button>;
      }
    }
  };

  return (
    <div className="flex flex-col justify-start w-full h-full m-0 p-3">
      <div className="w-full h-fit p-3  mb-3 drop-shadow-lg flex justify-start flex-row  flex-wrap gap-2 ">
        <Card className="basis-3/6">
          <CardHeader>
            <CardTitle>Consignment #{consignment?.consignmentId}</CardTitle>
            <CardDescription className="flex gap-3">
              Status:
              {(() => {
                switch (consignment?.status) {
                  case ConsignmentStatus.WAITING_STAFF:
                    return (
                      <Badge
                        variant="default"
                        className="bg-yellow-500 w-[150px] text-center flex justify-center items-center"
                      >
                        Waiting for Staff
                      </Badge>
                    );
                  case ConsignmentStatus.FINISHED:
                    return (
                      <Badge
                        variant="default"
                        className="bg-green-500 w-[150px] text-center flex justify-center items-center"
                      >
                        Finished
                      </Badge>
                    );
                  case ConsignmentStatus.IN_INITIAL_EVALUATION:
                    return (
                      <Badge
                        variant="default"
                        className="bg-blue-500 w-[150px] text-center flex justify-center items-center"
                      >
                        In Initial Evaluation
                      </Badge>
                    );
                  case ConsignmentStatus.IN_FINAL_EVALUATION:
                    return (
                      <Badge
                        variant="default"
                        className="bg-indigo-500 w-[150px] text-center flex justify-center items-center"
                      >
                        In Final Evaluation
                      </Badge>
                    );
                  case ConsignmentStatus.SENDING:
                    return (
                      <Badge
                        variant="default"
                        className="bg-purple-500 w-[150px] text-center flex justify-center items-center"
                      >
                        Sending
                      </Badge>
                    );
                  case ConsignmentStatus.TERMINATED:
                    return (
                      <Badge
                        variant="default"
                        className="bg-red-500 w-[150px] text-center flex justify-center items-center"
                      >
                        Terminated
                      </Badge>
                    );
                  case ConsignmentStatus.WAITING_SELLER:
                    return (
                      <Badge
                        variant="default"
                        className="bg-pink-400 w-[150px] text-center flex justify-center items-center"
                      >
                        Waiting seller
                      </Badge>
                    );
                  case ConsignmentStatus.TO_ITEM:
                    return (
                      <Badge
                        variant="default"
                        className="bg-cyan-400 w-[150px] text-center flex justify-center items-center"
                      >
                        To Item
                      </Badge>
                    );
                  default:
                    return <Badge variant="destructive">Unknown Status</Badge>;
                }
              })()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-gray-700 mb-2">
                <strong>Create Date:</strong> {new Date(consignment?.createDate).toLocaleDateString('en-US')}
              </p>
              <p className="text-gray-700">
                <strong>Prefer Contact:</strong> {consignment?.preferContact ?? 'Not provided'}
              </p>
            </div>
          </CardContent>

          <CardFooter>{Action()}</CardFooter>
        </Card>
        <Card className="basis-2/6 h-fit  ">
          <CardHeader>
            <CardTitle className="flex flex-row justify-between items-center">
              <h3>Customer information</h3>
              <Avatar>
                <AvatarImage src={consignment?.user.avatar?.link || ''} />
                <AvatarFallback>{consignment?.user.nickname?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </CardTitle>

            <CardDescription>
              {Array.isArray(consignment?.consignmentDetails) ? consignment?.user?.email : null}
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-center">
              <div className="flex flex-col w-full">
                <p className="text-gray-700 mb-2">
                  <strong>Name:</strong>{' '}
                  {Array.isArray(consignment?.consignmentDetails) ? consignment?.user.nickname : 'Not provided'}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong>{' '}
                  {Array.isArray(consignment?.consignmentDetails) ? consignment?.user.email : 'Not provided'}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong>{' '}
                  {Array.isArray(consignment?.consignmentDetails) ? consignment?.user.phone : 'Not provided'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full h-fit p-3  mb-3 drop-shadow-lg flex justify-start flex-row  flex-wrap gap-2 ">
        <Card className="w-3/6">
          <CardHeader>
            <CardTitle>
              Consignment Detail {consignment?.attachments !== undefined && <ConsignmentDialog status={consignment.status} attachments={consignment.attachments} />}
            </CardTitle>
            <CardDescription>This is the detail that the customer has provided</CardDescription>
          </CardHeader>
          <CardContent className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700">
                  <strong>Color:</strong> {consignment?.color ?? 'Not provided'}
                </p>
                <p className="text-gray-700">
                  <strong>Measurement:</strong> {consignment?.measurement ?? 'Not provided'}
                </p>
                <p className="text-gray-700">
                  <strong>Weight:</strong> {consignment?.weight ?? 'Not provided'}g
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Gemstone:</strong> {consignment?.gemstone ?? 'Not provided'}
                </p>
                <p className="text-gray-700">
                  <strong>Stamped:</strong> {consignment?.stamped ?? 'Not provided'}
                </p>
              </div>
            </div>
            <div className="w-full flex justify-between mt-4">
              <p className="text-gray-700">
                <strong>Requester:</strong> {consignment?.user?.nickname ?? 'Not provided'}
              </p>
            </div>
            <div className="mt-4 text-gray-700" dangerouslySetInnerHTML={{ __html: consignment?.description }}></div>
          </CardContent>
        </Card>
        {/* <div className="basis-2/3 flex w-full"> */}
        <Card className="w-2/6 min-h-96 border rounded-xl ">
          <CardHeader>
            <CardTitle>Activity History</CardTitle>
            <CardDescription>This is where you can see the history of this consignment</CardDescription>
          </CardHeader>
          <CardContent className="overflow-hidden">
            <ScrollArea className="w-full h-80 border rounded-xl ">
              {Array.isArray(consignment?.consignmentDetails)
                ? consignment.consignmentDetails.map((item, index) => {
                    return (
                      <Card key={index} className="w-full p-3">
                        <CardHeader>
                          <CardTitle>
                            Consignment Detail #{index + 1} {item?.attachments !== undefined &&<ConsignmentDetailDialog consignmentDetail={item} />}
                          </CardTitle>
                          <CardDescription>
                            {(() => {
                              switch (item.status) {
                                case ConsignmentDetailType.MANAGER_REJECTED:
                                  return (
                                    <Badge
                                      variant="default"
                                      className="bg-yellow-500 w-[150px] text-center flex justify-center items-center"
                                    >
                                      Manager Rejected
                                    </Badge>
                                  );
                                case ConsignmentDetailType.INITIAL_EVALUATION:
                                  return (
                                    <Badge
                                      variant="default"
                                      className="bg-green-500 w-[150px] text-center flex justify-center items-center"
                                    >
                                      Initial Evaluation
                                    </Badge>
                                  );
                                case ConsignmentDetailType.FINAL_EVALUATION:
                                  return (
                                    <Badge
                                      variant="default"
                                      className="bg-blue-500 w-[150px] text-center flex justify-center items-center"
                                    >
                                      Final Evaluation
                                    </Badge>
                                  );
                                case ConsignmentDetailType.MANAGER_ACCEPTED:
                                  return (
                                    <Badge
                                      variant="default"
                                      className="bg-indigo-500 w-[150px] text-center flex justify-center items-center"
                                    >
                                      Manager Accepted
                                    </Badge>
                                  );
                                case ConsignmentDetailType.REQUEST:
                                  return (
                                    <Badge
                                      variant="default"
                                      className="bg-purple-500 w-[150px] text-center flex justify-center items-center"
                                    >
                                      Request
                                    </Badge>
                                  );
                                default:
                                  return <Badge variant="destructive">Unknown Status</Badge>;
                              }
                            })()}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="bg-white shadow-md rounded-lg p-6">
                          <div> 
                            <p className="text-gray-700 mb-2">
                              <strong>Create Date:</strong> {formatDate(item?.createDate) ?? 'Not provided'}
                            </p>
                            <p className="text-gray-700 mb-2">
                              <strong>Initiator:</strong> {item.account.nickname}
                            </p>
                            <div
                              className="text-gray-700 mb-4"
                              dangerouslySetInnerHTML={{ __html: item.description }}
                            ></div>
                            <p className="text-gray-700">
                              <strong>Evaluate Price:</strong> {item.price ? item.price : 'Not specified'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                : 
                <p>
                  No activity history
                </p>
                }
            </ScrollArea>
          </CardContent>
        </Card>
        {/* </div> */}
      </div>
    </div>
  );
}
