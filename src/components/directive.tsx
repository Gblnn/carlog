import { BellOff, CheckSquare2, ChevronRight } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

interface Props{
    title?:string
    titleSize?:string
    icon?:any
    to?:any
    tag?:any
    status?:boolean
    onClick?:any
    subtext?:string
    selectable?:boolean
    onSelect?:any
    noArrow?:boolean
    selected?:boolean
    extra?:any
    extraOnDelete?:any
    extraOnEdit?:any
    notify?:boolean
    id_subtitle?:string
}

export default function Directive(props:Props){

    const [selected, setSelected] = useState(false)

    return(

        <Link onClick={()=>props.selectable?setSelected(!selected):null} to={props.to} style={{display:"flex", width:"100%", textDecoration:"none"}}>
            {/* <div style={{background:"#1a1a1a",width:"3rem", borderTopLeftRadius:"0.5rem", borderBottomLeftRadius:"0.5rem", display:"flex", alignItems:"center", justifyContent:"center"}}>
                {props.icon}
            </div> */}

            <button onClick={props.selectable?props.onSelect:props.onClick} style={{paddingLeft:"1rem", gap:"0.5rem", width:"100%", justifyContent:"space-between"}}>

                

                <div style={{display:"flex", gap:"1rem", alignItems:"center"}}>
                    {
                        props.selectable?
                        <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <CheckSquare2 className="check-square" fill={selected||props.selected?"dodgerblue":"rgba(100 100 100/ 50%)"} stroke={selected||props.selected?"white":"none"}/>
                        {
                            selected?
                            // <Check style={{position:"relative", width:"0.75rem"}} />
                            ""
                            :null
                        }
                        
                        </div>
                        
                        :
                        props.icon

                    }
                    

                    <div style={{border:'', width:""}}>
                    <p style={{fontWeight:400, textAlign:"left", border:"", width:"", fontSize:props.titleSize?props.titleSize:"0.9rem", textTransform:"capitalize"}}>
                        {props.title}
                    </p>

                    <p style={{fontSize:"0.65rem", textAlign:"left", color:"dodgerblue",opacity:"0.75", background:"", borderRadius:"0.5rem", paddingRight:"0.25rem", paddingLeft:"", fontWeight:600, textTransform:"uppercase"}}>{props.id_subtitle}</p>
                    </div>
                    

                    
                    

                </div>

            <div style={{display:"flex", alignItems:"center", gap:"0.75rem"}}>
            {
                        props.subtext?
                        <p style={{fontWeight:400, width:"", textAlign:"left", fontSize:"0.65rem", opacity:"0.6", textTransform:"uppercase"}}>
                        {""+props.subtext+""}
                        </p>
                        :null
                    }

                {props.selectable?
                null
                :
                        props.notify?
                        <BellOff width={"1rem"} color="grey"/>
                        :null
                    }
                    
                {
                
                
                props.tag?
                
                <p style={{background:"rgba(100 100 100/ 25%)",fontSize:"0.8rem", paddingLeft:"0.5rem", paddingRight:"0.5rem", borderRadius:"0.5rem", color:props.tag=="Expiring"?"violet":props.tag=="Available"?"lightgreen":props.status?"lightblue":"goldenrod", width:"", fontWeight:600, display:"flex", alignItems:"center", gap:"0.5rem", textTransform:"uppercase"}}>
                    {props.tag}
                    {/* <div style={{height:"0.5rem", width:"0.5rem", background:"dodgerblue", borderRadius:"50%"}}></div> */}
                    </p>
                :null
                }
                
                {
                    props.selectable||props.noArrow?
                    <div style={{width:"1rem"}}>
                       
                    </div>
                    :
                    <ChevronRight width={"1rem"}/>

                    
                }
                
            </div>
            
        </button>
        </Link>
        
    )
}