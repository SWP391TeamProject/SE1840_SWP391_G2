import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { AccountStatus, RoleName } from '@/constants/enums';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { getEnumValue, parseIntOrUndefined } from '@/lib/utils.ts';
import { fetchAccountsService } from '@/services/AccountsServices.ts';
import { CustomersTable } from '@/pages/Administration/Customer/customer-data-table/customer-table.tsx';

export default function CustomerList() {
  const [searchParams] = useSearchParams();
  const [customerPromise, setCustomerPromise] = useState<any>();

  const fetchAccounts = useDebouncedCallback(() => {
    const query = {
      status: getEnumValue(AccountStatus, searchParams.get('status')) as AccountStatus,
      role: RoleName.MEMBER,
      search: searchParams.get('search'),
      page: parseIntOrUndefined(searchParams.get('page')),
      size: parseIntOrUndefined(searchParams.get('per_page')),
      sort: searchParams.get('sort') || 'accountId,desc',
    };
    setCustomerPromise(fetchAccountsService(query));
  }, 500);

  useEffect(() => {
    fetchAccounts();
  }, [searchParams]);

  return (
    <main className="grid flex-1 orders-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">Customers</CardTitle>
              <CardDescription>View customer details.</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomersTable customerPromise={customerPromise} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
