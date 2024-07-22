import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {Tabs, TabsContent} from '@/components/ui/tabs';
import {ConsignmentStatus} from '@/constants/enums';
import {useEffect, useState} from 'react';
import {useDebouncedCallback} from 'use-debounce';
import {useSearchParams} from 'react-router-dom';
import {getEnumValue, parseDate, parseIntOrUndefined} from "@/lib/utils.ts";
import {fetchAllConsignmentsService} from "@/services/ConsignmentService.tsx";
import {
  ConsignmentsTable
} from "@/pages/Administration/consignments/consignments-data-table/consignments-table.tsx";

export default function ConsignmentList() {
  const [searchParams] = useSearchParams();
  const [consignmentPromise, setConsignmentPromise] = useState<any>();

  const fetchConsignments = useDebouncedCallback(
    () => {
      const query = {
        status: getEnumValue(ConsignmentStatus, searchParams.get('status')) as ConsignmentStatus,
        from: parseDate(searchParams.get('from')),
        to: parseDate(searchParams.get('to')),
        customer: parseIntOrUndefined(searchParams.get('customer')),
        search: searchParams.get('search'),
        page: parseIntOrUndefined(searchParams.get('page')),
        size: parseIntOrUndefined(searchParams.get('per_page')),
        sort: searchParams.get('sort') || 'consignmentId,desc',
      };
      setConsignmentPromise(fetchAllConsignmentsService(query));
    }, 500
  );

  useEffect(() => {
    fetchConsignments();
  }, [searchParams]);

  return (
    <main
      className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Consignments
              </CardTitle>
              <CardDescription>Manage consignments and view
                details.</CardDescription>
            </CardHeader>
            <CardContent>
              <ConsignmentsTable consignmentPromise={consignmentPromise} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
