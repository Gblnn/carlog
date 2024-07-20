import DbComponent from "@/components/database-component";
import { Wrench } from "lucide-react";


export default function Maintenance(){
    return(
        <DbComponent db="maintenance" title="Logs" addItemTitle="Add Log" addItemIcon={<Wrench color="dodgerblue" width={"1rem"} />} loader={<Wrench color="dodgerblue" width={"3rem"} height={"3rem"} style={{position:"absolute"}} className="animate-ping"/>} type="log"/>
    )
}