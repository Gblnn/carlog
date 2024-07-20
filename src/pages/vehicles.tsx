import DbComponent from "@/components/database-component";
import { Car, Cloud } from "lucide-react";


export default function Vehicles(){
    return(
        <DbComponent db="vehicles" title="Vehicles" addItemTitle="Add Vehicle" addItemIcon={<Car color="violet" width={"1rem"}/>} loader={<Cloud color="dodgerblue" width={"3rem"} height={"3rem"} style={{position:"absolute"}} className="animate-ping"/>}/>
    )
}