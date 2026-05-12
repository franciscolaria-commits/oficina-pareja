'use server'

import cloudinary from '../../lib/cloudinary';
import { prisma } from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

// LECTURA ORDENADA CRONOLÓGICAMENTE
export async function getMemories() {
    try {
        const memories = await prisma.timelineMemory.findMany({
            orderBy: { memoryDate: 'asc' } // CRÍTICO: Ordenado por la fecha del recuerdo, no la fecha de subida
        });
        return { success: true, data: memories };
    } catch (error) {
        console.error("Error al obtener recuerdos:", error);
        return { success: false, error: 'Fallo al consultar la base de datos del timeline.' };
    }
}

// SUBIDA DE ARCHIVO E INSERCIÓN EN BASE DE DATOS
export async function uploadMemory(formData: FormData) {
    try {
        const file = formData.get('image') as File | null;
        const memoryDateStr = formData.get('memoryDate') as string | null;
        const uploadedBy = formData.get('uploadedBy') as string | null;
        const description = formData.get('description') as string | null;

        if (!file || !memoryDateStr || !uploadedBy) {
            return { success: false, error: 'Faltan campos obligatorios (imagen, fecha o autor).' };
        }

        // 1. Transformar el archivo a Data URI (Base64) para Cloudinary
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString('base64');
        const fileUri = `data:${file.type};base64,${base64Data}`;

        // 2. Subir a Cloudinary en una carpeta específica para mantener orden
        const uploadResponse = await cloudinary.uploader.upload(fileUri, {
            folder: 'oficina_pareja',
        });

        if (!uploadResponse.secure_url) {
            throw new Error("Cloudinary no devolvió una URL segura.");
        }

        // 3. Guardar el registro en Neon.tech
        const newMemory = await prisma.timelineMemory.create({
            data: {
                imageUrl: uploadResponse.secure_url,
                memoryDate: new Date(memoryDateStr),
                description: description || null,
                uploadedBy: uploadedBy,
            }
        });

        // 4. Revalidar la vista compartida
        revalidatePath('/compartido');

        return { success: true, data: newMemory };
    } catch (error) {
        console.error("Error al subir recuerdo:", error);
        return { success: false, error: 'Error interno procesando la imagen o guardando en base de datos.' };
    }
}
export async function deleteMemory(id: number) {
    try {
        await prisma.timelineMemory.delete({
            where: { id },
        });

        // Forzamos la recarga de la página compartida para que desaparezca
        revalidatePath('/compartido');
        return { success: true };
    } catch (error) {
        console.error("Error al borrar el recuerdo:", error);
        return { success: false, error: 'Error interno al borrar.' };
    }
}