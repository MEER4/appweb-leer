export type TracingLevel = {
    id: string;
    world: string; // Ej: 'Estudio de Trazos'
    name: string; // Ej: 'Vocal A'
    target: string; // La letra gigante a trazar
    guideColor: string; // Color de la sombra de fondo
};

export const TRACING_LEVELS: TracingLevel[] = [
    // --- VOCALES ---
    { id: 'trace-a', world: 'Estudio de Trazos', name: 'Traza la A', target: 'A', guideColor: 'text-gray-200' },
    { id: 'trace-a-min', world: 'Estudio de Trazos', name: 'Traza la a', target: 'a', guideColor: 'text-gray-200' },
    { id: 'trace-e', world: 'Estudio de Trazos', name: 'Traza la E', target: 'E', guideColor: 'text-gray-200' },
    { id: 'trace-e-min', world: 'Estudio de Trazos', name: 'Traza la e', target: 'e', guideColor: 'text-gray-200' },
    { id: 'trace-i', world: 'Estudio de Trazos', name: 'Traza la I', target: 'I', guideColor: 'text-gray-200' },
    { id: 'trace-i-min', world: 'Estudio de Trazos', name: 'Traza la i', target: 'i', guideColor: 'text-gray-200' },
    { id: 'trace-o', world: 'Estudio de Trazos', name: 'Traza la O', target: 'O', guideColor: 'text-gray-200' },
    { id: 'trace-o-min', world: 'Estudio de Trazos', name: 'Traza la o', target: 'o', guideColor: 'text-gray-200' },
    { id: 'trace-u', world: 'Estudio de Trazos', name: 'Traza la U', target: 'U', guideColor: 'text-gray-200' },
    { id: 'trace-u-min', world: 'Estudio de Trazos', name: 'Traza la u', target: 'u', guideColor: 'text-gray-200' },

    // --- CONSONANTES ---
    { id: 'trace-b', world: 'Estudio de Trazos', name: 'Traza la B', target: 'B', guideColor: 'text-red-100' },
    { id: 'trace-b-min', world: 'Estudio de Trazos', name: 'Traza la b', target: 'b', guideColor: 'text-red-100' },
    { id: 'trace-c', world: 'Estudio de Trazos', name: 'Traza la C', target: 'C', guideColor: 'text-blue-100' },
    { id: 'trace-c-min', world: 'Estudio de Trazos', name: 'Traza la c', target: 'c', guideColor: 'text-blue-100' },
    { id: 'trace-d', world: 'Estudio de Trazos', name: 'Traza la D', target: 'D', guideColor: 'text-green-100' },
    { id: 'trace-d-min', world: 'Estudio de Trazos', name: 'Traza la d', target: 'd', guideColor: 'text-green-100' },
    { id: 'trace-f', world: 'Estudio de Trazos', name: 'Traza la F', target: 'F', guideColor: 'text-yellow-100' },
    { id: 'trace-f-min', world: 'Estudio de Trazos', name: 'Traza la f', target: 'f', guideColor: 'text-yellow-100' },
    { id: 'trace-g', world: 'Estudio de Trazos', name: 'Traza la G', target: 'G', guideColor: 'text-purple-100' },
    { id: 'trace-g-min', world: 'Estudio de Trazos', name: 'Traza la g', target: 'g', guideColor: 'text-purple-100' },
    { id: 'trace-h', world: 'Estudio de Trazos', name: 'Traza la H', target: 'H', guideColor: 'text-pink-100' },
    { id: 'trace-h-min', world: 'Estudio de Trazos', name: 'Traza la h', target: 'h', guideColor: 'text-pink-100' },
    { id: 'trace-j', world: 'Estudio de Trazos', name: 'Traza la J', target: 'J', guideColor: 'text-orange-100' },
    { id: 'trace-j-min', world: 'Estudio de Trazos', name: 'Traza la j', target: 'j', guideColor: 'text-orange-100' },
    { id: 'trace-k', world: 'Estudio de Trazos', name: 'Traza la K', target: 'K', guideColor: 'text-red-100' },
    { id: 'trace-k-min', world: 'Estudio de Trazos', name: 'Traza la k', target: 'k', guideColor: 'text-red-100' },
    { id: 'trace-l', world: 'Estudio de Trazos', name: 'Traza la L', target: 'L', guideColor: 'text-blue-100' },
    { id: 'trace-l-min', world: 'Estudio de Trazos', name: 'Traza la l', target: 'l', guideColor: 'text-blue-100' },
    { id: 'trace-m', world: 'Estudio de Trazos', name: 'Traza la M', target: 'M', guideColor: 'text-green-100' },
    { id: 'trace-m-min', world: 'Estudio de Trazos', name: 'Traza la m', target: 'm', guideColor: 'text-green-100' },
    { id: 'trace-n', world: 'Estudio de Trazos', name: 'Traza la N', target: 'N', guideColor: 'text-yellow-100' },
    { id: 'trace-n-min', world: 'Estudio de Trazos', name: 'Traza la n', target: 'n', guideColor: 'text-yellow-100' },
    { id: 'trace-ny', world: 'Estudio de Trazos', name: 'Traza la Ñ', target: 'Ñ', guideColor: 'text-purple-100' },
    { id: 'trace-ny-min', world: 'Estudio de Trazos', name: 'Traza la ñ', target: 'ñ', guideColor: 'text-purple-100' },
    { id: 'trace-p', world: 'Estudio de Trazos', name: 'Traza la P', target: 'P', guideColor: 'text-pink-100' },
    { id: 'trace-p-min', world: 'Estudio de Trazos', name: 'Traza la p', target: 'p', guideColor: 'text-pink-100' },
    { id: 'trace-q', world: 'Estudio de Trazos', name: 'Traza la Q', target: 'Q', guideColor: 'text-orange-100' },
    { id: 'trace-q-min', world: 'Estudio de Trazos', name: 'Traza la q', target: 'q', guideColor: 'text-orange-100' },
    { id: 'trace-r', world: 'Estudio de Trazos', name: 'Traza la R', target: 'R', guideColor: 'text-red-100' },
    { id: 'trace-r-min', world: 'Estudio de Trazos', name: 'Traza la r', target: 'r', guideColor: 'text-red-100' },
    { id: 'trace-s', world: 'Estudio de Trazos', name: 'Traza la S', target: 'S', guideColor: 'text-blue-100' },
    { id: 'trace-s-min', world: 'Estudio de Trazos', name: 'Traza la s', target: 's', guideColor: 'text-blue-100' },
    { id: 'trace-t', world: 'Estudio de Trazos', name: 'Traza la T', target: 'T', guideColor: 'text-green-100' },
    { id: 'trace-t-min', world: 'Estudio de Trazos', name: 'Traza la t', target: 't', guideColor: 'text-green-100' },
    { id: 'trace-v', world: 'Estudio de Trazos', name: 'Traza la V', target: 'V', guideColor: 'text-yellow-100' },
    { id: 'trace-v-min', world: 'Estudio de Trazos', name: 'Traza la v', target: 'v', guideColor: 'text-yellow-100' },
    { id: 'trace-w', world: 'Estudio de Trazos', name: 'Traza la W', target: 'W', guideColor: 'text-purple-100' },
    { id: 'trace-w-min', world: 'Estudio de Trazos', name: 'Traza la w', target: 'w', guideColor: 'text-purple-100' },
    { id: 'trace-x', world: 'Estudio de Trazos', name: 'Traza la X', target: 'X', guideColor: 'text-pink-100' },
    { id: 'trace-x-min', world: 'Estudio de Trazos', name: 'Traza la x', target: 'x', guideColor: 'text-pink-100' },
    { id: 'trace-y', world: 'Estudio de Trazos', name: 'Traza la Y', target: 'Y', guideColor: 'text-orange-100' },
    { id: 'trace-y-min', world: 'Estudio de Trazos', name: 'Traza la y', target: 'y', guideColor: 'text-orange-100' },
    { id: 'trace-z', world: 'Estudio de Trazos', name: 'Traza la Z', target: 'Z', guideColor: 'text-red-100' },
    { id: 'trace-z-min', world: 'Estudio de Trazos', name: 'Traza la z', target: 'z', guideColor: 'text-red-100' }
];
