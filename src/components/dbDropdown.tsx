import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DownloadCloud, UploadCloud, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from "./ui/dropdown-menu";

interface Props{
    trigger?:any
    onExport?:any
    onAccess?:any
    onArchives?:any
    onDeleteDatabase?:any
    className?:any
}

export default function DbDropDown(props:Props){
    return(
        <>
        <DropdownMenu>

            <DropdownMenuTrigger className={props.className} style={{outline:"none"}}>
                {props.trigger}
            </DropdownMenuTrigger>

            <DropdownMenuContent style={{margin:"0.25rem", marginRight:"1.25rem"}}>
        
        <DropdownMenuGroup>

        <DropdownMenuItem onClick={props.onDeleteDatabase} style={{width:"100%"}}>
            <UploadCloud className="mr-2 " color="salmon" />
            <span style={{width:"100%"}}>Upload Data</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={props.onDeleteDatabase} style={{width:"100%"}}>
            <DownloadCloud className="mr-2 " color="lightgreen" />
            <span style={{width:"100%"}}>Download Data</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={props.onDeleteDatabase} style={{width:"100%"}}>
            <X className="mr-2 " color="crimson" />
            <span style={{width:"100%"}}>Delete Database</span>
          </DropdownMenuItem>

          
          
        </DropdownMenuGroup>
        
      </DropdownMenuContent>
        </DropdownMenu>
        </>
    )
}