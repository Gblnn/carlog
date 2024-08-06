import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props{
    icon?:any
    title?:any
    extra?:any
    noback?:boolean
    subtitle?:string
}

export default function Back(props:Props){
    const usenavigate = useNavigate()
    return(
        <div style={{display:"flex", alignItems:'center', gap:"0.5rem", zIndex:5, justifyContent:"space-between" }}>
            <div style={{display:"flex"}}>
                {props.noback?
                null
                :
                <button onClick={()=>{usenavigate(-1)}} style={{ backdropFilter:"blur(16px)", marginRight:"0.5rem"}}>
                    <ChevronLeft/>
                </button>
                }
                
                
                <div style={{display:"flex", alignItems:"center",marginLeft:"0.5rem",gap:"0.75rem"}}>
                    {props.icon}
                    <div style={{display:"flex", flexFlow:"column"}}>
                        <h2 style={{letterSpacing:"0.025rem", fontWeight:400, fontSize:"1.25rem", border:"", height:"1.65rem"}}>{props.title}</h2>
                        {
                            props.subtitle&&
                            <h3 style={{fontSize:"0.7rem", opacity:0.5}}>{props.subtitle}</h3>
                        }
                    
                    </div>
                    
                </div>

            </div>

            {props.extra}
            
                
        </div>
    )
}