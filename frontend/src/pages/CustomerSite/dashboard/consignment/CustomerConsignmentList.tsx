import axios from '@/config/axiosConfig.ts';
import React, {useEffect, useState} from 'react';
import CustomerConsignmentCard from '@/pages/CustomerSite/dashboard/consignment/CustomerConsignmentCard.tsx';
import {Grid2x2Icon, PlusCircleIcon, WalletCards} from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu.tsx';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table.tsx';
import {SERVER_DOMAIN_URL} from '@/constants/domain.ts';
import {useAuth} from "@/AuthProvider.tsx";
import {toast} from "sonner";
import Consignment from "@/models/consignment.ts";
import PagingIndexes from "@/components/pagination/PagingIndexes.tsx";
import {useDebouncedCallback} from "use-debounce";
import {formatDate, parseIntOrUndefined} from "@/lib/utils.ts";
import {
  setCurrentPageList,
  setCurrentPageNumber
} from "@/redux/reducers/Consignments.tsx";
import {useAppDispatch, useAppSelector} from "@/redux/hooks.tsx";
import {Page} from "@/models/Page.ts";
import {AxiosResponse} from "axios";
import LoadingAnimation
  from "@/components/loadingAnimation/LoadingAnimation.tsx";
import ConsignmentStatusBadge
  from "@/components/ConsignmentStatusBadge.tsx";
import {Button} from "@/components/ui/button.tsx";

enum layoutType {
  CARD = 'CARD',
  TABLE = 'TABLE',
}

export default function CustomerConsignmentList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const consignmentsList: any = useAppSelector((state) => state.consignments);
  const [layout, setLayout] = React.useState<any>(layoutType.CARD);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const nav = useNavigate();
  const dispatch = useAppDispatch();

  const fetchConsignments = useDebouncedCallback(
    () => {
      setIsLoading(true);
      const query = {
        page: parseIntOrUndefined(searchParams.get('page')),
        size: 16,
        sort: searchParams.get('sort') || 'consignmentId,desc',
      };
      toast.promise(axios.get<Page<Consignment>>(`${SERVER_DOMAIN_URL}/api/consignments/user/${auth.user.accountId}`, {
        headers: {
          Authorization: `Bearer ${auth.user.accessToken}`,
        },
        params: query,
      }), {
        loading: 'Loading items...',
        success: (res: AxiosResponse<Page<Consignment>>) => {
          dispatch(setCurrentPageList(res.data.content.sort((a, b) => {
            return b.consignmentId - a.consignmentId;
          })));
          let paging: any = {
            pageNumber: res.data.number,
            totalPages: res.data.totalPages,
          };
          dispatch(setCurrentPageNumber(paging));
          setIsLoading(false);
          return 'Consignments loaded successfully!';
        },
        error: (err) => {
          console.error(err);
          setIsLoading(false);
          return 'Failed to load consignments';
        },
      });
    }, 100
  );

  useEffect(() => {
    fetchConsignments();
    window.scrollTo(0, 0);
  }, [searchParams]);

  function setParam(key: string, value: any | undefined | null) {
    if (String(value).length === 0) value = undefined;
    if ((!searchParams.has(key) && (value === undefined || value === null)) ||
      (searchParams.has(key) && value === searchParams.get(key))) {
      return;
    }
    if (value) {
      searchParams.set(key, value);
    } else {
      searchParams.delete(key);
    }
    setSearchParams(searchParams, {replace: true});
  }

  const handlePageSelect = (page: number) => {
    setParam('page', page + 1);
  };

  return (
    <div className="flex flex-col gap-5 container p-10">
      <div className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold">Your Consignments</h2>
          <p>We will reach you within 2 businesses days after submitting your
            consignments request</p>
        </div>
        <div>
          <NavigationMenu className="flex items-center gap-2">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild
                                    className="hover:cursor-pointer rounded-full hover:bg-gray-400 ">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center">
                    <PlusCircleIcon
                      className="h-6 w-6 "
                      onClick={() => {
                        nav('/create-consignment');
                      }}
                    />
                  </div>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className="hover:cursor-pointer rounded-full hover:bg-gray-400 "
                  onClick={() => {
                    setLayout((prev) => {
                      return prev === layoutType.CARD ? layoutType.TABLE : layoutType.CARD;
                    });
                  }}
                >
                  {layout === layoutType.CARD ? (
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center">
                      <Grid2x2Icon className="sad"/>
                    </div>
                  ) : (
                    <WalletCards
                      className="h-8 w-8 rounded-full flex items-center justify-center"/>
                  )}
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
      {
        isLoading ? <LoadingAnimation/> :
          <>
            {layout === layoutType.TABLE && consignmentsList && consignmentsList.currentPageList.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Id</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Create Date</TableHead>
                    <TableHead>Update Date</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {consignmentsList.currentPageList.map((consignment: Consignment) => (
                    <TableRow key={consignment.consignmentId}>
                      <TableCell>{consignment.consignmentId}</TableCell>
                      <TableCell>
                        <ConsignmentStatusBadge status={consignment.status}/>
                      </TableCell>
                      <TableCell>{formatDate(consignment.createDate)}</TableCell>
                      <TableCell>{formatDate(consignment.updateDate)}</TableCell>
                      <TableCell>
                        <Button type="submit" asChild>
                          <Link
                            to={`/dashboard/consignments/${consignment.consignmentId}`}>View
                            details</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <div
              className={`flex flex-row flex-wrap gap-16 ${layout === layoutType.CARD ? 'block' : 'hidden'}`}>
              {layout === layoutType.CARD &&
                consignmentsList &&
                consignmentsList.currentPageList
                  .map((consignment) => <CustomerConsignmentCard
                    key={consignment.consignmentId}
                    consignment={consignment}/>)}
            </div>
          </>
      }
      <div className="flex justify-center mt-8">
        <PagingIndexes
          className="basis-1/2"
          pageNumber={consignmentsList.currentPageNumber || 0}
          totalPages={consignmentsList.totalPages}
          pageSelectCallback={handlePageSelect}
        ></PagingIndexes>
      </div>
    </div>
  );
}
