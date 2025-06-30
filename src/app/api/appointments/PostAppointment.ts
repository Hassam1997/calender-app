// utils/postAppointmentData.ts
import supabase from '../Supabase';

export const postAppointmentData = async (appointment: any) => {
  const { data, error } = await supabase
    .from('appointments')
    .insert([appointment])
    .select();

  if (error) {
    console.error('Error inserting appointment:', error.message);
    return { error };
  }

  return { data };
};
