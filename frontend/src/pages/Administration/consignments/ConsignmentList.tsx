import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

import { DataTableSkeleton } from '@/components/data-tables/data-tables-skeleton';
import { ConsignmentStatus } from '@/constants/enums';
import { setCurrentConsignment, setCurrentPageList, setCurrentPageNumber } from '@/redux/reducers/Consignments';
import {
  fetchAllConsignmentsService,
  fetchConsignmentsByStatusService,
  getConsignments,
} from '@/services/ConsignmentService';
import { ListFilter } from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConsignmentsTable } from './consignments-data-table/consignments-table';

export default function ConsignmentList() {
  const consignmentsList = useAppSelector((state) => state.consignments);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const url = new URL(window.location.href);
  let pageNumber = url.searchParams.get('page');
  let sort = url.searchParams.get('sort') || 'createDate,desc';
  let pageSize = url.searchParams.get('per_page');
  const [consignmentPromise, setConsignmentPromise] = useState<Promise<any>>();

  const search = url.searchParams.get('search');

  // const consignmentPromise = getConsignments({ page: Number.parseInt(pageNumber), size: Number.parseInt(pageSize), sort: sort, status: selectedStatus});

  const fetchConsignments = async (pageNumber: number, status?: ConsignmentStatus) => {
    try {
      let res;
      setIsLoading(true);
      if (status) {
        res = await fetchConsignmentsByStatusService(pageNumber, 10, status);
      } else {
        res = await fetchAllConsignmentsService(pageNumber, 10);
      }
      if (res) {
        console.log(res);

        dispatch(setCurrentPageList(res.data.content)); // Update currentPageList here
        let paging: any = {
          pageNumber: res.data.number,
          totalPages: res.data.totalPages,
        };
        dispatch(setCurrentPageNumber(paging));
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (error.response.status === 404) {
        dispatch(setCurrentPageList([]));
        let paging: any = {
          pageNumber: 0,
          totalPages: 0,
        };
        dispatch(setCurrentPageNumber(paging));
      }
      setIsLoading(false);
    }
  };

  const handleFilterClick = (status: string) => {
    if (status !== selectedStatus) {
      setConsignmentPromise(
        getConsignments({
          page: Number.parseInt(pageNumber),
          size: Number.parseInt(pageSize),
          sort: sort,
          status: status,
        })
      );
      setSelectedStatus(status);
    }
  };

  useEffect(() => {
    if (Number.parseInt(pageNumber) >= 1) {
      console.log(sort);
      setConsignmentPromise(
        getConsignments({
          page: Number.parseInt(pageNumber),
          size: Number.parseInt(pageSize),
          sort: sort,
          status: selectedStatus,
          search: search,
        })
      );
    }
  }, [pageSize, pageNumber, sort, search]);

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center"></div>
        <TabsContent value={statusFilter}>
          {/* {isLoading ?
                        <LoadingAnimation />
                        :  */}
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Consignments
                <div className="w-full basis-1/2">
                  {/* <PagingIndexes pageNumber={consignmentsList.currentPageNumber ? consignmentsList.currentPageNumber : 0} totalPages={consignmentsList.totalPages} pageSelectCallback={handlePageSelect}></PagingIndexes> */}
                </div>
              </CardTitle>
              <CardDescription>Manage consignments and view their details.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Id</TableHead>
                                            <TableHead>preferContact</TableHead>
                                            <TableHead className="md:table-cell">
                                                create Date
                                            </TableHead>
                                            <TableHead className="md:table-cell">
                                                Assigned Staff
                                            </TableHead>
                                            <TableHead className="md:table-cell">
                                                Phone
                                            </TableHead>
                                            <TableHead className="md:table-cell">
                                                Status
                                            </TableHead> */}
              {/* <TableHead className="md:table-cell">
                                                    Created at
                                                </TableHead> */}
              {/* <TableHead className="md:table-cell">
                                                Action
                                            </TableHead>
                                            <TableHead>
                                                <span className="sr-only">More Actions</span>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {consignmentsList.currentPageList.map((consignment) => (
                                            <TableRow key={consignment.consignmentId}>
                                                <TableCell className="font-medium">
                                                    {consignment.consignmentId}
                                                </TableCell> */}
              {/* <TableCell>
                                                    <Badge variant="outline">Draft</Badge>
                                                </TableCell> */}
              {/* <TableCell className="md:table-cell">
                                                    {(() => {
                                                        switch (consignment.preferContact) {
                                                            case ConsignmentContactPreference.EMAIL:
                                                                return "Email"
                                                            case ConsignmentContactPreference.PHONE:
                                                                return "Phone"
                                                            case ConsignmentContactPreference.TEXT_MESSAGE:
                                                                return "Text"
                                                            default:
                                                                return "Any of the above"
                                                        }
                                                    })()}
                                                </TableCell>
                                                <TableCell className="md:table-cell">
                                                    {new Date(consignment.createDate).toLocaleDateString('en-US')}
                                                </TableCell>
                                                <TableCell className="md:table-cell">
                                                    {consignment.staff ? consignment.staff.nickname : "Not assigned"}
                                                </TableCell>
                                                <TableCell className="md:table-cell">
                                                    {consignment.consignmentDetails.filter((detail) => (detail.status === ConsignmentDetailType.REQUEST)
                                                    )[0].account.phone}
                                                </TableCell>
                                                <TableCell>
                                                    {(() => {
                                                        switch (consignment.status) {
                                                            case ConsignmentStatus.WAITING_STAFF:
                                                                return <Badge variant="default" className="bg-yellow-500 w-[150px] text-center flex justify-center items-center">Waiting for Staff</Badge>;
                                                            case ConsignmentStatus.FINISHED:
                                                                return <Badge variant="default" className="bg-green-500 w-[150px] text-center flex justify-center items-center">Finished</Badge>;
                                                            case ConsignmentStatus.IN_INITIAL_EVALUATION:
                                                                return <Badge variant="default" className="bg-blue-500 w-[150px] text-center flex justify-center items-center">In Initial Evaluation</Badge>;
                                                            case ConsignmentStatus.IN_FINAL_EVALUATION:
                                                                return <Badge variant="default" className="bg-indigo-500 w-[150px] text-center flex justify-center items-center">In Final Evaluation</Badge>;
                                                            case ConsignmentStatus.SENDING:
                                                                return <Badge variant="default" className="bg-purple-500 w-[150px] text-center flex justify-center items-center">Sending</Badge>;
                                                            case ConsignmentStatus.WAITING_SELLER:
                                                                return <Badge variant="default" className="bg-pink-400 w-[150px] text-center flex justify-center items-center">Waiting Seller Approval</Badge>;
                                                            case ConsignmentStatus.TO_ITEM:
                                                                return <Badge variant="default" className="bg-cyan-400 w-[150px] text-center flex justify-center items-center">To Item</Badge>;
                                                            case ConsignmentStatus.TERMINATED:
                                                                return <Badge variant="default" className="bg-red-500 w-[150px] text-center flex justify-center items-center">Terminated</Badge>;
                                                            default:
                                                                return <Badge variant="destructive">Unknown Status</Badge>;
                                                        }
                                                    })()}
                                                </TableCell>

                                                <TableCell>
                                                    <Button variant="outline" size="sm" onClick={() => { handleDetailClick(consignment.consignmentId) }}>
                                                        Detail
                                                    </Button>
                                                </TableCell>
                                            </TableRow>

                                        ))}
                                    </TableBody>
                                </Table> */}

              <Suspense
                fallback={
                  <DataTableSkeleton
                    columnCount={5}
                    searchableColumnCount={1}
                    filterableColumnCount={2}
                    cellWidths={['10rem', '40rem', '12rem', '12rem', '8rem']}
                    shrinkZero
                  />
                }
              >
                {/* <Select onValueChange={handleRoleFilterSelect} >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Role</SelectLabel>
                        <SelectItem value="All" key={0}>All</SelectItem>
                        {Object.values(RoleName).map((role) => (
                          <SelectItem value={role}>{role}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select> */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <ListFilter className="h-3.5 w-3.5" />
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Status</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      className="w-9/12"
                      checked={selectedStatus == ''}
                      onClick={() => handleFilterClick('')}
                    >
                      All
                    </DropdownMenuCheckboxItem>

                    {Object.values(ConsignmentStatus).map((state) => (
                      <div className="flex m-1 items-center justify-between" key={state}>
                        <DropdownMenuCheckboxItem
                          className="w-9/12"
                          checked={selectedStatus == state}
                          onClick={() => handleFilterClick(state)}
                        >
                          {state}
                        </DropdownMenuCheckboxItem>
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <ConsignmentsTable consignmentPromise={consignmentPromise} />
              </Suspense>
            </CardContent>
            <CardFooter>
              {/* <div className="text-xs text-muted-foreground">
                                        Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                                        products
                                    </div> */}
            </CardFooter>
          </Card>
          {/* } */}
        </TabsContent>
      </Tabs>
      {/* {consignmentsList.value.map((consignment) => (
        <EditAcc consignment={consignment} key={consignment.consignmentId} hidden={true} />
      ))} */}
    </main>
  );
}
