import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDebouncedCallback } from 'use-debounce';
import { getEnumValue, parseIntOrUndefined } from '@/lib/utils.ts';
import ItemsTable from '@/pages/Administration/item/testserversideTable/item-table.tsx';
import { ItemStatus } from '@/models/Item.ts';
import { getItems } from '@/services/ItemService.ts';

export default function ItemsList() {
  const [searchParams] = useSearchParams();
  const [itemPromise, setItemPromise] = useState<any>();

  const fetchItems = useDebouncedCallback(() => {
    const query = {
      status: getEnumValue(ItemStatus, searchParams.get('status')) as ItemStatus,
      categoryId: parseIntOrUndefined(searchParams.get('categoryId')),
      search: searchParams.get('search'),
      minPrice: parseIntOrUndefined(searchParams.get('minPrice')),
      maxPrice: parseIntOrUndefined(searchParams.get('maxPrice')),
      page: parseIntOrUndefined(searchParams.get('page')),
      size: parseIntOrUndefined(searchParams.get('per_page')),
      sort: searchParams.get('sort') || 'itemId,desc',
    };
    setItemPromise(getItems(query));
  }, 500);

  useEffect(() => {
    fetchItems();
  }, [searchParams]);

  return (
    <main className="grid flex-1 orders-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">Jewelries</CardTitle>
              <CardDescription>Manage Jewelries and view details.</CardDescription>
            </CardHeader>
            <CardContent>
              <ItemsTable itemPromise={itemPromise} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
