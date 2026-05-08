import { createEvent, getEvents } from './actions/calendar';

export default async function Home() {
  // 1. Intentamos crear un evento base
  const baseEvent = await createEvent({
    title: "Almuerzo Pareja",
    owner: "compartido",
    startTime: new Date("2026-05-10T13:00:00Z"),
    endTime: new Date("2026-05-10T15:00:00Z")
  });

  // 2. Intentamos crear un evento personal que pise ese horario (debería fallar)
  const overlappingEvent = await createEvent({
    title: "Reunión Fran",
    owner: "fran",
    startTime: new Date("2026-05-10T14:00:00Z"), // Choca con el almuerzo
    endTime: new Date("2026-05-10T16:00:00Z")
  });

  const allEvents = await getEvents();

  return (
    <main className="h-screen bg-gray-900 text-white p-10 space-y-6">
      <h1 className="text-2xl font-bold">Test de Algoritmo de Solapamiento</h1>

      <div className="bg-gray-800 p-4 rounded-md">
        <h2 className="text-xl text-green-400">Intento 1 (Base):</h2>
        <pre>{JSON.stringify(baseEvent, null, 2)}</pre>
      </div>

      <div className="bg-gray-800 p-4 rounded-md">
        <h2 className="text-xl text-red-400">Intento 2 (Solapamiento intencional):</h2>
        <pre>{JSON.stringify(overlappingEvent, null, 2)}</pre>
      </div>

      <div className="bg-gray-800 p-4 rounded-md">
        <h2 className="text-xl text-blue-400">Estado de la Base de Datos:</h2>
        <pre>{JSON.stringify(allEvents.data, null, 2)}</pre>
      </div>
    </main>
  );
}