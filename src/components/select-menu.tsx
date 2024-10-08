import { db } from "@/firebase";
import { LoadingOutlined } from '@ant-design/icons';
import { message } from "antd";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Props{
    db:string
    onChange?:any
    placeholder?:string
    selectedDb?:any
    defaultValue?:string
}

export default function SelectMenu(props:Props){

    const [fetchingData, setfetchingData] = useState(false)
    const [records, setRecords] = useState<any>()

    useEffect(()=>{
        fetchData()
    },[])


    const fetchData = async () => {
        
        try {    
            setfetchingData(true)
            const RecordCollection = collection(db, props.db)
            const recordQuery = query(RecordCollection, orderBy("created_on"), where("db", "==", props.selectedDb))
            const querySnapshot = await getDocs(recordQuery)
            const fetchedData:any = [];

            querySnapshot.forEach((doc:any)=>{
                fetchedData.push({id: doc.id, ...doc.data()})    
                setRecords(fetchedData)
            })

            setfetchingData(false)
            
            
        } catch (error) {
            console.log(error)
            message.info(String(error))
        }   
    }



    
    return(
        <Select defaultValue={props.defaultValue} onValueChange={props.onChange}>
            <SelectTrigger style={{background:"rgba(100 100 100/ 35%)", fontSize:"1rem", paddingLeft:"1rem", opacity:0.75, display:"flex", justifyContent:"space-between", border:"", fontWeight:400, borderRadius:""}}>
                {
                    fetchingData?
                    <LoadingOutlined/>
                    :
                    <SelectValue placeholder={props.placeholder}/>
                }
                
            </SelectTrigger>
            <SelectContent>
                {
                    records?
                    records.map((r:any)=>(
                        <SelectItem key={r.id} value={r.type}>{r.type}</SelectItem>
                    ))
                    :null
                }
                
                
            </SelectContent>
        </Select>

    )
}