import { Route, Routes } from "react-router-dom"
import Index from "./pages"
import PageNotFound from "./pages/page-not-found"
import Vehicles from "./pages/database-element"
import Maintenance from "./pages/maintenance"
import Login from "./pages/login"
import { useEffect, useState } from "react"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "./firebase"
import Await from "./components/await"

function App() {

  const [records, setRecords] = useState<any>([])
  const [fetchingData, setfetchingData] = useState(false)
  

  useEffect(()=>{
    fetchData()
  },[])

  //INITIAL DATA FETCH ON PAGE LOAD
  const fetchData = async () => {
        
    try {    
        setfetchingData(true)
        const RecordCollection = collection(db, "databases")
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

  return (
    <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/index" element={<Index/>}/>
      {
        records.map((r:any)=>(
          fetchingData?
          <Route key={r.id} path="/await" element={<Await/>}/>
          :
          <Route key={r.id} path={"/"+String(r.name.toLowerCase())} element={<Vehicles dbID={r.id} db={String(r.name)}/>}/>
        ))
      }
      
      
      <Route path="/maintenance" element={<Maintenance/>}/>
      <Route path='*' element={<PageNotFound/>}/>
    </Routes>
  )
}

export default App
