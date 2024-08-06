import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export default function Tab(){
    return(
        <Tabs defaultValue="account" className="" style={{width:"100%"}}>
            <TabsList style={{width:"100%"}}>
                <TabsTrigger style={{width:"100%"}} value="account">Vehicles</TabsTrigger>
                <TabsTrigger style={{width:"100%"}} value="password">Maintenance</TabsTrigger>
            </TabsList>
            <TabsContent value="account"></TabsContent>
            <TabsContent value="password"></TabsContent>
        </Tabs>
    )
}

