import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AuctionSessionStatus } from '@/constants/enums';
import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useSearchParams } from 'react-router-dom';
import { getEnumValue, parseDate, parseIntOrUndefined } from '@/lib/utils.ts';
import { getAuctions } from '@/services/AuctionSessionService.tsx';
import AuctionSessionsTable from '@/pages/Administration/Auction-session/auction-session-data-table/auction-session-table.tsx';

export default function AuctionSessionList() {
  const [searchParams] = useSearchParams();
  const [auctionSessionPromise, setAuctionSessionPromise] = useState<any>();

  const fetchAuctions = useDebouncedCallback(() => {
    const query = {
      status: getEnumValue(AuctionSessionStatus, searchParams.get('status')) as AuctionSessionStatus,
      fromDate: parseDate(searchParams.get('from')),
      toDate: parseDate(searchParams.get('to')),
      search: searchParams.get('search'),
      page: parseIntOrUndefined(searchParams.get('page')),
      size: parseIntOrUndefined(searchParams.get('per_page')),
      sort: searchParams.get('sort') || 'auctionSessionId,desc',
    };
    setAuctionSessionPromise(getAuctions(query));
  }, 500);

  useEffect(() => {
    fetchAuctions();
  }, [searchParams]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">Auction Sessions</CardTitle>
              <CardDescription>Manage auction sessions and view details.</CardDescription>
            </CardHeader>
            <CardContent>
              <AuctionSessionsTable auctionSessionPromise={auctionSessionPromise} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
