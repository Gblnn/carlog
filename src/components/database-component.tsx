import { LoadingOutlined } from '@ant-design/icons'
import emailjs from '@emailjs/browser'
import { message } from 'antd'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, Timestamp } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { CalendarDaysIcon, Car, CarFront, CheckSquare2, CloudUpload, Cog, EllipsisVerticalIcon, FilePlus, Fuel, Globe, MailCheck, PackageOpen, RadioTower, RefreshCcw, User, Wrench } from "lucide-react"
import { useEffect, useState } from "react"
import useKeyboardShortcut from 'use-keyboard-shortcut'
import DefaultDialog from "../components/default-dialog"
import Directive from "../components/directive"
import FileInput from "../components/file-input"
import SearchBar from "../components/searchbar"
import { db } from "../firebase"
import AddItemButton from './add-item-button'
import AddItemDialog from './add-item-dialog'
import Back from "./back"
import DropDown from './dropdown'
import SelectMenu from './select-menu'


// Running Notes
// Check whether expiry date minus 3 is equals to today - 3 month reminder

interface Props{
    title?:string
    db:string
    dbCategory?:string
    loader?:any
    noTraining?:boolean
    addItemTitle?:string
    addItemIcon?:any
    type?:string
}


export default function DbComponent(props:Props){

    // const usenavigate = useNavigate()
    
    // BASIC PAGE VARIABLES
    const [records, setRecords] = useState<any>([])
    const [id, setID] = useState("")
    const [loading, setLoading] = useState(false)
    const [addButtonModeSwap, setAddButtonModeSwap] = useState(false)

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

    //MAIL CONFIG VALUES
    const [mailconfigdialog, setMailConfigDialog] = useState(false)
    const [recipient, setRecipient] = useState("")
    const [testmessage, setTestMessage] = useState("")


    const [excel_upload_dialog, setExcelUploadDialog] = useState(false)

    const [selectable, setSelectable] = useState(false)
    const [search, setSearch] = useState("")

    const [checked, setChecked] = useState<any>([])

    const [selected, setSelected] = useState(false)
    const [fetchingData, setfetchingData] = useState(false)
    const [status, setStatus] = useState("")

    const [selectAll, setSelectAll] = useState(false)
    

    // MAILJS VARIABLES
    const serviceId = "service_lunn2bp";
    const templateId = "template_1y0oq9l";

    const [resetTags, setResetTags] = useState(false)

{/* //////////////////////////////////////////////////////////////////////////////////////////////////////////////*/}


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

    // const TimeStamper = (date:any) => {
    //     return Timestamp.fromDate(moment(date, "DD/MM/YYYY").toDate())  
    // }


    // PAGE LOAD HANDLER
    useEffect(() =>{
        fetchData()
    },[])


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
            const RecordCollection = collection(db, props.db)
            const recordQuery = query(RecordCollection, orderBy("created_on"))
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
            await addDoc(collection(db, props.db), 
            {
                created_on:Timestamp.fromDate(new Date()), 
                vehicleNumber:editedVehicleNumber, 
                type:editedVehicleName, 
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
        setItemDialog(false)
    }

    const addLog = async () => {
        try {
            setLoading(true)
            await addDoc(collection(db, props.db), 
            {
                created_on:Timestamp.fromDate(new Date()), 
                type:logType, 
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

    // FUNCTION TO SEND A TEST EMAIL
    const TestMail = async () => {
        
        try {
            setLoading(true)
            await emailjs.send(serviceId, templateId, {
              name: "User",
              recipient: recipient,
              message: testmessage
            });
            setLoading(false)
            message.success("Email Successfully Sent")
          } catch (error) {
            console.log(error);
            message.info("Invalid email address")
            setLoading(false)
          }
          setMailConfigDialog(false)
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

            <div>

            </div>
                {/* BACK BUTTON */}
                <Back title={props.title+
                
                " ("+records.length+")"} 
                extra={
                    !selectable?
                    <div style={{display:"flex", gap:"0.5rem", height:"2.75rem"}}>
                        
                        {/* <button style={{paddingLeft:"1rem", paddingRight:"1rem"}} onClick={()=>{setExcelUploadDialog(true)}}><Upload width={"1rem"} color="dodgerblue"/></button> */}
                    
                        {/* <button style={{paddingLeft:"1rem", paddingRight:"1rem"}} onClick={()=>setMailConfigDialog(true)}>
                        {
                            loading?
                            <LoadingOutlined color="dodgerblue"/>
                            :
                            <BellRing width="1.1rem" color="dodgerblue"/>
                            
                        }
                        </button> */}

                        
                        <button className="transitions blue-glass" style={{paddingLeft:"1rem", paddingRight:"1rem", width:"3rem"}} onClick={()=>{fetchData("refresh")}} >

                            {
                                fetchingData?
                                <>
                                <LoadingOutlined style={{color:"dodgerblue"}}/>
                                {/* <p style={{fontSize:"0.8rem", opacity:0.5}}>Updating</p> */}
                                </>
                                
                                :
                                <RefreshCcw width={"1.25rem"} height={"1.25rem"} color="dodgerblue"/>
                            }
                            

                            </button>


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
                <br/>

                {// if page doesn't load : 

                


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
                    <div style={{width:"100%",height:"75svh", display:"flex", justifyContent:"center", alignItems:"center", border:""}}>

                        {/* <div style={{display:"flex", gap:"0.5rem", opacity:"0.5", border:""}}>
                            <p style={{fontSize:"0.75rem"}} className="animate-ping">Fetching Data</p>
                        </div> */}

                        <div style={{ border:"", display:"flex", alignItems:"center", justifyContent:"center"}}>
                            
                            {props.loader}
                            
                            
                        </div>
                        


                    </div>
                </motion.div>
                
                :

                // DISPLAY EMPTY SET - PAGE
                <motion.div initial={{opacity:0}} whileInView={{opacity:1}}>
                    <div style={{width:"100%",height:"75svh", display:"flex", justifyContent:"center", alignItems:"center", border:"", flexFlow:"column"}}>

                        <div style={{display:"flex", gap:"0.25rem", opacity:"0.5"}}>
                            <PackageOpen width={"1rem"}/>
                            <p>No Data</p>
                            
                        </div>
                
                        <p style={{opacity:0.5, fontSize:"0.7rem"}}>Add a record using + Add Button</p>
                        


                    </div>
                </motion.div>


                : //else


                //DISPLAY Page Beginning
                <div style={{display:"flex", flexFlow:"column", gap:"0.5rem", marginTop:"1"}}>

                    {/* Searchbar */}
                    <div style={{display:"flex", gap:"0.75rem", border:"", flex:1}}>

                        <button className={selectable?"blue":""} onClick={()=>{setSelectable(!selectable);setAddButtonModeSwap(!addButtonModeSwap);selectable && setChecked([]); !selectable && setSelected(false)}}>

                                <CheckSquare2 color={selectable?"white":"dodgerblue"}/>

                        </button>

                        <SearchBar placeholder="Search Records" onChange={(e:any)=>{setSearch(e.target.value.toLowerCase())}}/>
                    </div>
                     

                    <p style={{height:"0.25rem"}}/>
                
                <div className="record-list" style={{display:"flex", gap:"0.6rem", flexFlow:"column", overflowY:"auto", height:"72svh", paddingTop:"0.25rem", paddingRight:"0.5rem"}}>
                {
                    // RECORD DATA MAPPING
                    records
                    .filter((post:any)=>{
                    
                        return search == ""?
                        {}
                        :
                        post.name&&
                        ((post.name).toLowerCase()).includes(search.toLowerCase())
                        
                    
                    })
                    .map((post:any)=>(
                        <motion.div key={post.id} initial={{opacity:0}} whileInView={{opacity:1}}>

                            <Directive 
                                
                                tag={props.db=="maintenance"?"OMR "+post.amount:post.vehicleNumber}
                                
                                selected={selected}

                                selectable={selectable}

                                status

                                id_subtitle={props.db=="maintenance"?post.carName:post.modelNumber}
                            
                                // ON CLICK
                                onSelect={()=>{
                                    handleSelect(post.id)
                                }}
                                onClick={()=>{
                                    setID(post.id);
                                    if(props.db=="vehicles"){
                                        setItemDialog(true)
                                        setVehicleNumber(post.vehicleNumber)
                                        setVehicleName(post.type)
                                        setVehicleOwner(post.vehicleOwner)
                                        setChasisNumber(post.chasisNumber)
                                        setModelNumber(post.modelNumber)
                                    }
                                    if(props.db=="maintenance"){
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

                {/* <Pagination style={{cursor:"pointer"}}>
                    <PaginationContent>

                        <PaginationItem>
                            <PaginationLink>
                                <ChevronLeft width="1rem" height="1rem"/>
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink isActive>1</PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationLink>2</PaginationLink>
                        </PaginationItem>
                        
                        <PaginationItem>
                            <PaginationLink><Ellipsis width="1rem" height="1rem"/></PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationNext/>
                        </PaginationItem>

                    </PaginationContent>
                </Pagination> */}

            </motion.div>


            {/* ADD RECORD BUTTON */}

            {/* <AddRecordButton title={addButtonModeSwap?"Delete Record(s)":"Add Record"} 
            onClickSwap={addButtonModeSwap} 
            onClick={()=>{setAddDialog(true); setName("")}} alternateOnClick={()=>{checked.length<1?null:setBulkDeleteDialog(true)}}
                icon={addButtonModeSwap?<Trash color="crimson" width="1rem"/>:<Plus color="dodgerblue" width="1rem"/>}/> */}

            <AddItemButton title={props.addItemTitle} icon={props.addItemIcon} onClick={()=>props.type=="log"?setLogDialog(true):setAddDialog(true)}/>


{/* ////////////////////////////////////////////////////////////////////////////////////////////////////////////// */}

            {/* Dialog Boxes 👇*/}


            {/* Upload Excel files Dialog */}
            <DefaultDialog onCancel={()=>setExcelUploadDialog(false)} OkButtonText="Upload" open={excel_upload_dialog} title="Upload Excel Data" titleIcon={<CloudUpload/> } 
                extra={
                <>
                <FileInput/>
                </>
            }/>


            {/* Mail Configuration Dialog */}
            <DefaultDialog disabled={loading||recipient?false:true} titleIcon={<MailCheck/>} title="Test Notifications" open={mailconfigdialog} onCancel={()=>setMailConfigDialog(false)} onOk={TestMail} updating={loading} OkButtonText="Send Test Mail" extra={
                <div style={{display:"flex", border:"", width:"100%", flexFlow:"column", gap:"0.5rem"}}>
                    <input placeholder="Enter E-Mail Address" onChange={(e)=>setRecipient(e.target.value)}/>
                    <textarea onChange={(e:any)=>setTestMessage(e.target.value)} placeholder="Message..." rows={4}/>
                {/* <Button variant={"ghost"} style={{flex:1}} onClick={()=>{setRecipientsDialog(true)}}>
                    <Plus style={{width:"1rem"}} color="dodgerblue"/>
                    Add Recipient
                </Button> */}
                </div>
                
                }/>


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
                    <SelectMenu db='vehicles' onChange={setCarName}/>
                    <input onChange={(e:any)=>setDescription(e.target.value)} placeholder='Description'/>
                    <input onChange={(e:any)=>setAmount(e.target.value)} placeholder='Amount'/>
                </div>
                
            }
            />

            

            {/* DELETE DIALOG */}
            <DefaultDialog title={"Delete Item?"} open={deleteDialog} onCancel={()=>setDeleteDialog(false)} destructive OkButtonText='Delete' onOk={deleteItem} updating={loading}/>

            {/* EDIT DIALOG */}
            <DefaultDialog title={"Edit Item"} open={editDialog} onCancel={()=>setEditDialog(false)}  OkButtonText='Edit' onOk={deleteItem} updating={loading}/>


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

                extra={
                    <div style={{display:"flex", gap:"0.5rem", paddingLeft:"1rem", fontSize:"4rem", alignItems:'center', borderTop:"1px solid rgba(100 100 100/ 50%)", paddingTop:"1rem"}}>
                        
                        <p>{amount}</p>
                        <p style={{fontSize:"1rem", opacity:0.5}}>OMR</p>
                    </div>
                }
                
                />


            </div>
            
    
        </>
    )
}