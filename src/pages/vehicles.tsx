import DbComponent from "@/components/database-component";
import { Cloud } from "lucide-react";


export default function Vehicles(){
    return(
        <DbComponent title="Vehicles" loader={<Cloud color="dodgerblue" width={"3rem"} height={"3rem"} style={{position:"absolute"}} className="animate-ping"/>}/>
    )
}