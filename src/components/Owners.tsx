import { User } from "lucide-react";
import DefaultDialog from "./default-dialog";

interface Props{
    open?:boolean
    onCancel?:any
}

export default function Owners(props:Props){
    return(
        <DefaultDialog close title={"Owners"} titleIcon={<User color="dodgerblue"/>} open={props.open} onCancel={props.onCancel}/>
    )
}