import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";


export default function FetchButton({ apiFunction, buttonName, setData,navTo,queryKey }) {
    const [isEnable, setIsEnable] = useState(false);
    const { data, isRefetching, error, refetch } = useQuery(
        {
            queryKey: queryKey,
            queryFn: apiFunction,
            enabled: isEnable
        }
    )
    const nav = useNavigate();
    const handleOnClick = () => {
        console.log("fetch button clicked")
        setIsEnable(true)
        refetch();
        setIsEnable(false)
        nav(navTo)
    }
    useEffect(() => {
        console.log(buttonName)
        console.log(isEnable)
    }, [isEnable])

    useEffect(() => {
        if (data != null) {
            setData(data);

        }
        console.log(data)
    }, [data])


    if (isRefetching) return (
        <Button disabled>
            <Loader2 className="animate-spin" />
            Please wait
        </Button>
    );


    if (error) return <div>Error: {error.message}</div>;



    return <Button className="rounded border border-red-600 text-left h-6" onClick={handleOnClick}>{buttonName}</Button>;
}
