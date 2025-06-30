import supabase from '../Supabase';

export const updateAppointmentData = async (appointmentId: number, updatedData: any) => {
  const { data, error } = await supabase
    .from('appointments')
    .update(updatedData)  // updatedData should contain the updated fields
    .eq('id', appointmentId)  // ensure you're updating the correct record
    .select();

  if (error) {
    console.error('Error updating appointment:', error.message);
    return { error };
  }

  return { data };
};
