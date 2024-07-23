import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {fetchAccountById} from '@/services/AccountsServices.ts';
import {Account} from '@/models/AccountModel.tsx';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {Skeleton} from "@/components/ui/skeleton"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";

interface ItemCreateCustomerCardProps {
  userId: number;
}

const ItemCreateCustomerCard: React.FC<ItemCreateCustomerCardProps> = ({
                                                                         userId
                                                                       }) => {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState({} as Account);
  const [lastId, setLastId] = useState<number>(undefined);

  useEffect(() => {
    if (userId && userId > 0 && lastId !== userId) {
      setLoading(true);
      setLastId(userId);
      toast.promise(fetchAccountById(userId), {
        loading: 'Loading owner details...',
        success: (res) => {
          setCustomer(res.data);
          setLoading(false);
          return `Owner info loaded successfully!`;
        },
        error: () => {
          setLoading(false);
          setCustomer(undefined);
          return `Owner not found!`;
        }
      })
    }
  }, [userId]);

  return (
    <>
      {loading ? (
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ) : (
        customer ?
          (<div className="flex flex-col gap-5 w-full">
            <div
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-10 lg:mt-0">
              <h2 className="mb-4 flex flex-col gap-3 items-center">
                <Avatar className="hover:cursor-pointer w-32 h-32">
                  <AvatarImage src={customer.avatar?.link} alt="avatar"/>
                  <AvatarFallback> {customer.nickname[0]}</AvatarFallback>
                </Avatar>
                <span className="text-2xl font-bold">{customer.nickname}</span>
              </h2>
              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Account ID</span>
                    <span>{customer.accountId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span>{customer.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>) :

          (<div className="">
            <Alert variant="destructive">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Owner Not found
              </AlertDescription>
            </Alert>
          </div>)
      )}
    </>
  );
}

export default ItemCreateCustomerCard;