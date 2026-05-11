'use client'

import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { uploadMemory } from '../actions/timeline';

export default function MemoryForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const file = formData.get('image') as File;

        if (!file || file.size === 0) {
            setError("Debes seleccionar una imagen.");
            setLoading(false);
            return;
        }

        try {
            // ALGORITMO DE COMPRESIÓN ESTRICTO ANTES DE ENVIAR AL SERVIDOR
            const options = {
                maxSizeMB: 1, // Límite máximo de 1MB
                maxWidthOrHeight: 1920, // Resolución máxima full HD
                useWebWorker: true, // No congela la UI del navegador
            };

            const compressedFile = await imageCompression(file, options);

            // Reemplazamos el archivo original pesado por el comprimido en el FormData
            formData.set('image', compressedFile, compressedFile.name);

            // Enviamos a la Server Action
            const res = await uploadMemory(formData);

            if (!res.success) {
                setError(res.error || "Error al subir la imagen.");
            } else {
                setIsOpen(false);
                // Reseteamos el formulario y forzamos recarga visual
                (e.target as HTMLFormElement).reset();
            }
        } catch (err) {
            console.error(err);
            setError("Error crítico durante la compresión o subida.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {/* Botón Flotante para abrir el modal */}
            <div className="flex justify-center mb-12">
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-emerald-100 text-emerald-800 font-bold font-tierno-sans py-3 px-8 rounded-full shadow-sm border border-emerald-200 hover:bg-emerald-200 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                >
                    + Agregar Recuerdo
                </button>
            </div>

            {/* Modal Oscurecido */}
            {isOpen && (
                <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl border border-stone-100">
                        <h3 className="text-2xl font-storybook-serif font-bold text-emerald-950 mb-4 text-center">Nuevo Recuerdo</h3>

                        {error && <p className="text-red-500 text-sm font-bold bg-red-50 p-3 rounded-lg mb-4 text-center border border-red-100">{error}</p>}

                        <form onSubmit={handleSubmit} className="space-y-4 font-tierno-sans">
                            <div>
                                <label className="block text-sm font-bold text-stone-600 mb-1">Foto</label>
                                <input type="file" name="image" accept="image/*" required className="w-full bg-stone-50 border border-stone-200 p-3 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-600 mb-1">¿Cuándo fue?</label>
                                <input type="date" name="memoryDate" required className="w-full bg-stone-50 border border-stone-200 p-3 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-600 mb-1">¿Quién lo sube?</label>
                                <select name="uploadedBy" required className="w-full bg-stone-50 border border-stone-200 p-3 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-300">
                                    <option value="fran">Fran</option>
                                    <option value="novia">Jooo</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-stone-600 mb-1">Unas palabritas (opcional)</label>
                                <input type="text" name="description" placeholder="Añade un texto lindo..." className="w-full bg-stone-50 border border-stone-200 p-3 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-300" />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-stone-100">
                                <button type="button" onClick={() => setIsOpen(false)} disabled={loading} className="px-5 py-2 text-stone-500 font-bold hover:bg-stone-100 rounded-xl transition">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={loading} className="px-5 py-2 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 shadow-md transition disabled:opacity-50">
                                    {loading ? 'Subiendo...' : 'Guardar Recuerdo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}