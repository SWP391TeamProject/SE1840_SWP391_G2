import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationEllipsis, PaginationNext } from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { useEffect } from "react"

export default function PagingIndexes(props: any) {
  const indexButtons = [];

  const loadIndexButtons = () => {
    let flag = true;
    for (let i = 0; i < props.totalPages; i++) {
      if (i == props.pageNumber) {
        indexButtons.push(
          <PaginationItem >
            <PaginationLink
              href="#"
              className="px-3 py-2 rounded-md bg-gray-900 text-gray-50 hover:bg-gray-900/90 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90"
              onClick={() => props.pageSelectCallback(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
      else if (i == props.totalPages - 1) {
        indexButtons.push(
          <PaginationItem >
            <PaginationLink
              href="#"
              className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => props.pageSelectCallback(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
      else if (i == 0) {
        indexButtons.push(
          <PaginationItem >
            <PaginationLink
              href="#"
              className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => props.pageSelectCallback(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
      else if (props.pageNumber > 5 && i == props.pageNumber - 5) {
        indexButtons.push(
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        );
      } 
      else if (props.pageNumber < props.totalPages - 5 && i == props.pageNumber + 5) {
        indexButtons.push(
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      else if (i - props.pageNumber <= 5 && props.pageNumber - i <= 5){
        indexButtons.push(
          <PaginationItem >
            <PaginationLink
              href="#"
              className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => props.pageSelectCallback(i)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return indexButtons;
  };

  return (

    <div className="flex justify-center mt-8">

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Button variant="outline" className="ml-2" disabled={props.pageNumber <= 0}>
              <PaginationPrevious href="#" className="mr-2" onClick={() => props.pageSelectCallback(props.pageNumber - 1)} />
            </Button>
          </PaginationItem>
          {loadIndexButtons()}
          <PaginationItem>
            <Button variant="outline" className="ml-2" disabled={props.pageNumber >= props.totalPages - 1}>
              <PaginationNext href="#" className="ml-2" onClick={() => props.pageSelectCallback(props.pageNumber + 1)} />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}