import { Route, Routes } from "react-router-dom"
import Index from "./pages"
import PageNotFound from "./pages/page-not-found"
import Vehicles from "./pages/vehicles"
import Maintenance from "./pages/maintenance"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Index/>}/>
      <Route path="/vehicles" element={<Vehicles/>}/>
      <Route path="/maintenance" element={<Maintenance/>}/>
      <Route path='*' element={<PageNotFound/>}/>
    </Routes>
  )
}

export default App
