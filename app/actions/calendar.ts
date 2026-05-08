'use server'

import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

// Tipos para asegurar la estructura de los datos entrantes
type EventInput = {
    title: string;
    owner: string; // 'fran' | 'jooo' | 'compartido'
    startTime: Date;
    endTime: Date;
    description?: string;
};

// ALGORITMO DE SOLAPAMIENTO
async function checkOverlap(startTime: Date, endTime: Date, owner: string, excludeEventId?: number) {
    // Definición de contra quién choca el evento
    const ownerCondition = owner === 'compartido'
        ? {} // Si es compartido, no puede pisarse con nada
        : { owner: { in: [owner, 'compartido'] } }; // Si es personal, no puede pisarse con los propios ni con los compartidos

    const overlap = await prisma.event.findFirst({
        where: {
            AND: [
                { startTime: { lt: endTime } }, // El inicio del evento existente es antes de que termine el nuevo
                { endTime: { gt: startTime } }, // El fin del evento existente es después de que empiece el nuevo
                ownerCondition,
                excludeEventId ? { id: { not: excludeEventId } } : {} // Ignorar el evento actual si estamos actualizando
            ]
        }
    });

    return overlap;
}

// LECTURA
export async function getEvents() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { startTime: 'asc' }
        });
        return { success: true, data: events };
    } catch (error) {
        console.error("Error al obtener eventos:", error);
        return { success: false, error: 'Fallo al consultar la base de datos.' };
    }
}

// CREACIÓN
export async function createEvent(data: EventInput) {
    try {
        const overlap = await checkOverlap(data.startTime, data.endTime, data.owner);

        if (overlap) {
            return { success: false, error: 'Solapamiento detectado. Ya existe una actividad en ese horario.' };
        }

        const newEvent = await prisma.event.create({
            data: {
                ...data,
            }
        });

        // Revalida las rutas para que el calendario se actualice sin recargar la página
        revalidatePath('/compartido');
        revalidatePath('/fran');
        revalidatePath('/jooo');

        return { success: true, data: newEvent };
    } catch (error) {
        console.error("Error al crear evento:", error);
        return { success: false, error: 'Error interno al guardar el evento.' };
    }
}

// ACTUALIZACIÓN
export async function updateEvent(id: number, data: EventInput) {
    try {
        const overlap = await checkOverlap(data.startTime, data.endTime, data.owner, id);

        if (overlap) {
            return { success: false, error: 'Solapamiento detectado al intentar mover el horario.' };
        }

        const updatedEvent = await prisma.event.update({
            where: { id },
            data: {
                ...data,
            }
        });

        revalidatePath('/compartido');
        revalidatePath('/fran');
        revalidatePath('/jooo');

        return { success: true, data: updatedEvent };
    } catch (error) {
        console.error("Error al actualizar evento:", error);
        return { success: false, error: 'Error interno al modificar el evento.' };
    }
}

// BORRADO
export async function deleteEvent(id: number) {
    try {
        await prisma.event.delete({
            where: { id }
        });

        revalidatePath('/compartido');
        revalidatePath('/fran');
        revalidatePath('/jooo');

        return { success: true };
    } catch (error) {
        console.error("Error al borrar evento:", error);
        return { success: false, error: 'Error interno al eliminar el evento.' };
    }
}