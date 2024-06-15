import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ItemCard({ ...props }) {
    return <Card className="w-[200px] h-[50]">

        <CardHeader>
            <CardTitle>{props.item.title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p>{props.item.itemId}</p>
            <p>{props.item.name}</p>

            <p>{props.item.reservePrice}</p>
        </CardContent>
        <CardFooter>
            {props.handleAssign ? <Button onClick={props.handleAssign(props.item)}>Assign</Button>
                :
                <Button onClick={props.handleUnassign(props.item)}>Unassign</Button>
            }
        </CardFooter>


    </Card>;
}
