import { useQuery } from "@tanstack/react-query";
import { FolderIcon, Loader2 } from "lucide-react";
import React, { FC, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

type FetchButtonProps = {
    apiFunction: () => Promise<any>;
    buttonName: string;
    setData: (data: any) => void;
    navTo: string;
    queryKey: [string, any?];
    className?: string;
    icon?: any;
  };
  const FetchButton: FC<FetchButtonProps> = ({ apiFunction, buttonName, setData, navTo, queryKey, className, icon }) => {
    const [isEnable, setIsEnable] = useState(false);
    const { data, isRefetching, error, refetch } = useQuery(
        {
            queryKey: queryKey,
            queryFn: apiFunction,
            // enabled: isEnable
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
        <Button disabled className="flex flex-row justify-center items-left">
            <Loader2 className="animate-spin basis-1/5 " /> 
             <p className="basis-4/5 text-left">Please wait</p>
        </Button>
    );


    if (error) return <div>Error: {error.message}</div>;



    return <Button className={className}  onClick={handleOnClick} >{icon}{buttonName}</Button>;
}
export default FetchButton;