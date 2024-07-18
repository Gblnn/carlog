import { motion } from 'framer-motion';
import { Car, Indent, Mail, RefreshCwIcon, Wrench } from "lucide-react";
import { useState } from "react";
import Back from "../components/back";
import DefaultDialog from "../components/default-dialog";
import Directive from "../components/directive";

interface Props{
    version?:string
}

export default function IndexComponent(props:Props){

    const [requestDialog, setRequestDialog] = useState(false)

    return(
        <div style={{padding:"1.5rem", background:"linear-gradient(rgba(18 18 80/ 65%), rgba(100 100 100/ 0%))", height:"90svh", border:""}}>

            <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>
                <Back icon={<Indent color="salmon"/>} title="Index" noback extra={<button onClick={()=>window.location.reload()} style={{paddingLeft:"1rem", paddingRight:"1rem", fontSize:"0.8rem"}}><RefreshCwIcon color="crimson" width={"1rem"}/>Update<p style={{opacity:0.5, letterSpacing:"0.15rem"}}>{props.version}</p></button>}/>
                <br/>

                <div style={{display:"flex", flexFlow:"column", gap:"0.5rem"}}>

                    <Directive to="/vehicles" title="Vehicles" icon={<Car color="violet" width={"1.1rem"}/>}/>

                    <Directive to="/maintenance" title="Maintenance" icon={<Wrench color='dodgerblue' width={"1.1rem"}/>}/>

                    {/* <Directive onClick={()=>{setRequestDialog(true)}} title="Request Feature" icon={<Plus color="grey" width={"1.1rem"} height={"1.1rem"}/>}/> */}

                </div>
            </motion.div>

            <DefaultDialog titleIcon={<Mail/>} title="Request Feature" extra={<p style={{fontSize:"0.85rem", opacity:0.5, marginBottom:"0.5rem"}}>Reach out to the developer to request a new feature? You will be redirected to your e-mail client</p>} open={requestDialog} OkButtonText="Reach out" onCancel={()=>setRequestDialog(false)} sendmail/>
            
        </div>
    )
}