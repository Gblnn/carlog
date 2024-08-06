import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { FileSpreadsheet, LogOut } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "./ui/dropdown-menu";

interface Props{
    trigger?:any
    onExport?:any
    onAccess?:any
    onArchives?:any
    onInbox?:any
    className?:any
}

export default function IndexDropdown(props:Props){
    return(
        <>
        <DropdownMenu>

            <DropdownMenuTrigger className={props.className} style={{outline:"none"}}>
                {props.trigger}
            </DropdownMenuTrigger>

            <DropdownMenuContent style={{margin:"0.25rem", marginRight:"1.25rem"}}>
        
        <DropdownMenuGroup>

          <DropdownMenuItem onClick={props.onExport} style={{width:"100%"}}>
            <FileSpreadsheet className="mr-2" color="lightgreen" />
            <span style={{width:"100%"}}>Export xlsx</span>
          </DropdownMenuItem>

          

          <DropdownMenuItem onClick={props.onInbox} style={{width:"100%"}}>
            <LogOut className="mr-2 " color="crimson" />
            <span style={{width:"100%"}}>Logout</span>
          </DropdownMenuItem>



          
          
        </DropdownMenuGroup>
        
      </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}