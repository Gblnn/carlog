import { db } from '@/firebase';
import { LoadingOutlined } from '@ant-design/icons';
import { addDoc, collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { Cloud, Database, EllipsisVerticalIcon, Plus, Radar, RefreshCcw } from "lucide-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Back from "../components/back";
import AddItemButton from './add-item-button';
import Directive from './directive';
import IndexDropdown from './indexDropdown';
import InputDialog from './input-dialog';

interface Props{
    version?:string
    db?:any
}

export default function IndexComponent(props:Props){

    const [addDbDialog, setAddDbDialog] = useState(false)
    const usenavigate = useNavigate()
    const [fetchingData, setfetchingData] = useState(false)
    const [loading, setLoading] = useState(false)
    const [records, setRecords] = useState<any>([])
    const [databaseName, setDatabaseName] = useState("")


    useEffect(()=>{
        fetchData()
    },[])

    //INITIAL DATA FETCH ON PAGE LOAD
    const fetchData = async () => {
        
        try {    
            setfetchingData(true)
            const RecordCollection = collection(db, props.db)
            const recordQuery = query(RecordCollection, orderBy("created_on"))
            const querySnapshot = await getDocs(recordQuery)
            const fetchedData:any = [];

            querySnapshot.forEach((doc:any)=>{
                fetchedData.push({id: doc.id, ...doc.data()})    
            })

            setfetchingData(false)
            setRecords(fetchedData)
            
            
        } catch (error) {
            console.log(error)
            setfetchingData(false)
        }   
    }

    const addItem = async () => {
        try {
            setLoading(true)
            await addDoc(collection(db, props.db),{created_on:Timestamp.fromDate(new Date()), name:databaseName})
            setAddDbDialog(false)
            fetchData()
            setLoading(false)
            
        } catch (error) {
            setLoading(false)
        }
    }

    return(
        <div style={{padding:"1.25rem", background:"linear-gradient(rgba(18 18 80/ 65%), rgba(100 100 100/ 0%))", height:"90svh", border:""}}>

            <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>

                <Back subtitle={props.version} icon={<Radar color='salmon' style={{width:"2rem", height:"auto"}}/>} title="CarLog" noback 
                extra={
                    <div style={{display:"flex", gap:"0.5rem"}}>

                        {/* <button onClick={()=>window.location.reload()} style={{paddingLeft:"1rem", paddingRight:"1rem", fontSize:"0.8rem"}}>
                    
                            
                            <p style={{opacity:0.5, letterSpacing:"0.15rem"}}>{props.version}</p>
                        </button> */}

                        <button className="transitions blue-glass" style={{paddingLeft:"1rem", paddingRight:"1rem", width:"3rem"}} onClick={()=>{fetchData()}} >

                            {
                                fetchingData?
                            
                                <LoadingOutlined style={{color:"dodgerblue"}}/>
                                
                                
                                :
                                <RefreshCcw width={"1.25rem"} height={"1.25rem"} color="dodgerblue"/>
                            }
                            

                        </button>



                        <IndexDropdown onInbox={()=>usenavigate("/")} onArchives={()=>usenavigate("/archives")} onAccess={()=>usenavigate("/access-control")} trigger={<EllipsisVerticalIcon width={"1.1rem"}/>}/>

                        {/* <button onClick={()=>{signOut(auth).then(()=>{usenavigate("/")}).catch((e)=>message.error(String(e.message)));}} style={{width:"3rem"}}><LogOut width={"1rem"} color='lightcoral'/></button> */}
                        
                    </div>
                    
                }/>
                <br/>

                <div style={{display:"flex", flexFlow:"column", gap:"0.5rem"}}>

                {
                    
                    records.length<1?
                    fetchingData?

                    <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>
                    <div style={{width:"100%",height:"75svh", display:"flex", justifyContent:"center", alignItems:"center", border:""}}>

                        {/* <div style={{display:"flex", gap:"0.5rem", opacity:"0.5", border:""}}>
                            <p style={{fontSize:"0.75rem"}} className="animate-ping">Fetching Data</p>
                        </div> */}

                        <div style={{ border:"", display:"flex", alignItems:"center", justifyContent:"center"}}>
                            
                            <Cloud color='dodgerblue' style={{width:"2.5rem", height:"auto"}} className='animate-ping'/>
                            
                            
                        </div>
                        


                    </div>
                    </motion.div>
                    
                    :
                    <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>
                        <div style={{width:"100%",height:"75svh", display:"flex", justifyContent:"center", alignItems:"center", border:"", flexFlow:"column"}}>

                            <div style={{display:"flex", gap:"0.25rem", opacity:"0.5"}}>
                                <Database width={"1rem"}/>
                                <p>No Databases</p>
                                
                            </div>
                    
                            


                        </div>
                    </motion.div>
                    :
                    records
                    .map((post:any)=>(
                        <motion.div key={post.id} initial={{opacity:0}} whileInView={{opacity:1}}>

                            <Directive to={"/"+String(post.name.toLowerCase())} icon={<Database color='violet' width={"1.25rem"}/>} title={post.name} />
                        </motion.div>
                    ))
    

                }
                    
                </div>

                <AddItemButton onClick={()=>{setAddDbDialog(true)}} title='Add Database' icon={<Plus width={"1rem"} color='violet'/>}/>


            </motion.div>

            <InputDialog open={addDbDialog} onCancel={()=>setAddDbDialog(false)} title='Add a Database' titleIcon={<Database color='violet'/>} image={<input style={{fontSize:"0.75rem"}} type='file'/>} inputplaceholder='Database Name' OkButtonText='Create' updating={loading} disabled={loading} onOk={addItem} inputOnChange={(e:any)=>setDatabaseName(e.target.value)} input2placeholder='Path' input2Value={"/"+databaseName}/>
            
        </div>
    )
}