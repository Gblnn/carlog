import { LoadingOutlined } from '@ant-design/icons'
import { ConfigProvider, DatePicker, DatePickerProps, message, theme } from 'antd'
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, Timestamp, updateDoc, where } from 'firebase/firestore'
import { motion } from 'framer-motion'
import { CalendarDaysIcon, Car, CarFront, CheckSquare2, ChevronRight, Cog, Database, DownloadCloud, EllipsisVerticalIcon, File, FileDown, FilePlus, Fuel, Globe, PackageOpen, PenLine, Plus, RadioTower, RefreshCcw, Trash, UploadCloud, User, UserCircle, UserCog2, Wrench } from "lucide-react"
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
import ManualSelect from './manual-select'
import SelectMenu from './select-menu'
import moment from 'moment'
import * as XLSX from '@e965/xlsx'
import { saveAs } from 'file-saver'

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
    const [file, setFile] = useState(null)
    const [jsonData, setJsonData] = useState<any>([])
    const [maintenance, setMaintenance] = useState<any>([])
    const [owners, setOwners] = useState<any>([])
    const [id, setID] = useState("")
    const [loading, setLoading] = useState(false)
    const [addButtonModeSwap, setAddButtonModeSwap] = useState(false)
    const [deleteDbDialog, setDeleteDbDialog] = useState(false)
    const [maintenanceDialog, setMaintenanceDialog] = useState(false)
    const [logDate, setLogDate] = useState("")
    const [ownershipDialog, setOwnershipDialog] = useState(false)

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

    const [editedOwnerName, setEditedOwnerName] = useState("")
    const [ownerSummary, setOwnerSummary] = useState(false)
    const [ownerID, setOwnerID] = useState("")
    const [ownerName, setOwnerName] = useState("")

    const [uploadDialog, setUploadDialog] = useState(false)

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
        setRecords([])
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

    const fetchMaintenance = async () => {
        try {
            setLoading(true)
            setMaintenance([])
            
            const RecordCollection = collection(db, "maintenance")
            const recordQuery = query(RecordCollection, orderBy("created_on", "desc"), where("db", "==", props.db), where("carName","==",vehicleName))
            const querySnapshot = await getDocs(recordQuery)
            const fetchedData:any = [];

            querySnapshot.forEach((doc:any)=>{
                fetchedData.push({id: doc.id, ...doc.data()})    
            })        
            setMaintenance(fetchedData)

            // const Record = collection(db, "vehicles")
            // const Query = query(Record, orderBy("created_on", "desc"), where("db", "==", props.db), where("carName","==",vehicleName))
            // const Snapshot = await getDocs(Query)
            // const Data:any = [];

            // Snapshot.forEach((doc:any)=>{
            //     Data.push({id: doc.id, ...doc.data()})    
            // })        
            // setMaintenance(Data)


            setLoading(false)
        } catch (error) {
            setLoading(false)
            message.error(String(error))
            console.log(error)
        }
    }


    const fetchOwners = async () => {
        try {
            setfetchingData(true)
            setOwners([])
            const RecordCollection = collection(db, "owners")
            const recordQuery = query(RecordCollection, orderBy("created_on"), where("db", "==", props.db))
            const querySnapshot = await getDocs(recordQuery)
            const fetchedData:any = [];

            querySnapshot.forEach((doc:any)=>{
                fetchedData.push({id: doc.id, ...doc.data()})    
            })

        
            setOwners(fetchedData)
            setfetchingData(false)
        } catch (error) {
            setfetchingData(false)
            message.error(String(error))
            console.log(error)
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
            setAddItemDialog(false)
            
        } catch (error) {
            message.error(String(error))
            setLoading(false)     
        }
    }

    const deleteItem = async () => {
        setLoading(true)
        await deleteDoc(doc(db, selectedDb, id))
        fetchData()
        setLoading(false)
        setDeleteDialog(false)
        setLogDialog(false)
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
                carNumber:'',
                description:description, 
                amount:amount,
                date:logDate
            })

            setLoading(false)
            fetchData()
            fetchMaintenance()
            setResetTags(!resetTags)
            setLogDialog(false)
            
        } catch (error) {
            message.error(String(error))
            setLoading(false)     
        }
    }

    const addOwner = async () => {
        try {
            setLoading(true)
            await addDoc(collection(db, "owners"),{
                created_on:Timestamp.fromDate(new Date()),
                db:props.db,
                type:editedOwnerName
            })
        
            fetchOwners()
            setLoading(false)
            setEditedOwnerName("")
        } catch (error) {
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

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date)
        setLogDate(String(dateString))
      };

    const deleteOwner = async () => {
        try {
            setLoading(true)
            await deleteDoc(doc(db, "owners", ownerID))
            setLoading(false)
            setOwnerSummary(false)
            fetchOwners()
        } 
        catch (error) {
            setLoading(false)
        }
    }

    const updateOwner = async () => {
        try {
            setLoading(true)
            await updateDoc(doc(db, "vehicles", id),{vehicleOwner:editedVehicleOwner})
            setVehicleOwner(editedVehicleOwner?editedVehicleOwner:vehicleOwner)
            setLoading(false)
            setOwnershipDialog(false)
            fetchData()
        } catch (error) {
            setLoading(false)
        }
    }

    const handleImport = () => {
        if (file) {
          const reader = new FileReader();
          reader.onload = (e:any) => {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: "binary", cellDates:true, dateNF:"DD/MM/YYYY" });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            const string = (JSON.stringify(json, null, 2));
            setJsonData(JSON.parse(string))
          };
          reader.readAsArrayBuffer(file);
        
        }
      };

    
    const uploadJson = () => {
        
            setLoading(true)
            jsonData.forEach((e:any) => {
                
                e.type = props.dbCategory
                e.created_on = new Date()
                e.modified_on = new Date()
                e.notify = true
                e.state = "active"

                e.dateofJoin?
                e.dateofJoin = moment(e.dateofJoin).format("DD/MM/YYYY")
                :{}

                e.civil_expiry?
                e.civil_expiry = Timestamp.fromDate(new Date(e.civil_expiry))
                :{}
                
                e.license_expiry?
                e.license_expiry = Timestamp.fromDate(new Date(e.license_expiry))
                :{}

                e.medical_due_on?
                e.medical_due_on = Timestamp.fromDate(new Date(e.medical_due_on))
                :{}

                e.passportExpiry?
                e.passportExpiry = Timestamp.fromDate(new Date(e.passportExpiry))
                :{}
                
                e.civil_DOB?
                e.civil_DOB = moment(e.civil_DOB).format("DD/MM/YYYY")
                :{}

                e.license_issue?
                e.license_issue = moment(e.license_issue).format("DD/MM/YYYY")
                :{}

                e.medical_completed_on?
                e.medical_completed_on = moment(e.medical_completed_on).format("DD/MM/YYYY")
                :{}

                e.passportIssue?
                e.passportIssue = moment(e.passportIssue).format("DD/MM/YYYY")
                :{}

            


                e.salaryBasic = e.initialSalary
                e.allowance = e.initialAllowance

                e.vt_hse_induction = ""
                e.vt_car_1 = ""
                e.vt_car_2 = ""
                e.vt_car_3 = ""
                e.vt_car_4 = ""
                e.vt_car_5 = ""
                e.vt_car_6 = ""
                e.vt_car_7 = ""
                e.vt_car_8 = ""
                e.vt_car_9 = ""
                e.vt_car_10 = ""

        
            });
            jsonData.forEach(async (e:any) => {
                await addDoc(collection(db, "records"), e)
            });
            
            setLoading(false)
            setUploadDialog(false)
            fetchData()
    }

    const fetchBlank = async () => {
        try {
            setLoading(true)

            const myHeader = ["name","employeeCode","companyName","email","contact","dateofJoin","nativeAddress","nativePhone","initialSalary","initialAllowance","civil_number","civil_DOB", "civil_expiry", "license_number","license_issue", "license_expiry","medical_completed_on" ,"medical_due_on","passportID","passportIssue", "passportExpiry", "vt_hse_induction", "vt_car_1", "vt_car_2", "vt_car_3", "vt_car_4", "vt_car_5", "vt_car_6", "vt_car_7", "vt_car_8", "vt_car_9", "vt_car_10"];

            const Header = ["name","employeeCode","companyName","email","contact","dateofJoin","nativeAddress","nativePhone","initialSalary","initialAllowance","civil_number","civil_DOB", "civil_expiry", "license_number","license_issue", "license_expiry","medical_completed_on" ,"medical_due_on","passportID","passportIssue", "passportExpiry"]

        const worksheet = XLSX.utils.json_to_sheet([{}], {header: props.dbCategory=="personal"?Header: myHeader});
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Buffer to store the generated Excel file
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

        saveAs(blob, "Template.xlsx");
            setLoading(false)
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

                        <DbDropDown trigger={<EllipsisVerticalIcon width={"1rem"}/>} onDeleteDatabase={()=>setDeleteDbDialog(true)} onUpload={()=>setUploadDialog(true)}/>


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

                <button onClick={()=>{setOwnersDialog(true);fetchOwners()}} style={{height:"2rem", borderRadius:"1.25rem", fontSize:"0.8rem", paddingLeft:"1rem", paddingRight:"", display:"flex", alignItems:'center', width:"8.5rem", justifyContent:"space-between", border:""}}>
                    <div style={{display:"flex", alignItems:"center", gap:"0.5rem"}}>
                    <User color='dodgerblue' width={"0.8rem"}/>
                    Owners
                    </div>
                    <ChevronRight style={{width:"0.8rem"}}/>
                    </button>
                    
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
                        <p style={{opacity:0.5, fontSize:"0.7rem"}}>
                            Please check your internet connectivity
                        </p>
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

                                space
                                
                                tag={selectedDb=="maintenance"?post.amount:post.vehicleNumber}
                                
                                selected={selected}

                                selectable={selectable}

                                status

                                id_subtitle={selectedDb=="maintenance"?post.carName:""}
                                subtext={selectedDb=="maintenance"?post.description?post.description:"No Description":""}
                            
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
                                        setLogDate(post.date)
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

            <DefaultDialog open={uploadDialog} created_on={jsonData.length==0?"":""+jsonData.length} title={"Upload"} titleIcon={<UploadCloud color="salmon"/>} codeIcon={<File width={"0.8rem"}/>} code=".xls, .xlsx" OkButtonText="Upload" onCancel={()=>{setUploadDialog(false);setFile(null);setJsonData([])}} disabled={jsonData.length>0?false:true}
            updating={loading}
            onOk={uploadJson}
            title_extra={
                <div style={{display:'flex', flexFlow:"column", gap:"0.5rem"}}>
                    <button onClick={fetchBlank} style={{fontSize:"0.8rem", height:"2rem", paddingLeft:"1rem", paddingRight:"1rem"}}>
                        {
                            <>
                            <FileDown color="lightgreen" width={"1rem"}/>
                            Template
                            </>
                            
                            
                        }
                        
                    </button>
                
                </div>
            
        }
            extra={

                <>

                {
                    jsonData.length==0?
                    <div style={{width:"100%", border:"3px dashed rgba(100 100 100/ 50%)", height:"2.5rem",borderRadius:"0.5rem", marginBottom:"0.5rem"}}></div>
                    :
                    <div className="recipients" style={{width:"100%", display:"flex", flexFlow:"column", gap:"0.35rem", maxHeight:"11.25rem", overflowY:"auto", paddingRight:"0.5rem", minHeight:"2.25rem", marginBottom:"0.5rem"}}>
                        {
                        jsonData.map((e:any)=>(
                            <motion.div key={e.contact} initial={{opacity:0}} whileInView={{opacity:1}}>
                            <Directive status={true} 
                            onClick={()=>{}}
                            title={e.name} titleSize="0.75rem" key={e.id} icon={<UserCircle width={"1.25rem"} color="salmon"/>} />
                            </motion.div>
                        ))
                        }
                    </div>
                }



                <div style={{display:"flex", gap:"0.5rem", width:"100%"}}>
                <input style={{fontSize:"0.8rem"}} type="file" accept=".xls, .xlsx" onChange={(e:any)=>setFile(e.target.files[0])}/>
                <button className={file?"":"disabled"} onClick={()=>{jsonData.length>0?setJsonData([]):handleImport()}} style={{fontSize:"0.8rem", paddingRight:"1rem", paddingLeft:"1rem"}}>{jsonData.length>0?"Clear":"Add"}</button>
                </div>
                </>


                
                
            }/>

            <DefaultDialog open={ownerSummary} onCancel={()=>setOwnerSummary(false)} title={ownerName} OkButtonText='Remove' destructive code={ownerID} onOk={deleteOwner} updating={loading} disabled={loading}/>


            {/* MAINTENANCE DIALOG */}
            <DefaultDialog close  code={vehicleNumber} title={"Maintenance"} open={maintenanceDialog} onCancel={()=>setMaintenanceDialog(false)}
            title_extra={

                <div style={{display:"flex", gap:"0.5rem", border:"", height:"2.5rem"}}>
                    
                    <button style={{paddingLeft:"0.75rem", paddingRight:"0.75rem"}}><DownloadCloud color='lightgreen' width={"1.25rem"}/></button>

                    <button onClick={()=>setLogDialog(true)} style={{paddingLeft:"0.75rem", paddingRight:"0.75rem"}}><Plus color='dodgerblue' width={"1.25rem"}/></button>

                    <button className='blue-glass' onClick={fetchMaintenance} style={{width:"2.75rem", height:""}}>
                    {
                        loading?
                        <LoadingOutlined/>
                        :
                        <RefreshCcw width={"1rem"} color='dodgerblue'/>
                    }
                    
                    </button>
                </div>
                
            }
            extra={
                maintenance.length==0?
                    <div style={{width:"100%", border:"3px dashed rgba(100 100 100/ 50%)", height:"3.35rem",borderRadius:"0.5rem", marginBottom:""}}></div>
                    :
                    <div className="recipients" style={{width:"100%", display:"flex", flexFlow:"column", gap:"0.35rem", maxHeight:"11.25rem", overflowY:"auto", paddingRight:"0.5rem", minHeight:"2.25rem", marginBottom:""}}>
                    {
                        maintenance.map((e:any)=>(
                            <Directive id_subtitle={e.description?e.description:"No Description"} subtext={e.date} key={e.id} title={e.type} tag={e.amount} status
                            icon={
                                e.type=="fuel"?
                                <Fuel width={"1.1rem"} color='goldenrod'/>
                                :
                                e.type=="service"?
                                <Wrench width={"1.1rem"} color='dodgerblue'/>
                                :
                                e.type=="parts"?
                                <Cog width={"1.1rem"} color='violet'/>
                                :
                                e.type=="other"&&
                                <Globe width={"1.1rem"} color='grey'/>
                            }
                            />
                        ))
                    }
                    </div>
                    
                
            }
                />



            <DefaultDialog close titleIcon={<UserCircle color='dodgerblue'/>} title={"Owners"} open={ownersDialog} onCancel={()=>setOwnersDialog(false)}
            code={props.db}
            codeIcon={<Database width={"0.8rem"} color='dodgerblue'/>}
            title_extra={
                <button onClick={fetchOwners} style={{width:"2.75rem", height:"2.5rem"}}>
                    {
                        fetchingData?
                        <LoadingOutlined/>
                        :
                        <RefreshCcw width={"1rem"} color='dodgerblue'/>
                    }
                    
                </button>
            }
            extra={
                <>
                {
                owners.length==0?
                    <div style={{width:"100%", border:"3px dashed rgba(100 100 100/ 50%)", height:"2.5rem",borderRadius:"0.5rem", marginBottom:""}}></div>
                    :
                    <div className="recipients" style={{width:"100%", display:"flex", flexFlow:"column", gap:"0.35rem", maxHeight:"11.25rem", overflowY:"auto", paddingRight:"0.5rem", minHeight:"2.25rem", marginBottom:""}}>
                    {
                        owners.map((e:any)=>(
                            <Directive onClick={()=>{setOwnerID(e.id);setOwnerSummary(true);setOwnerName(e.type)}} key={e.id} title={e.type} status
                            icon={
                                <User color='dodgerblue' width={"1rem"}/>
                            }
                            />
                        ))
                    }
                    </div>
            }
            <div style={{display:"flex", gap:"0.5rem", borderTop:"1px solid rgba(100 100 100/ 50%)", marginTop:"1rem", paddingTop:"0.75rem"}}>
                <input value={editedOwnerName} placeholder='Owner Name' onChange={(e:any)=>setEditedOwnerName(e.target.value)}/>
                <button onClick={addOwner} style={{width:"6rem"}}>
                    {
                        loading?
                        <LoadingOutlined/>
                        :
                        "Add"
                    }
                    
                </button>
            </div>
                </>
                
                    
                
            }
                />

            <DefaultDialog close titleIcon={<FilePlus/>} open={addItemDialog} title={"Add Item"} onCancel={()=>setAddItemDialog(false)}
            extra={
                <div style={{display:"flex", flexFlow:"column", gap:"0.5rem"}}>
                    
                    <Directive onClick={()=>setAddDialog(true)} icon={<Car width={"1rem"} color='violet'/>} title='Add Vehicle'/>
                    <Directive onClick={()=>{setLogDialog(true)}} icon={<Wrench width={"1rem"} color='dodgerblue'/>} title='Add Maintenance'/>
                </div>
            }
            />

            <DefaultDialog open={deleteDbDialog} destructive onCancel={()=>setDeleteDbDialog(false)} title={"Delete Database?"} extra={<p style={{textAlign:"left", fontSize:"0.8rem", opacity:0.5, marginBottom:"0", margin:"1rem", marginTop:"0", border:''}}>This will irrecoverably delete all data within this database, please proceed with caution</p>} OkButtonText='Delete' onOk={deleteDatabase} updating={loading} disabled={loading}/>


            {/* ADD ITEM DIALOG */}
            <AddItemDialog 
            updating={loading}
            disabled={loading}
            VehicleNumberOnChange={(e:any)=>setEditedVehicleNumber(e.target.value)}
            VehicleNameOnChange={(e:any)=>setEditedVehicleName(e.target.value)}
            VehicleOwnerOnChange={(e:any)=>setEditedVehicleOwner(e.target.value)}
            ChasisNumberOnChange={(e:any)=>setEditedChasisNumber(e.target.value)}
            ModelNumberOnChange={(e:any)=>setEditedModelNumber(e.target.value)}
            onOK={addItem}
            
            />

            <DefaultDialog open={addDialog} title={"Add Vehicle"} titleIcon={<Car/>} onCancel={()=>setAddDialog(false)}
            OkButtonText='Add'
            extra={
                <div style={{display:"flex", flexFlow:"column", gap:"0.5rem"}}>
                    <input placeholder='Vehicle Number'/>
                    <input placeholder='Vehicle Name'/>
                    <input placeholder='Chasis Number'/>
                    <input placeholder='Model Number'/>
                    <SelectMenu placeholder='Select Owner' db='owners' selectedDb={props.db} onChange={setVehicleOwner}/>
                </div>
            }
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

                    <Directive icon={<User width={"1.1rem"} color='dodgerblue'/>} title='Owner' tag={vehicleOwner} status onClick={()=>{setOwnershipDialog(true)}}/>
                    <Directive icon={<CalendarDaysIcon width={"1.1rem"} color='dodgerblue'/>} title='Model Number' tag={modelNumber} status noArrow/>
                    <Directive icon={<CarFront width={"1.1rem"} color='dodgerblue'/>} title='Chasis Number' tag={chasisNumber} status noArrow/>

                    <div style={{paddingTop:"0.75rem", borderTop:"1px solid rgba(100 100 100/ 50%)", marginTop:"0.5rem"}}>
                    <Directive onClick={()=>{setMaintenanceDialog(true);fetchMaintenance()}} title='Maintenance' icon={<Wrench color='dodgerblue' width={"1rem"}/>}/>
                    </div>
                    
                </div>
            } 
            />

            <DefaultDialog updating={loading} disabled={loading} created_on={vehicleOwner} titleIcon={<UserCog2 color='dodgerblue'/>} open={ownershipDialog} title={"Owner"} onCancel={()=>setOwnershipDialog(false)} OkButtonText='Update'
            extra={
                <SelectMenu onChange={setEditedVehicleOwner} db='owners' placeholder='Select New Owner' selectedDb={props.db}/>
            }
            onOk={updateOwner}
            />

            {/* ADD ITEM DIALOG */}
            <DefaultDialog code={props.db} codeIcon={<Database width={"0.8rem"} color='violet'/>} created_on={logType} open={logDialog} onCancel={()=>{setLogDialog(false);setLogType("");setResetTags(!resetTags)}} title={"Add Log"} titleIcon={<FilePlus/>}
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
                    
                    <input onChange={(e:any)=>setAmount(e.target.value)} placeholder='Amount'/>
                    <input onChange={(e:any)=>setDescription(e.target.value)} placeholder='Description'/>
                    <ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>
                    <DatePicker placement='topLeft' size='large' variant='outlined' onChange={onChange} format={"DD/MM/YYYY"} style={{height:"2.5rem", fontSize:"1rem", background:"none"}}/>
                    </ConfigProvider>
                    {/* <DateSelect onChange={(e:any)=>console.log(e.target.value)}/> */}
                    
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


            <DefaultDialog code={props.db} codeIcon={<Database width={"0.8rem"} color='dodgerblue'/>} close title={logType} open={logDisplayDialog} onCancel={()=>setLogDisplayDialog(false)}
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
                    
                    <div style={{display:"flex", gap:"0.25rem", paddingLeft:"1rem", fontSize:"4rem", alignItems:'center', borderTop:"1px solid rgba(100 100 100/ 50%)", paddingTop:"1rem", flexFlow:"column", marginBottom:"1rem"}}>
                        
                        <div style={{margin:"1rem"}}>
                        <p style={{fontSize:"1rem", opacity:0.5, border:"", height:"1.5rem"}}>OMR</p>
                        <p style={{border:'', height:"3.5rem", display:"flex", alignItems:"center"}}>{amount}</p>
                        </div>
                        
                        
                        
                    </div>
                    <div style={{display:"flex", flexFlow:"column", gap:"0.5rem"}}>
                        <Directive icon={<CarFront color='dodgerblue' width={"1.1rem"}/>} title={carName}/>
                        <Directive icon={<File color='dodgerblue' width={"1.1rem"}/>} title={description?description:"No Description"}  status/>
                        <Directive icon={<CalendarDaysIcon color='dodgerblue' width={"1.1rem"}/>} title={"Date"} tag={logDate} status/>
                    </div>
                    </>
                }
                />
            </div>
        </>
    )
}