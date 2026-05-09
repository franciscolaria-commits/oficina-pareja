import CalendarWrapper from '../components/CalendarWrapper';
import { getEvents } from '../actions/calendar';
import { holidays2026 } from '../../lib/holidays';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const res = await getEvents();
    const dbEvents = res.success && res.data ? res.data : [];

    // FILTRO ESTRICTO PARA NOVIA
    const mappedEvents = dbEvents
        .filter(ev => ev.owner === 'novia' || ev.owner === 'compartido')
        .map(ev => ({
            id: ev.id,
            title: ev.title,
            owner: ev.owner,
            start: ev.startTime,
            end: ev.endTime,
            description: ev.description,
        }));

    const formattedHolidays = holidays2026.map((h, index) => {
        const [year, month, day] = h.date.split('-');
        return {
            id: 9000 + index,
            title: h.title,
            owner: 'feriado',
            start: new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 0, 0, 0),
            end: new Date(parseInt(year), parseInt(month) - 1, parseInt(day), 23, 59, 59),
            allDay: true
        };
    });

    const allEvents = [...mappedEvents, ...formattedHolidays];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Vista Jooo</h1>
            <CalendarWrapper events={allEvents} />
        </div>
    );
}