'use client'

import { Calendar, dateFnsLocalizer, Event as CalendarEvent } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
    'es': es,
};

// Configuración de date-fns para el calendario
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // La semana empieza el Lunes
    getDay,
    locales,
});

// Tipado de las props que recibirá el componente
interface CalendarWrapperProps {
    events: CalendarEvent[];
}

export default function CalendarWrapper({ events }: CalendarWrapperProps) {
    return (
        <div className="h-[80vh] w-full bg-white text-black p-4 rounded-md shadow-md">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                culture="es"
                messages={{
                    next: "Sig",
                    previous: "Ant",
                    today: "Hoy",
                    month: "Mes",
                    week: "Semana",
                    day: "Día",
                    noEventsInRange: "No hay eventos en este rango.",
                }}
            />
        </div>
    );
}