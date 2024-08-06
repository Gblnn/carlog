import DbComponent from "@/components/database-component";
import { Cloud, Plus } from "lucide-react";

interface Props{
    db?:any
    dbID:string
}

export default function DatabaseElement(props:Props){

    const Capitalize = (str:any) =>{
        return str.charAt(0).toUpperCase() + str.slice(1);
        }

    return(
        <DbComponent dbID={props.dbID} db={props.db} title={Capitalize(props.db)} addItemTitle="Add Vehicle" addItemIcon={<Plus color="violet" width={"1rem"}/>} loader={<Cloud color="dodgerblue" width={"2.5rem"} height={"3rem"} style={{position:"absolute"}} className="animate-ping"/>}/>
    )
}