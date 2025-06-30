import supabase from "../Supabase";

export const getAppointmentsData = async () => {
  const [appointmentsRes, patientsRes, categoriesRes] = await Promise.all([
    supabase.from('appointments').select('*'),
    supabase.from('patients').select('*'),
    supabase.from('categories').select('*'),
  ]);

  const appointments = appointmentsRes.data || [];
  const patients = patientsRes.data || [];
  const categories = categoriesRes.data || [];

  if (appointmentsRes.error) {
    console.error('Error fetching appointments:', appointmentsRes.error);
  }
  if (patientsRes.error) {
    console.error('Error fetching patients:', patientsRes.error);
  }
  if (categoriesRes.error) {
    console.error('Error fetching categories:', categoriesRes.error);
  }

  return { appointments, patients, categories };
};
