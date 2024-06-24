import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {useCurrency} from "@/CurrencyProvider.tsx";
//   import { Progress } from "@/components/ui/progress"

export default function TotalValuation({ ...props }) {
  const currency = useCurrency();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>Estimated Total Valuation</CardDescription>
        <CardTitle className="text-4xl">{currency.format({
          amount: props?.sessionItems?.reduce(
            (acc, item) => acc + item.itemDTO.reservePrice,
            0
          )
        })}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">
          this is calculated by summing the reserve price of all items in the session
        </div>
      </CardContent>
      <CardFooter>
        {/* <Progress value={25} aria-label="25% increase" /> */}
      </CardFooter>
    </Card>
  )
}
