import { useAuth } from '@/AuthProvider';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Cross1Icon } from '@radix-ui/react-icons';
import { CheckIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerDashboard() {
  const auth = useAuth();
  const nav = useNavigate();

  return (
    <>
      <div className=" gap-2 flex flex-col justify-center items-start text-foreground dark:bg-black">
        <section className="body-font h-80 p-20">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Welcome back, {auth.user.nickname}</h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            We will reach you within 2 businesses days after submitting your consignments request
          </p>
        </section>

        <section className=" body-font h-96 bg-red-200 w-full p-20 dark:bg-red-800">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Your next steps</h2>
          <p className="leading-7 [&:not(:first-child)]:mt-6">It's time to review a couple of current settings.</p>
          <div className="w-full flex justify-start items-center gap-3">
            <Card className="w-[200px] h-[200px] aspect-square  basis-1/3">
              <CardHeader>
                {auth.user.kyc ? (
                  <CheckIcon color="green" className="h-6 w-6 " />
                ) : (
                  <Cross1Icon className="h-6 w-6 text-red-600 " />
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  {!auth.user.kyc ? (
                    <h2 className="text-lg font-semibold text-red-600 ">
                      Verify your your identity{' '}
                      <span
                        className="hover:cursor-pointer hover:text-red-900 text-lg font-semibold underline"
                        onClick={() => {
                          nav('/profile/kyc');
                        }}
                      >
                        here
                      </span>
                    </h2>
                  ) : (
                    <h2 className="text-lg font-semibold">Your identity is verified</h2>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="w-[200px] h-[200px] aspect-square basis-1/3">
              <CardHeader>
                {auth.user.require2fa ? (
                  <CheckIcon color="green" className="h-6 w-6 " />
                ) : (
                  <Cross1Icon className="h-6 w-6 text-red-600 " />
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  {!auth.user.require2fa ? (
                    <h2 className="text-lg font-semibold text-red-600">
                      Enable 2 Factor authentication now for better security{' '}
                      <span
                        className="hover:cursor-pointer hover:text-red-900 text-lg font-semibold underline"
                        onClick={() => {
                          nav('/profile/overview');
                        }}
                      >
                        here
                      </span>
                    </h2>
                  ) : (
                    <h2 className="text-lg font-semibold">2 Factor authentication is enabled</h2>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
