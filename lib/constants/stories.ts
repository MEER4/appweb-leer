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
            {
                imageIcon: '🐻',
                text: 'Había una vez un osito pequeño.'
            },
            {
                imageIcon: '🌳',
                text: 'Vivía en un bosque muy grande.'
            },
            {
                imageIcon: '🍯',
                text: 'Un día quiso buscar miel.'
            },
            {
                imageIcon: '🐝',
                text: 'Se encontró con la abeja reina.'
            },
            {
                imageIcon: '🤝',
                text: 'Se hicieron amigos y compartieron la miel. Fin.'
            }
        ]
    }
];
