import { Info, Plus } from "lucide-react";
import InputDialog from "./input-dialog";

interface Props{
    open?:boolean
    title?:string
    onImageChange?:any
    onOK?:any
    onCancel?:any
    updating?:boolean
    disabled?:boolean

    VehicleNumberOnChange?:any
    VehicleNameOnChange?:any
    VehicleOwnerOnChange?:any
    ChasisNumberOnChange?:any
    ModelNumberOnChange?:any

    VehicleNumberLabel?:string
    VehicleNameLabel?:string
    VehicleOwnerLabel?:string
    ChasisNumberLabel?:string
    ModelNumberLabel?:string

    VehicleNumberValue?:string
    VehicleNameValue?:string
    VehicleOwnerValue?:string
    ChasisNumberValue?:string
    ModelNumberValue?:string
}

export default function AddItemDialog(props:Props){
    return(
        <InputDialog open={props.open} OkButtonIcon={<Plus width={"1rem"}/>} 

            title={props.title}

            // image={<input type="file" style={{fontSize:"0.8rem"}} onChange={props.onImageChange}/>}
            // title={props.title} OkButtonText="Add" onCancel={props.onCancel} onOk={props.onOK}

            inputplaceholder="Vehicle Number" 
            input2placeholder="Vehicle Name"
            input3placeholder="Vehicle Owner"
            input4placeholder="Chasis Number"
            input5placeholder="Model Number"
            
            inputOnChange={props.VehicleNumberOnChange}  
            input2OnChange={props.VehicleNameOnChange}  
            input3OnChange={props.VehicleOwnerOnChange}
            input4OnChange={props.ChasisNumberOnChange}
            input5OnChange={props.ModelNumberOnChange}
            
            input1Label={props.VehicleNumberLabel}
            input2Label={props.VehicleNameLabel}
            input3Label={props.VehicleOwnerLabel}
            input4Label={props.ChasisNumberLabel}
            input5Label={props.ModelNumberOnChange}

            input1Value={props.VehicleNumberValue}
            input2Value={props.VehicleNameValue}
            input3Value={props.VehicleOwnerValue}
            input4Value={props.ChasisNumberValue}
            input5Value={props.ModelNumberValue}

            OkButtonText="Add"

            onCancel={props.onCancel}

            
            disabled={props.disabled} updating={props.updating}  
                
            extra={


                <div style={{textAlign:"center", fontSize:"0.7rem", display:"flex", alignItems:"center", gap:"0.5rem", width:"100%", border:"", justifyContent:"center", padding:"0.25rem",background:"linear-gradient(90deg, rgba(100 100 100/ 0%), rgba(100 100 100/ 20%),rgba(100 100 100/ 20%), rgba(100 100 100/ 0%))"}}><Info width={"1rem"} color="violet"/><p style={{opacity:"0.75"}}>We require email to notify the document holder</p></div>
                }
            />
    )
}