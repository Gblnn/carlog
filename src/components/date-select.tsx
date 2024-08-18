"use client"

import { Calendar as CalendarIcon } from "lucide-react"
import moment from 'moment'

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface Props{
  onChange?:any
  value?:any
}

export default function DateSelect(props:Props) {



  const [date, setDate] = useState<Date>()



  return (
    <Popover>
      
      <PopoverTrigger asChild>
        <Button
          variant={"ghost"}
          className={cn(
            " justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {
          date ? moment(date, "PPP").format("DD/MM/YYYY") : <span>Pick a date</span>
          }
          
          
          <input style={{display:"none"}} value={String(moment(date, "PPP").format("DD/MM/YYYY"))} onChange={props.onChange}/>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
