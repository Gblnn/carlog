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
            <SelectTrigger style={{background:"rgba(100 100 100/ 35%)", fontSize:"0.8rem", paddingLeft:"1rem", display:"flex", justifyContent:"space-between", border:"", fontWeight:500, borderRadius:"1.25rem", height:"2rem", width:"8.25rem"}}>

                <SelectValue/>
            </SelectTrigger>
            <SelectContent onClick={props.onClick} style={{zIndex:10}}>
                <SelectItem  value={"vehicles"} >Vehicles</SelectItem>
                <SelectItem  value={"maintenance"}>Maintenance</SelectItem>
            </SelectContent>
        </Select>

    )
}