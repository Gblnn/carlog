import DefaultDialog from "./default-dialog";

interface Props{
    open?:boolean
}

export default function Owners(props:Props){
    return(
        <DefaultDialog title={"Add Item"} open={props.open}/>
    )
}