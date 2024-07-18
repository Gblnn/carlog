import DbComponent from "@/components/database-component";
import { Wrench } from "lucide-react";


export default function Maintenance(){
    return(
        <DbComponent title="Logs" addItemTitle="Add Log" addItemIcon={<Wrench color="dodgerblue" width={"1rem"}/>}/>
    )
}