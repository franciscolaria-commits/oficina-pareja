import CalendarWrapper from '../components/CalendarWrapper';
import { getEvents } from '../actions/calendar';

// Fuerza a Next.js a no cachear la página estáticamente, garantizando datos frescos
export const dynamic = 'force-dynamic';

export default async function Page() {
    const res = await getEvents();
    const dbEvents = res.success && res.data ? res.data : [];

    // Transformación del modelo Prisma al formato exigido por react-big-calendar
    const mappedEvents = dbEvents.map(ev => ({
        id: ev.id,
        title: ev.title,
        owner: ev.owner,
        start: ev.startTime,
        end: ev.endTime,
        description: ev.description,
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Vista Compartida</h1>
            {/* Pasamos los eventos reales al componente cliente */}
            <CalendarWrapper events={mappedEvents} />
        </div>
    );
}