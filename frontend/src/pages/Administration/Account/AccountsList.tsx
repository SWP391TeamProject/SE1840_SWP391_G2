import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import {AccountStatus, RoleName} from '@/constants/enums';
import {useSearchParams} from 'react-router-dom';
import { AccountsTable } from './account-data-table/account-table';
import {useDebouncedCallback} from "use-debounce";
import {getEnumValue, parseIntOrUndefined} from "@/lib/utils.ts";
import {fetchAccountsService} from "@/services/AccountsServices.ts";

export default function AccountsList() {
  const [searchParams] = useSearchParams();
  const [accountPromise, setAccountPromise] = useState<any>();

  const fetchAccounts = useDebouncedCallback(
    () => {
      const query = {
        status: getEnumValue(AccountStatus, searchParams.get('status')) as AccountStatus,
        role: getEnumValue(RoleName, searchParams.get('role')) as RoleName,
        search: searchParams.get('search'),
        page: parseIntOrUndefined(searchParams.get('page')),
        size: parseIntOrUndefined(searchParams.get('per_page')),
        sort: searchParams.get('sort') || 'accountId,desc',
      };
      setAccountPromise(fetchAccountsService(query));
    }, 500
  );

  useEffect(() => {
    fetchAccounts();
  }, [searchParams]);

  return (
    <main className="grid flex-1 orders-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Accounts
              </CardTitle>
              <CardDescription>Manage accounts and view
                details.</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountsTable accountPromise={accountPromise} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};