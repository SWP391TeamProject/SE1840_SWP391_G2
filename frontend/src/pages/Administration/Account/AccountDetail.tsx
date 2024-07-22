import LoadingAnimation from '@/components/loadingAnimation/LoadingAnimation';
import {useNavigate, useParams} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {toast} from 'sonner';
import {fetchAccountById} from '@/services/AccountsServices.ts';
import {Account} from '@/models/AccountModel.tsx';
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {AlertCircle} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar.tsx";
import {CitizenCard} from "@/models/newModel/citizenCard.ts";
import {fetchCitizenCardById} from "@/services/KycService.ts";
import {formatDate} from "@/lib/utils.ts";
import {useCurrency} from "@/CurrencyProvider.tsx";
import {AccountStatus, Roles} from "@/constants/enums.tsx";
import {useAuth} from "@/AuthProvider.tsx";

export function AccountDetail() {
  const auth = useAuth();
  const accountId = parseInt(useParams().id);
  if (auth.user.role !== Roles.ADMIN) {
    const nav = useNavigate();
    nav('/admin/customers/' + accountId, {
      replace: true
    });
  }

  const currency = useCurrency();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState({} as Account);
  const [citizenCard, setCitizenCard] = useState<CitizenCard>(undefined);

  useEffect(() => {
    setLoading(true);
    toast.promise(fetchAccountById(accountId), {
      loading: 'Loading account...',
      success: (res) => {
        setAccount(res.data);
        setLoading(false);
        if (res.data.kyc) {
          toast.promise(fetchCitizenCardById(accountId), {
            loading: 'Loading citizen card...',
            success: (res) => {
              setCitizenCard(res.data);
              return `Citizen card loaded successfully!`;
            },
            error: (err) => `An error occurred: ${err.message}`,
          });
        }
        return `Account loaded successfully!`;
      },
      error: (err) => `An error occurred: ${err.message}`,
    })
  }, []);

  return (
    <>
      {loading ? (
        <LoadingAnimation/>
      ) : (
        <div
          className="lg:flex flex-row justify-between gap-10 items-start p-10 lg:p-20 lg:pt-10">
          <div className="basis-5/12 xl:basis-4/12 flex flex-col gap-5">
            <div
              className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-10 lg:mt-0">
              <h2 className="mb-4 flex flex-col gap-3 items-center">
                <Avatar className="hover:cursor-pointer w-32 h-32">
                  <AvatarImage src={account.avatar?.link} alt="avatar"/>
                  <AvatarFallback> {account.nickname[0]}</AvatarFallback>
                </Avatar>
                <span className="text-2xl font-bold">{account.nickname}</span>
              </h2>
              <div className="flex flex-col gap-5">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Account ID</span>
                    <span>{account.accountId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span>{account.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone</span>
                    <span>{account.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Role</span>
                    <span>{account.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance</span>
                    <span>{currency.format(account.balance)}</span>
                  </div>
                  {account.dummy && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-5 w-5"/>
                      <AlertTitle>
                        <h3 className="text-lg">Dummy account</h3>
                      </AlertTitle>
                      <AlertDescription>
                        This is a dummy account for testing purposes. It is not
                        a real person!
                      </AlertDescription>
                    </Alert>
                  )}
                  {!account.kyc && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-5 w-5"/>
                      <AlertTitle>
                        <h3 className="text-lg">KYC Unverified</h3>
                      </AlertTitle>
                      <AlertDescription>This account has not been
                        KYC-verified.</AlertDescription>
                    </Alert>
                  )}
                  {account.status === AccountStatus.DISABLED && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-5 w-5"/>
                      <AlertTitle>
                        <h3 className="text-lg">Account Deactivated</h3>
                      </AlertTitle>
                      <AlertDescription>This account has not been activated.</AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          </div>
          {citizenCard != null &&
            <div className="basis-5/12 xl:basis-4/12 flex flex-col gap-5">
              <div
                className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 mt-10 lg:mt-0">
                <h2
                  className="mb-4 flex flex-col gap-3 items-center text-2xl font-bold">
                  KYC Information
                </h2>
                <div className="flex flex-col gap-5">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Full name</span>
                      <span>{citizenCard.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Birthday</span>
                      <span>{formatDate(citizenCard.birthday)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gender</span>
                      <span>{citizenCard.gender ? 'Male' : 'Female'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Address</span>
                      <span>{citizenCard.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>City</span>
                      <span>{citizenCard.city}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>}
        </div>
      )}
    </>
  );
}
