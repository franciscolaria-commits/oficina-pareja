import CalendarWrapper from '../components/CalendarWrapper';
import Timeline from '../components/Timeline';
import { getEvents } from '../actions/calendar';
import { getMemories } from '../actions/timeline';
import { holidays2026 } from '../../lib/holidays';
import MemoryForm from '../components/MemoryForm';

export const dynamic = 'force-dynamic';

export default async function Page() {
    const [eventsRes, memoriesRes] = await Promise.all([
        getEvents(),
        getMemories()
    ]);

    const dbEvents = eventsRes.success && eventsRes.data ? eventsRes.data : [];
    const memories = memoriesRes.success && memoriesRes.data ? memoriesRes.data : [];

    // FILTRO ESTRICTO PARA COMPARTIDO
    const mappedEvents = dbEvents
        .filter(ev => ev.owner === 'compartido')
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
        // Aumentamos el espacio space-y-24 para dar mucho aire al paisaje ilustrado
        <div className="space-y-24 pb-16 max-w-7xl mx-auto">

            {/* SECCIÓN 1: TIMELINE ILLUSTRADO */}
            {/* SECCIÓN 1: TIMELINE ILLUSTRADO */}
            <section>
                <h1 className="text-4xl font-storybook-serif font-bold mb-12 text-center text-emerald-950">
                    Nuestro Camino Juntos
                </h1>

                {/* NUEVO BOTÓN DE CARGA AQUÍ */}
                <MemoryForm />

                <Timeline memories={memories} />
            </section>
            {/* SECCIÓN 2: CALENDARIO CLARO */}
            <section>
                <h2 className="text-3xl font-storybook-serif font-bold mb-8 text-emerald-950">
                    Actividades Compartidas
                </h2>
                {/* El calendario ahora está enmarcados con sombra suave para que flote sobre la crema */}
                <div className="shadow-lg rounded-xl overflow-hidden bg-white">
                    <CalendarWrapper events={allEvents} />
                </div>
            </section>

        </div>
    );
}   