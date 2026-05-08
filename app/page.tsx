import { prisma } from '../lib/prisma';

export default async function Home() {
  const events = await prisma.event.findMany();

  return (
    <main className="h-screen bg-gray-900 text-white p-10">
      <h1 className="text-2xl font-bold mb-4">Test de Conexión DB</h1>
      <div className="bg-gray-800 p-4 rounded-md">
        <pre>{JSON.stringify(events, null, 2)}</pre>
      </div>
    </main>
  );
}