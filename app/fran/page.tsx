import CalendarWrapper from '../components/CalendarWrapper';

export default function Page() {
    // En el Día 2, este array vacío será reemplazado por la consulta a la base de datos
    const mockEvents: any[] = [];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Vista Fran</h1>
            <CalendarWrapper events={mockEvents} />
        </div>
    );
}