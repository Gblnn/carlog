import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Props{
    db:string
    onChange?:any
    placeholder?:string
    onClick?:any
}

export default function ManualSelect(props:Props){    
    return(
        <Select defaultValue="vehicles" onValueChange={props.onChange}>
            <SelectTrigger style={{background:"rgba(100 100 100/ 35%)", fontSize:"0.8rem", paddingLeft:"1rem", display:"flex", justifyContent:"space-between", border:"", fontWeight:400, borderRadius:"1.25rem", height:"2rem"}}>

                <SelectValue/>
            </SelectTrigger>
            <SelectContent onClick={props.onClick}>
                <SelectItem  value={"vehicles"} >Vehicles</SelectItem>
                <SelectItem  value={"owners"}>Owners</SelectItem>
                <SelectItem  value={"maintenance"}>Maintenance</SelectItem>
            </SelectContent>
        </Select>

    )
}