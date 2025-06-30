'use client'

import React, { useContext, createContext, useState, useEffect } from "react";
import { getAppointmentsData } from "../api/appointments/FetchAppointment";


const AppointmentContext = createContext(null)

const DataProvider = ({ children }: { children: any }) => {

    const [data, setData] = useState(null) as any

    useEffect(() => {
        const fetchData = async () => {
            const dataVal = await getAppointmentsData()
            setData(dataVal)
        }
        fetchData()
    }, [])

    return (
        <AppointmentContext.Provider value={{ data, setData } as any}>
            {children}
        </AppointmentContext.Provider>
    )
}

export default DataProvider

export const appointmentData = () => useContext(AppointmentContext)