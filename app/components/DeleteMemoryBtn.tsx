'use client'

import { useState } from 'react';
import { deleteMemory } from '../actions/timeline';

export default function DeleteMemoryBtn({ id }: { id: number }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("¿Estás seguro de que querés borrar este recuerdo?")) return;

        setIsDeleting(true);
        const res = await deleteMemory(id);

        if (!res.success) {
            alert(res.error);
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-3 right-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50 hover:bg-red-600 shadow-md disabled:bg-gray-400"
            title="Borrar recuerdo"
        >
            {isDeleting ? '...' : '✕'}
        </button>
    );
}