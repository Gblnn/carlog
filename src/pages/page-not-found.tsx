
import { LoadingOutlined } from '@ant-design/icons'

export default function PageNotFound(){


    return(
        <div style={{display:"flex", width:"100%", height:"100svh", justifyContent:"center", alignItems:"center", fontSize:"1rem", gap:"1rem"}}>
            <div style={{borderRight:"1px solid rgba(100 100 100/ 60%)", padding:"0.5rem", paddingRight:"1rem"}}>
                <p style={{fontSize:"1.5rem", fontWeight:"600"}}><LoadingOutlined/></p>
            </div>
            <p style={{fontSize:"0.8rem"}}>Loading Database</p>
            <p onClick={()=>window.location.reload()} style={{color:"dodgerblue", cursor:"pointer"}}>Continue</p>
        </div>
    )
}