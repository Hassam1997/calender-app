// utils/deleteAppointmentData.ts
import supabase from '../Supabase';

export const deleteAppointmentData = async (appointmentId: number) => {
  const { data, error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', appointmentId)  // Delete the appointment based on its id
    .select();

  if (error) {
    console.error('Error deleting appointment:', error.message);
    return { error };
  }

  return { data };
};
