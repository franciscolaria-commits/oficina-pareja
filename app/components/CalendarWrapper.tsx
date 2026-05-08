'use client'

import { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { createEvent, deleteEvent } from '../actions/calendar';

const locales = { 'es': es };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

export interface AppEvent {
    id?: number;
    title: string;
    start: Date;
    end: Date;
    owner: string;
    description?: string | null;
}

interface Props {
    events: AppEvent[];
}

export default function CalendarWrapper({ events }: Props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<AppEvent | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Estados del Formulario
    const [title, setTitle] = useState('');
    const [owner, setOwner] = useState('compartido');

    // Trigger al hacer clic en un bloque vacío
    const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
        setError(null);
        setSelectedEvent(null);
        setSelectedSlot({ start: slotInfo.start, end: slotInfo.end });
        setTitle('');
        setModalOpen(true);
    };

    // Trigger al hacer clic en un evento existente
    const handleSelectEvent = (event: AppEvent) => {
        setError(null);
        setSelectedSlot(null);
        setSelectedEvent(event);
        setModalOpen(true);
    };

    // Envío a la Base de Datos
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSlot) return;

        const res = await createEvent({
            title,
            owner,
            startTime: selectedSlot.start,
            endTime: selectedSlot.end,
        });

        if (!res.success) {
            setError(res.error || 'Error detectado en backend.'); // El error de solapamiento aparecerá aquí
        } else {
            setModalOpen(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedEvent?.id) return;
        const res = await deleteEvent(selectedEvent.id);
        if (!res.success) {
            setError(res.error || 'Error al borrar');
        } else {
            setModalOpen(false);
        }
    };

    return (
        <div className="h-[80vh] w-full bg-white text-black p-4 rounded-md shadow-md relative">
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable // Habilita la selección interactiva
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                culture="es"
                messages={{
                    next: "Sig", previous: "Ant", today: "Hoy", month: "Mes", week: "Semana", day: "Día", noEventsInRange: "Sin eventos.",
                }}
            />

            {/* Modal Flotante (UI Tailwind) */}
            {modalOpen && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 rounded-md">
                    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl w-96">

                        {/* Vista de Creación */}
                        {selectedSlot ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="text-lg font-bold">Nuevo Evento</h3>
                                {error && <p className="text-red-400 text-sm font-bold bg-red-900/30 p-2 rounded">{error}</p>}

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Título</label>
                                    <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-700 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Dueño de la actividad</label>
                                    <select value={owner} onChange={e => setOwner(e.target.value)} className="w-full bg-gray-700 p-2 rounded">
                                        <option value="compartido">Compartido</option>
                                        <option value="fran">Fran</option>
                                        <option value="novia">Novia</option>
                                    </select>
                                </div>

                                <div className="text-xs text-gray-400 border-t border-gray-600 pt-3 mt-3">
                                    <p>Inicio: {selectedSlot.start.toLocaleString()}</p>
                                    <p>Fin: {selectedSlot.end.toLocaleString()}</p>
                                </div>

                                <div className="flex justify-end space-x-2 pt-2">
                                    <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition">Cancelar</button>
                                    <button type="submit" className="px-4 py-2 bg-blue-600 rounded font-bold hover:bg-blue-500 transition">Guardar</button>
                                </div>
                            </form>
                        ) : selectedEvent ? (
                            /* Vista de Detalles / Borrado */
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold border-b border-gray-600 pb-2">Detalle de Actividad</h3>
                                {error && <p className="text-red-400 text-sm font-bold">{error}</p>}
                                <p><strong>Actividad:</strong> {selectedEvent.title}</p>
                                <p><strong>Categoría:</strong> <span className="uppercase text-xs bg-gray-600 px-2 py-1 rounded">{selectedEvent.owner}</span></p>
                                <div className="text-xs text-gray-400 pt-2">
                                    <p>Inicio: {selectedEvent.start.toLocaleString()}</p>
                                    <p>Fin: {selectedEvent.end.toLocaleString()}</p>
                                </div>

                                <div className="flex justify-end space-x-2 pt-4">
                                    <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500 transition">Cerrar</button>
                                    <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 rounded font-bold hover:bg-red-500 transition">Borrar</button>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}