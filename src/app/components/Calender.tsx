import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import deLocale from '@fullcalendar/core/locales/de';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faUsers, faMedkit, faRunning } from '@fortawesome/free-solid-svg-icons';

import AppointmentModal from './AppointmentModal';
import AppointmentForm from './Appointmentform';
import { appointmentData } from '../ducks/AppointmentContext';
import { CALENDAR_VIEW } from '../config/Constants';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { AppointmentUtil } from '../datautils';

const Calendar: React.FC = () => {
  const { data } = appointmentData() as any;
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Filter state
  const [filterStart, setFilterStart] = useState<string>('');
  const [filterEnd, setFilterEnd] = useState<string>('');

  // Filtered events to show on calendar
  const [filteredEvents, setFilteredEvents] = useState<any[]>(data?.appointments || []);
  const [filterCategory, setFilterCategory] = useState<string>('');


  useEffect(() => {
    // Reset filtered events if data.appointments changes
    setFilteredEvents(data?.appointments || []);
  }, [data?.appointments]);

  // Handle filtering
  const applyFilter = () => {
    let filtered = data?.appointments || [];

    if (filterStart) {
      filtered = filtered.filter((appt: any) => new Date(appt.start) >= new Date(filterStart));
    }
    if (filterEnd) {
      filtered = filtered.filter((appt: any) => new Date(appt.end_time) <= new Date(filterEnd));
    }
    if (filterCategory) {
      filtered = filtered.filter((appt: any) => appt.category === filterCategory);
    }

    console.log(data?.appointments, "filtered", filterCategory, "dqta", filtered);


    setFilteredEvents(filtered);
    setShowFilterModal(false);
  };


  // Clear filter
  const clearFilter = () => {
    setFilterStart('');
    setFilterEnd('');
    setFilterCategory('');
    setFilteredEvents(data?.appointments || []);
    setShowFilterModal(false);
  };


  const handleEventClick = (appointment: any) => {
    const filtered = data.appointments.find((item: any) => item.id === appointment.id);
    setSelectedAppointment(filtered);
    setShowModal(true);
  }


  const eventRender = (info: any) => {
    const { event } = info;

    const icons: Record<string, JSX.Element> = {
      call: <FontAwesomeIcon icon={faPhone} className="mr-2 text-blue-500" />,
      meeting: <FontAwesomeIcon icon={faUsers} className="mr-2 text-green-600" />,
      checkup: <FontAwesomeIcon icon={faMedkit} className="mr-2 text-red-500" />,
      fitness: <FontAwesomeIcon icon={faRunning} className="mr-2 text-purple-500" />,
    };

    const icon = icons[event.extendedProps.type] || icons['meeting'];
    const eventTime = `${new Date(AppointmentUtil.start_time(event)).toLocaleTimeString()} - ${new Date(AppointmentUtil.end_time(event.extendedProps)).toLocaleTimeString()}`;

    return (
      <div
        className="flex items-center p-2 space-x-2 bg-white rounded-lg cursor-pointer transition-all duration-200 hover:bg-indigo-50 hover:text-gray-700 w-full"
        title={`Time: ${eventTime}`}
        onClick={() => handleEventClick(event)}
        style={{ backgroundColor: 'transparent' }} // Ensures no unwanted gray background
      >
        <div className="w-6 h-6 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex flex-col w-full">
          <p className="text-sm font-semibold">{event.title}</p>
          <p className="text-xs">{eventTime}</p>
        </div>
      </div>
    );
  };


  return (
    <Card className="w-full shadow-xl">
      <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-4">
        <CardTitle className="text-xl">Appointments Calendar</CardTitle>

        <div className="flex gap-2">
          <Popover open={showForm} onOpenChange={setShowForm}>
            <PopoverTrigger asChild>
              <Button variant="default" size="sm">
                {showForm ? 'Close Form' : 'Create New Appointment'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-4" align="end">
              <AppointmentForm
                patients={data?.patients}
                categories={data?.categories}
                onSubmit={() => setShowForm(false)}
              />
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilterModal(true)}
          >
            Filter Appointments
          </Button>
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        <div className="w-full">
          <FullCalendar
            locale={deLocale}
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={CALENDAR_VIEW}
            events={filteredEvents}
            editable={true}
            droppable={true}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,listYear',
            }}
            eventClick={(info) => handleEventClick(info.event)}
            eventContent={eventRender}
            height="auto"
          />
        </div>
      </CardContent>

      {showModal && selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setShowModal(false)}
          patients={data?.patients}
          categories={data?.categories}
        />
      )}

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Appointments</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div>
              <label htmlFor="filterStart" className="block mb-1 font-medium">
                Start Time From
              </label>
              <input
                id="filterStart"
                type="datetime-local"
                className="w-full rounded border border-gray-300 px-3 py-2"
                value={filterStart}
                onChange={(e) => setFilterStart(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filterEnd" className="block mb-1 font-medium">
                Start Time To
              </label>
              <input
                id="filterEnd"
                type="datetime-local"
                className="w-full rounded border border-gray-300 px-3 py-2"
                value={filterEnd}
                min={filterStart}
                onChange={(e) => setFilterEnd(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filterCategory" className="block mb-1 font-medium">
                Category
              </label>
              <select
                id="filterCategory"
                className="w-full rounded border border-gray-300 px-3 py-2"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All</option>
                {data?.categories?.map((cat: any) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={clearFilter}>
                Clear
              </Button>
              <Button onClick={applyFilter}>Filter</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Calendar;