export type TracingLevel = {
    id: string;
    world: string; // Ej: 'Estudio de Trazos'
    name: string; // Ej: 'Vocal A'
    target: string; // La letra gigante a trazar
    guideColor: string; // Color de la sombra de fondo
};

export const TRACING_LEVELS: TracingLevel[] = [
    {
        id: 'trace-a',
        world: 'Estudio de Trazos',
        name: 'Traza la A',
        target: 'A',
        guideColor: 'text-gray-200'
    },
    {
        id: 'trace-a-min',
        world: 'Estudio de Trazos',
        name: 'Traza la a',
        target: 'a',
        guideColor: 'text-gray-200'
    },
    {
        id: 'trace-e',
        world: 'Estudio de Trazos',
        name: 'Traza la E',
        target: 'E',
        guideColor: 'text-gray-200'
    },
    {
        id: 'trace-e-min',
        world: 'Estudio de Trazos',
        name: 'Traza la e',
        target: 'e',
        guideColor: 'text-gray-200'
    },
    {
        id: 'trace-i',
        world: 'Estudio de Trazos',
        name: 'Traza la I',
        target: 'I',
        guideColor: 'text-gray-200'
    },
    {
        id: 'trace-i-min',
        world: 'Estudio de Trazos',
        name: 'Traza la i',
        target: 'i',
        guideColor: 'text-gray-200'
    },
    {
        id: 'trace-o',
        world: 'Estudio de Trazos',
        name: 'Traza la O',
        target: 'O',
        guideColor: 'text-gray-200'
    },
    {
        id: 'trace-o-min',
        world: 'Estudio de Trazos',
        name: 'Traza la o',
        target: 'o',
        guideColor: 'text-gray-200'
    },
    {
        id: 'trace-u',
        world: 'Estudio de Trazos',
        name: 'Traza la U',
        target: 'U',
        guideColor: 'text-gray-200'
    },
    {
        id: 'trace-u-min',
        world: 'Estudio de Trazos',
        name: 'Traza la u',
        target: 'u',
        guideColor: 'text-gray-200'
    },
    {
        id: 'trace-m',
        world: 'Estudio de Trazos',
        name: 'Traza la M',
        target: 'M',
        guideColor: 'text-blue-100'
    },
    {
        id: 'trace-m-min',
        world: 'Estudio de Trazos',
        name: 'Traza la m',
        target: 'm',
        guideColor: 'text-blue-100'
    },
    {
        id: 'trace-p',
        world: 'Estudio de Trazos',
        name: 'Traza la P',
        target: 'P',
        guideColor: 'text-green-100'
    },
    {
        id: 'trace-p-min',
        world: 'Estudio de Trazos',
        name: 'Traza la p',
        target: 'p',
        guideColor: 'text-green-100'
    }
];
