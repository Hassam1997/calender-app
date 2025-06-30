class AppointmentUtil {
  id = (data: any) => data?.id ?? ""
  
  title = (data:any) => data?.title ?? ""; 

  start_time = (data: any) => data ? new Date(data?.start).toISOString().slice(0, 16) : ""

  end_time = (data: any) => data ? new Date(data?.end_time).toISOString().slice(0, 16) : ""

  location = (data: any) => data?.location ?? ""

  notes = (data: any) => data?.notes ?? ""

  patient_id = (data: any) => data?.patient ?? ""

  category_id = (data: any) => data?.category ?? ""
}

export default new AppointmentUtil();
