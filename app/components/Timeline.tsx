import Image from 'next/image';
import { format } from 'date-fns';
import { es } from 'date-fns/locale/es';
import DeleteMemoryBtn from './DeleteMemoryBtn';
export interface Memory {
    id: number;
    imageUrl: string;
    memoryDate: Date;
    description: string | null;
    uploadedBy: string;
}

export default function Timeline({ memories }: { memories: Memory[] }) {
    if (!memories || memories.length === 0) {
        return (
            <div className="bg-white p-8 rounded-2xl text-center border-2 border-dashed border-emerald-200 shadow-sm max-w-lg mx-auto">
                <p className="text-emerald-700 italic font-tierno-sans text-lg">Aún no hay recuerdos en el camino. ¡Agregá el primero!</p>
            </div>
        );
    }

    // MAGIA TÉCNICA: Un SVG convertido en código que dibuja una onda (río) suave 
    // y se repite infinitamente hacia abajo.
    const riverBackground = `url("data:image/svg+xml,%3Csvg width='100' height='400' viewBox='0 0 100 400' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 0 C130 100 130 100 50 200 C-30 300 -30 300 50 400' stroke='%23a7f3d0' stroke-width='6' stroke-linecap='round'/%3E%3C/svg%3E")`;

    return (
        <div className="relative w-full max-w-5xl mx-auto py-10 px-4">
            {/* El Río Curvo Central (Visible en PC) */}
            <div
                className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[100px] hidden md:block opacity-80"
                style={{ backgroundImage: riverBackground, backgroundRepeat: 'repeat-y', backgroundPosition: 'center top' }}
            ></div>

            {/* El Río Curvo Lateral (Visible en Celular para que entren las fotos) */}
            <div
                className="absolute left-[-15px] top-0 bottom-0 w-[100px] md:hidden opacity-80"
                style={{ backgroundImage: riverBackground, backgroundRepeat: 'repeat-y', backgroundPosition: 'left top' }}
            ></div>

            <div className="space-y-16 md:space-y-24">
                {memories.map((memory, index) => {
                    // Lógica de Zigzag: Si el índice es par, va a la izquierda. Si es impar, a la derecha.
                    const isEven = index % 2 === 0;

                    // Efecto de fotos reales: Rotamos un poquito las cartas al azar
                    const rotateClass = isEven ? 'md:rotate-2' : 'md:-rotate-2';

                    return (
                        <div key={memory.id} className={`relative flex items-center justify-between md:justify-normal ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} flex-row`}>

                            {/* El "Puntito" en el camino */}
                            <div className="absolute left-[34px] md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-emerald-300 shadow-md z-10 flex items-center justify-center">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            </div>

                            {/* Espaciador invisible para empujar la foto al lado correcto en PC */}
                            <div className="hidden md:block w-[45%]"></div>

                            {/* Tarjeta tipo POLAROID */}
                            <div className={`w-full md:w-[45%] pl-20 md:pl-0 z-20`}>
                                <div className={`bg-white p-4 pb-12 rounded-2xl shadow-xl border border-stone-200 transform transition-all duration-300 hover:scale-105 hover:rotate-0 hover:z-30 ${rotateClass} group`}>
                                    <DeleteMemoryBtn id={memory.id} />
                                    {/* Fecha Elegante */}
                                    <p className="text-emerald-800 font-storybook-serif font-bold text-center mb-3 uppercase tracking-widest text-sm">
                                        {format(new Date(memory.memoryDate), "MMMM yyyy", { locale: es })}
                                    </p>

                                    {/* Contenedor de la Imagen (Usa aspect-ratio nativo para que no desaparezca nunca más) */}
                                    <div className="relative w-full aspect-[4/3] rounded overflow-hidden bg-stone-100 mb-4 border border-stone-100 shadow-inner">
                                        <Image
                                            src={memory.imageUrl}
                                            alt="Recuerdo"
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, 500px"
                                            priority={index === 0} // Optimización: Carga rápido la primera
                                        />
                                    </div>

                                    {/* Texto de recuerdo manuscrito */}
                                    {memory.description && (
                                        <p className="text-stone-600 font-tierno-sans text-center px-4 italic font-medium text-lg leading-relaxed">
                                            "{memory.description}"
                                        </p>
                                    )}

                                    {/* Firma de quién la subió */}
                                    <div className="absolute bottom-4 right-5">
                                        <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                                            {memory.uploadedBy}
                                        </span>
                                    </div>

                                </div>
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}