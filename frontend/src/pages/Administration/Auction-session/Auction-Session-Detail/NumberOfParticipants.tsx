import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
//   import { Progress } from "@/components/ui/progress"
  
  export default function NumberOfParticipants ({...props}) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Number of participants</CardDescription>
          <CardTitle className="text-4xl">{props.totalParticipants}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            this is calculated by summing all the deposits in the session
          </div>
        </CardContent>
        <CardFooter>
          {/* <Progress value={25} aria-label="25% increase" /> */}
        </CardFooter>
      </Card>
    )
  }
  