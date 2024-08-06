import { LoadingOutlined } from '@ant-design/icons'
import { ConfigProvider, DatePicker, message, theme } from 'antd'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { CalendarDaysIcon, Car, CarFront, CheckSquare2, Cog, EllipsisVerticalIcon, FilePlus, FileSpreadsheet, Fuel, Globe, PackageOpen, PenLine, Plus, RadioTower, RefreshCcw, Trash, User, Wrench } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import useKeyboardShortcut from 'use-keyboard-shortcut'
import DefaultDialog from "../components/default-dialog"
import Directive from "../components/directive"
import SearchBar from "../components/searchbar"
import { db } from "../firebase"
import AddItemButton from './add-item-button'
import AddItemDialog from './add-item-dialog'
import Back from "./back"
import DbDropDown from './dbDropdown'
import DropDown from './dropdown'
import SelectMenu from './select-menu'
import ManualSelect from './manual-select'
import Owners from './Owners'

interface Props{
    title?:string
    db:string
    dbCategory?:string
    loader?:any
    noTraining?:boolean
    addItemTitle?:string
    addItemIcon?:any
    type?:string
    dbID:string
}


export default function DbComponent(props:Props){

    const usenavigate = useNavigate()
    
    // BASIC PAGE VARIABLES
    const [records, setRecords] = useState<any>([])
    const [id, setID] = useState("")
    const [loading, setLoading] = useState(false)
    const [addButtonModeSwap, setAddButtonModeSwap] = useState(false)
    const [deleteDbDialog, setDeleteDbDialog] = useState(false)

    const [vehicleNumber, setVehicleNumber] = useState("")
    const [vehicleName, setVehicleName] = useState("")
    const [vehicleOwner, setVehicleOwner] = useState("")
    const [chasisNumber, setChasisNumber] = useState("")
    const [modelNumber, setModelNumber] = useState("")

    const [logType, setLogType] = useState("")
    const [carName, setCarName] = useState("")
    const [description, setDescription] = useState("")
    const [amount, setAmount] = useState("")

    // const [editedCarName, setEditedCarName] = useState("")
    // const [editedDescription, setEditedDescription] = useState("")
    // const [editedAmount, setEditedAmount] = useState("")

    const [deleteDialog, setDeleteDialog] = useState(false)
    const [editDialog, setEditDialog] = useState(false)

    const [editedVehicleNumber, setEditedVehicleNumber] = useState("")
    const [editedVehicleName, setEditedVehicleName] = useState("")
    const [editedVehicleOwner, setEditedVehicleOwner] = useState("")
    const [editedChasisNumber, setEditedChasisNumber] = useState("")
    const [editedModelNumber, setEditedModelNumber] = useState("")

    const [itemDialog, setItemDialog] = useState(false)
    const [logDialog, setLogDialog] = useState(false)

    const [logDisplayDialog, setLogDisplayDialog] = useState(false)

    //MAIL CONFIG VARIABLES
    const [addDialog, setAddDialog] = useState(false)

    const [selectable, setSelectable] = useState(false)
    const [search, setSearch] = useState("")

    const [checked, setChecked] = useState<any>([])

    const [selected, setSelected] = useState(false)
    const [fetchingData, setfetchingData] = useState(false)
    const [status, setStatus] = useState("")

    const [selectAll, setSelectAll] = useState(false)
    const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false)

    const [progress, setProgress] = useState("")
    const [progressItem, setProgressItem] = useState<any>()
    const [addItemDialog, setAddItemDialog] = useState(false)

    // MAILJS VARIABLES
    // const serviceId = "service_lunn2bp";
    // const templateId = "template_1y0oq9l";

    const [resetTags, setResetTags] = useState(false)
    const [selectedDb, setSelectedDb] = useState("vehicles")
    const [ownersDialog, setOwnersDialog] = useState(false)


{/* ///////////////////////////////////////////////////////////////////////////////////////////////////////*/}


    // REALTIME AUTO UPDATE
    useEffect(()=>{
        onSnapshot(query(collection(db, props.db)), (snapshot:any) => {
            snapshot.docChanges().forEach((change:any) => {
              if (change.type === "added") {
                fetchData()   
              }
              if (change.type === "modified") {
                  fetchData()
              }
              if (change.type === "removed") {
                  fetchData()
              }
            });
          });

        
    },[])
    
    
    const {flushHeldKeys} = useKeyboardShortcut(
        ["Control", "A"],
        () => {
            
            setAddDialog(!addDialog)
            flushHeldKeys
        }
    )


    // PAGE LOAD HANDLER
    useEffect(() =>{
        fetchData()
    },[selectedDb])


    // INTERNET STATUS CHECKER
    useEffect(()=>{
        window.addEventListener('online', () => {
            setStatus("true")
        });
        window.addEventListener('offline', () => {
            setStatus("false")
        });
    })


    // DISPLAY CONNECTION STATUS
    useEffect(()=>{
        if(status=="true"){
            message.success("Connection Established")
            fetchData()   
        }    
        else if(status=="false"){
            message.error("Lost Connection.")
        }

    },[status])


    //INITIAL DATA FETCH ON PAGE LOAD
    const fetchData = async (type?:any) => {
        
        try {    
            setfetchingData(true)
            const RecordCollection = collection(db, selectedDb)
            const recordQuery = query(RecordCollection, orderBy("created_on"), where("db", "==", props.db))
            const querySnapshot = await getDocs(recordQuery)
            const fetchedData:any = [];

            querySnapshot.forEach((doc:any)=>{
                fetchedData.push({id: doc.id, ...doc.data()})    
            })

            setfetchingData(false)
            setRecords(fetchedData)
            setChecked([])
            setSelectable(false)

            type=="refresh"?
            message.success("Refreshed")
            :null
            
        } catch (error) {
            console.log(error)
            message.info(String(error))
            setStatus("false")
        }   
    }


    const addItem = async () => {
        try {
            setLoading(true)
            await addDoc(collection(db, "vehicles"), 
            {
                created_on:Timestamp.fromDate(new Date()), 
                vehicleNumber:editedVehicleNumber, 
                type:editedVehicleName, 
                db:props.db,
                vehicleOwner:editedVehicleOwner, 
                chasisNumber:editedChasisNumber, 
                modelNumber:editedModelNumber
            })

            setLoading(false)
            setVehicleNumber(editedVehicleNumber)
            setVehicleName(editedVehicleName)
            setVehicleOwner(editedVehicleOwner)
            setChasisNumber(editedChasisNumber)
            setModelNumber(editedModelNumber)
            fetchData()
            setAddDialog(false)
            
        } catch (error) {
            message.error(String(error))
            setLoading(false)     
        }
    }

    const deleteItem = async () => {
        setLoading(true)
        await deleteDoc(doc(db, props.db, id))
        setLoading(false)
        setDeleteDialog(false)
        setDeleteDialog(false)
        setItemDialog(false)
    }

    const addLog = async () => {
        try {
            setLoading(true)
            await addDoc(collection(db, "maintenance"), 
            {
                created_on:Timestamp.fromDate(new Date()), 
                type:logType, 
                db:props.db,
                carName:carName, 
                description:description, 
                amount:amount
            })

            setLoading(false)
            fetchData()
            setResetTags(!resetTags)
            setLogDialog(false)
            
        } catch (error) {
            message.error(String(error))
            setLoading(false)     
        }
    }
{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

    const handleSelect = (id:any) => {

        const index = checked.indexOf(id)

        if(index == -1){
            setChecked((data:any)=>[...data,id])
        }
        else{
            const newVal = [...checked]
            newVal.splice(index, 1)
            setChecked(newVal)
        }   
    }

    const handleBulkDelete = async () => {
        try {
            let counts = 0
            let percentage = 100/checked.length
            setLoading(true)
            
            await checked.forEach(async (item:any) => {
                await deleteDoc(doc(db, props.db, item))
                counts++
                setProgress(String(percentage*counts)+"%")
                setProgressItem(item)
            

                if(checked.length==counts){
                    setLoading(false)
                    
                    setBulkDeleteDialog(false)
                    setAddButtonModeSwap(false)
                    setSelectable(false)
                    fetchData()
                    setProgress("")
                }
            });

            
            

        } catch (error) {
            message.info(String(error))
        }
    }

    const deleteDatabase = async () => {
        try {
            setLoading(true)
            await deleteDoc(doc(db, "databases", props.dbID))
            records.forEach(async (e:any) => {
                await deleteDoc(doc(db, "vehicles", e.id))
            });

            records.forEach(async (e:any) => {
                await deleteDoc(doc(db, "maintenance", e.id))
            });

            setLoading(false)
            setDeleteDbDialog(false)
            usenavigate(-1)
        } catch (error) {
            setLoading(false)
            
        }
    }


    return(
        <>
        {
            status=="false"?
            <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>
            <div style={{display:"flex", width:"100%", background:"crimson", height:"1.5rem", justifyContent:"center", alignItems:"center", position:"fixed", bottom:0, margin:"0"}}>

                <div style={{display:"flex", gap:"0.5rem", alignItems:"center"}}>
                    <RadioTower width={"0.75rem"}/>
                    <p style={{fontSize:"0.75rem"}}>No Internet</p>
                </div>
            
            </div>
            </motion.div>
            :null
        }
        

        {/* Main Container */}
        <div style={{padding:"1.25rem", height:"100svh", border:"", 
            background:"linear-gradient(rgba(67 57 129/ 30%), rgba(100 100 100/ 0%)"}}>


            {/* Main Component */}
            <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>

            
                {/* BACK BUTTON */}
                <Back subtitle={props.title} title={"Records"
                +
                " ("+records.length+")"
            } 
                extra={
                    !selectable?
                    <div style={{display:"flex", gap:"0.5rem", height:"2.75rem"}}>
                        

                        
                        <button className="transitions blue-glass" style={{paddingLeft:"1rem", paddingRight:"1rem", width:"3rem"}} onClick={()=>{fetchData("refresh")}} >

                            {
                                fetchingData?
                            
                                <LoadingOutlined style={{color:"dodgerblue"}}/>
                                
                                
                                :
                                <RefreshCcw width={"1.25rem"} height={"1.25rem"} color="dodgerblue"/>
                            }
                            

                        </button>

                        <DbDropDown trigger={<EllipsisVerticalIcon width={"1rem"}/>} onDeleteDatabase={()=>setDeleteDbDialog(true)}/>


                            {/* <button onClick={()=>usenavigate("/inbox")} style={{ width:"3rem", background:"rgba(220 20 60/ 20%)"}}>
                                <InboxIcon className="" color="crimson"/>
                            </button> */}

                            
            
                    </div>
                    :
                    <div 
                    className="transitions" 
                    onClick={()=>{
                        setSelectAll(!selectAll)
                        !selectAll?
                        setSelected(true)
                        :setSelected(false)
                        !selectAll?
                        records.forEach((item:any)=>{
                            setChecked((data:any)=>[...data,item.id])
                        
                        })
                        :setChecked([])
                        }} 
                    style={{height:"2.75rem", border:"", width:"7.5rem", background:selectAll?"dodgerblue":"rgba(100 100 100/ 20%)", padding:"0.5rem", display:"flex", alignItems:"center", justifyContent:"space-between", paddingLeft:"1rem", paddingRight:"1rem", borderRadius:"0.5rem", cursor:"pointer"}}>
                        <p style={{opacity:0.75}}>Selected</p>
                        <p style={{ fontWeight:600}}>{checked.length}</p>
                    </div>
                    }
                />
                
                
                <div style={{display:"flex", border:'', justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", marginTop:"1.25rem"}}>
                <div style={{width:"13ch"}}>
                <ManualSelect db='vehicles' onChange={setSelectedDb} placeholder=''/>
                </div>

                <button onClick={()=>setOwnersDialog(true)} style={{height:"2rem", borderRadius:"1.25rem", fontSize:"0.8rem", paddingLeft:"2.25rem", paddingRight:"2.25rem", display:"flex", alignItems:'center'}}>
                    <User color='dodgerblue' width={"0.8rem"}/>
                    Owners</button>
                </div>
                

                {/* <div style={{border:""}}>
                    <Tab/>
                </div> */} 



                {
                // IF NUMBER OF RECORDS IS LESS THAN 1
                records.length<1?

                status=="false"?
                <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>
                    <div style={{width:"100%",height:"75svh", display:"flex", justifyContent:"center", alignItems:"center", border:"", flexFlow:"column"}}>

                        <div style={{display:"flex", gap:"0.25rem", opacity:"0.5"}}>
                            <RadioTower width={"1rem"}/>
                            <p>No Internet Connection</p>
                            
                        </div>
                        <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>
                        <p style={{opacity:0.5, fontSize:"0.7rem"}}>Please check your internet connectivity</p>
                        </motion.div>
                    </div>
                </motion.div>
                :

                fetchingData?
                <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>
                    <div style={{width:"100%",height:"69svh", display:"flex", justifyContent:"center", alignItems:"center", border:""}}>

                        <div style={{ border:"", display:"flex", alignItems:"center", justifyContent:"center"}}>
                            {props.loader}
                        </div>
                    </div>
                </motion.div>
                
                :

                // DISPLAY EMPTY SET - PAGE
                <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>
                    <div style={{width:"100%",height:"69svh", display:"flex", justifyContent:"center", alignItems:"center", border:"", flexFlow:"column"}}>

                        <div style={{display:"flex", gap:"0.25rem", opacity:"0.5"}}>
                            <PackageOpen width={"1rem"}/>
                            <p>No Data</p>
                        </div>
                
                        <p style={{opacity:0.5, fontSize:"0.7rem"}}>Add a record using + Add Button</p>

                    </div>
                </motion.div>


                : //else


                //DISPLAY Page Beginning
                <div style={{display:"flex", flexFlow:"column", gap:"0.5rem", marginTop:""}}>

                

                    {/* Searchbar */}
                    <div style={{display:"flex", gap:"0.75rem", border:"", flex:1}}>

                        <button className={selectable?"blue":""} onClick={()=>{setSelectable(!selectable);setAddButtonModeSwap(!addButtonModeSwap);selectable && setChecked([]); !selectable && setSelected(false)}}>

                                <CheckSquare2 color={selectable?"white":"dodgerblue"}/>

                        </button>

                        <SearchBar placeholder="Search Records" onChange={(e:any)=>{setSearch(e.target.value.toLowerCase())}}/>
                    </div>

                
                     

                    
                
                <div className="record-list" style={{display:"flex", gap:"0.6rem", flexFlow:"column", overflowY:"auto", height:"69svh", paddingTop:"", paddingRight:"0.25rem", marginTop:"0.45rem", border:""}}>
                    
                {
                    // RECORD DATA MAPPING
                    records
                    .filter((post:any)=>{
                    
                        return search == ""?
                        {}
                        :
                        post.type&&
                        ((post.type).toLowerCase()).includes(search.toLowerCase())
                        
                    
                    })
                    .map((post:any)=>(
                        <motion.div key={post.id} initial={{opacity:0}} whileInView={{opacity:1}}>

                            <Directive 

                                
                                
                                tag={selectedDb=="maintenance"?"OMR "+post.amount:post.vehicleNumber}
                                
                                selected={selected}

                                selectable={selectable}

                                status

                                id_subtitle={selectedDb=="maintenance"?post.carName:post.modelNumber}
                            
                                // ON CLICK
                                onSelect={()=>{
                                    handleSelect(post.id)
                                }}
                                onClick={()=>{
                                    setID(post.id);
                                    
                                    if(selectedDb=="vehicles"){
                                    setItemDialog(true)
                                    setVehicleNumber(post.vehicleNumber)
                                    setVehicleName(post.type)
                                    setVehicleOwner(post.vehicleOwner)
                                    setChasisNumber(post.chasisNumber)
                                    setModelNumber(post.modelNumber)
                                    }
                                    
                                    if(selectedDb=="maintenance"){
                                        setLogDisplayDialog(true)
                                        setLogType(post.type)
                                        setCarName(post.carName)
                                        setDescription(post.description)
                                        setAmount(post.amount)
                                    }
                                }}                        

                            key={post.id} title={post.type} 
                            icon={
                                post.type=="fuel"?
                                <Fuel width={"1.5rem"} color='goldenrod'/>
                                :
                                post.type=="service"?
                                <Wrench color='dodgerblue' width={"1.5rem"}/>
                                :
                                post.type=="parts"?
                                <Cog color='violet' width={"1.5rem"}/>
                                :
                                post.type=="other"?
                                <Globe width={"1.5rem"}/>
                                :
                                <Car color='dodgerblue' width={"1.5rem"}/>
                            } />
                        </motion.div>
                    ))
                }

                </div>
                

                </div>
                
                }

                <br/>


            </motion.div>


            {/* ADD RECORD BUTTON */}
            <AddItemButton title={addButtonModeSwap?"Delete":"Add"} onClickSwap={addButtonModeSwap} 
            // onClick={()=>setAddDialog(true)} 
            onClick={()=>{setAddItemDialog(true)}}
            alternateOnClick={
                ()=>{checked.length<1?null:setBulkDeleteDialog(true)}
            }
            icon={addButtonModeSwap?<Trash color="crimson" width="1rem"/>:props.addItemIcon}
            />


{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

            {/* Dialog Boxes 👇*/}

            <Owners open={ownersDialog} onCancel={()=>setOwnersDialog(false)}/>

            <DefaultDialog close titleIcon={<Plus/>} open={addItemDialog} title={"Add Item"} onCancel={()=>setAddItemDialog(false)}
            extra={
                <div style={{display:"flex", flexFlow:"column", gap:"0.5rem"}}>
                    <Directive icon={<User width={"1rem"} color='dodgerblue'/>} title='Add Owner'/>
                    <Directive onClick={()=>setAddDialog(true)} icon={<Car width={"1rem"} color='violet'/>} title='Add Vehicle'/>
                    <Directive onClick={()=>{setLogDialog(true)}} icon={<Wrench width={"1rem"} color='dodgerblue'/>} title='Add Maintenance'/>
                </div>
            }
            />

            <DefaultDialog open={deleteDbDialog} destructive onCancel={()=>setDeleteDbDialog(false)} title={"Delete Database?"} extra={<p style={{textAlign:"left", fontSize:"0.8rem", opacity:0.5, marginBottom:"", margin:"1rem", marginTop:"0"}}>This will irrecoverably delete all data within this database, please proceed with caution</p>} OkButtonText='Delete' onOk={deleteDatabase} updating={loading} disabled={loading}/>


            {/* ADD ITEM DIALOG */}
            <AddItemDialog open={addDialog} title='Add Vehicle' titleIcon={<Car/>} onCancel={()=>setAddDialog(false)} 
            updating={loading}
            disabled={loading}
            VehicleNumberOnChange={(e:any)=>setEditedVehicleNumber(e.target.value)}
            VehicleNameOnChange={(e:any)=>setEditedVehicleName(e.target.value)}
            VehicleOwnerOnChange={(e:any)=>setEditedVehicleOwner(e.target.value)}
            ChasisNumberOnChange={(e:any)=>setEditedChasisNumber(e.target.value)}
            ModelNumberOnChange={(e:any)=>setEditedModelNumber(e.target.value)}
            onOK={addItem}
            />

            {/* ITEM DISPLAY DIALOG */}
            <DefaultDialog close open={itemDialog} title={vehicleName} titleIcon={<Car color='dodgerblue'/>} onCancel={()=>setItemDialog(false)}
            code={vehicleNumber}
            title_extra={
                <div style={{display:"flex", gap:"0.5rem", alignItems:"center"}}>
                    <DropDown onDelete={()=>setDeleteDialog(true)} onEdit={()=>setEditDialog(true)} trigger={<EllipsisVerticalIcon width={"1.1rem"}/>}/>
                </div>
            }
            
            extra={
                <div style={{display:"flex", flexFlow:"column", gap:"0.5rem"}}>
                    <Directive icon={<User width={"1.1rem"} color='dodgerblue'/>} title='Owner' tag={vehicleOwner} status noArrow/>
                    <Directive icon={<CalendarDaysIcon width={"1.1rem"} color='dodgerblue'/>} title='Model Number' tag={modelNumber} status noArrow/>
                    <Directive icon={<CarFront width={"1.1rem"} color='dodgerblue'/>} title='Chasis Number' tag={chasisNumber} status noArrow/>
                    <Directive title='Maintenance Summary' icon={<Wrench color='dodgerblue' width={"1rem"}/>}/>
                </div>
            } 
            />

            {/* ADD ITEM DIALOG */}
            <DefaultDialog created_on={logType} open={logDialog} onCancel={()=>{setLogDialog(false);setLogType("");setResetTags(!resetTags)}} title={"Add Log"} titleIcon={<FilePlus/>}
            updating={loading}
            disabled={loading}
            onOk={addLog}
            OkButtonText='Add'
            resetTags={resetTags}
            tags
            tag1Text={

                <div  onClick={()=>setLogType("fuel")} style={{display:"flex", alignItems:"center", gap:"0.75rem", width:"100%", justifyContent:"center"}}>
                    <Fuel width={"1rem"}/>
                    Fuel
                </div>
            }

            

            tag2Text={
                <div onClick={()=>setLogType("service")} style={{display:"flex", alignItems:"center", gap:"0.75rem", width:"100%", justifyContent:"center"}}>
                    <Wrench width={"1rem"}/>
                    Service
                </div>
            }

            tag3Text={
                <div onClick={()=>setLogType("parts")} style={{display:"flex", alignItems:"center", gap:"0.75rem" , width:"100%", justifyContent:"center"}}>
                    <Cog width={"1rem"}/>
                    Parts
                </div>
            }

            tag4Text={
                <div onClick={()=>setLogType("other")} style={{display:"flex", alignItems:"center", gap:"0.75rem", width:"100%", justifyContent:"center"}}>
                    <Globe width={"1rem"}/>
                    Other
                </div>
            }

            extra={
                <div style={{display:"flex", flexFlow:"column", gap:"0.5rem"}}>
                    <SelectMenu placeholder='Select vehicle' db='vehicles' selectedDb={props.db} onChange={setCarName}/>
                    <input onChange={(e:any)=>setDescription(e.target.value)} placeholder='Description'/>
                    <input onChange={(e:any)=>setAmount(e.target.value)} placeholder='Amount'/>
                    <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
                    <DatePicker format={"DD/MM/YYYY"} style={{height:"2.5rem", fontSize:"1.1rem", background:"none"}}/>
                    </ConfigProvider>
                    
                </div>
                
            }
            />


            {/* DELETE DIALOG */}
            <DefaultDialog title={"Delete Item?"} open={deleteDialog} onCancel={()=>setDeleteDialog(false)} destructive OkButtonText='Delete' onOk={deleteItem} updating={loading}/>

            {/* BULK DELETE DIALOG */}
            <DefaultDialog progressItem={progressItem} progress={progress} destructive updating={loading} title="Delete record(s)?" open={bulkDeleteDialog} OkButtonText="Confirm" onCancel={()=>setBulkDeleteDialog(false)} onOk={handleBulkDelete} disabled={loading}/>

            {/* EDIT DIALOG */}
            <DefaultDialog title={"Edit"} titleIcon={<PenLine/>} open={editDialog} onCancel={()=>setEditDialog(false)}  OkButtonText='Update' onOk={deleteItem} updating={loading}
            />


            <DefaultDialog close title={logType} open={logDisplayDialog} onCancel={()=>setLogDisplayDialog(false)}
                titleIcon={
                    logType=="fuel"?
                    <Fuel color='goldenrod'/>
                    :
                    logType=="service"?
                    <Wrench color='dodgerblue'/>
                    :
                    logType=="parts"?
                    <Cog color='violet'/>
                    :
                    logType=="other"&&
                    <Globe/>
                    
                }

                title_extra={
                    <div style={{display:"flex", gap:"0.5rem", alignItems:"center"}}>
                        <DropDown onDelete={()=>setDeleteDialog(true)} onEdit={()=>setEditDialog(true)} trigger={<EllipsisVerticalIcon width={"1.1rem"}/>}/>
                    </div>
                }

                extra={
                    <>
                    
                    <div style={{display:"flex", gap:"0.5rem", paddingLeft:"1rem", fontSize:"4rem", alignItems:'center', borderTop:"1px solid rgba(100 100 100/ 50%)", paddingTop:"1rem"}}>
                        
                        <p>{amount}</p>
                        <p style={{fontSize:"1rem", opacity:0.5}}>OMR</p>
                        
                    </div>
                    <div style={{display:"flex", flexFlow:"column", gap:"0.5rem"}}>
                        <Directive icon={<CarFront/>} title={carName}/>
                        <Directive icon={<FileSpreadsheet/>} title={"Description"} tag={description?description:"No Description"} status/>
                    </div>
                    </>
                }
                />
            </div>
        </>
    )
}