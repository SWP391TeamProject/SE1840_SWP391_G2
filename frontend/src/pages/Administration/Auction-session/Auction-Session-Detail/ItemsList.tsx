import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ItemsList({ ...props }) {
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>Lots</CardTitle>
        <CardDescription>
          list of all lots participated in this session
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead className="hidden sm:table-cell">Name</TableHead>
              <TableHead className="hidden sm:table-cell">Reserve Price</TableHead>
              <TableHead className="hidden md:table-cell">Current Top Bid</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props?.sessionItems?.map((item): any => (
              <TableRow className="bg-accent" key={item?.id.itemId}>
                <TableCell>{item?.id.itemId}</TableCell>
                <TableCell className="hidden sm:table-cell">{item?.itemDTO.name}</TableCell>
                <TableCell className="hidden sm:table-cell">{item?.itemDTO.reservePrice}</TableCell>
                <TableCell className="hidden md:table-cell">{item?.currentPrice}</TableCell>
              </TableRow>
            ))}
            
            



          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
