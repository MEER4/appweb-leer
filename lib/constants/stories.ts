export type StoryPage = {
    imageIcon: string;
    text: string;
};

export type Story = {
    id: string;
    title: string;
    coverIcon: string;
    pages: StoryPage[];
};

export const ALL_STORIES: Story[] = [
    {
        id: 'osito-valiente',
        title: 'El Osito Valiente',
        coverIcon: '🐻',
        pages: [
            { imageIcon: '🐻', text: 'Había una vez un osito pequeño.' },
            { imageIcon: '🌳', text: 'Vivía en un bosque muy grande.' },
            { imageIcon: '🍯', text: 'Un día quiso buscar miel.' },
            { imageIcon: '🐝', text: 'Se encontró con la abeja reina.' },
            { imageIcon: '🤝', text: 'Se hicieron amigos y compartieron la miel. Fin.' }
        ]
    },
    {
        id: 'perrito-jugueton',
        title: 'El Perrito Juguetón',
        coverIcon: '🐶',
        pages: [
            { imageIcon: '🐶', text: 'Toby era un perrito muy feliz.' },
            { imageIcon: '🎾', text: 'Le encantaba jugar con su pelota roja.' },
            { imageIcon: '💨', text: 'Un día, la pelota rodó muy lejos.' },
            { imageIcon: '🐈', text: 'Un gato gris la encontró.' },
            { imageIcon: '🐾', text: 'Jugaron juntos toda la tarde. Fin.' }
        ]
    },
    {
        id: 'ranita-saltarina',
        title: 'La Ranita Saltarina',
        coverIcon: '🐸',
        pages: [
            { imageIcon: '🐸', text: 'La ranita croaba en el estanque.' },
            { imageIcon: '🌙', text: 'Quería saltar hasta la luna.' },
            { imageIcon: '🪨', text: 'Se subió a una piedra muy alta.' },
            { imageIcon: '🚀', text: 'Saltó tan fuerte que tocó una estrella.' },
            { imageIcon: '✨', text: 'Bajó feliz a dormir al agua. Fin.' }
        ]
    },
    {
        id: 'viaje-camaleon',
        title: 'El Viaje del Camaleón',
        coverIcon: '🦎',
        pages: [
            { imageIcon: '🦎', text: 'El camaleón salió a pasear.' },
            { imageIcon: '🍃', text: 'Se posó en una hoja y se puso verde.' },
            { imageIcon: '🌺', text: 'Tocó una flor y se volvió rosa.' },
            { imageIcon: '🪵', text: 'Subió a un tronco y se pintó café.' },
            { imageIcon: '🌈', text: 'Descubrió que tenía todos los colores. Fin.' }
        ]
    },
    {
        id: 'lechuza-sabia',
        title: 'La Lechuza Sabia',
        coverIcon: '🦉',
        pages: [
            { imageIcon: '🦉', text: 'La lechuza miraba desde el árbol.' },
            { imageIcon: '👓', text: 'Llevaba lentes para leer de noche.' },
            { imageIcon: '🐿️', text: 'Una ardilla perdió su nuez.' },
            { imageIcon: '🔦', text: 'La lechuza alumbró el camino.' },
            { imageIcon: '🌰', text: 'Juntas encontraron la rica nuez. Fin.' }
        ]
    }
];
