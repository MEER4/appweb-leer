'use client';

import { useRouter } from 'next/navigation';
import { KidButton } from '@/components/kid-button';
import { playSound } from '@/lib/utils/sound-helper';

export default function Home() {
  const router = useRouter();

  const handlePlayClick = () => {
    playSound('click');
    router.push('/login');
  };

  const handleParentClick = () => {
    playSound('swoosh');
    router.push('/register');
  };

  return (
    <main className="min-h-screen bg-bg-kids flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-10 left-10 text-6xl opacity-50 transform -rotate-12 select-none">☀️</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-50 transform rotate-12 select-none">🎈</div>
      <div className="absolute top-40 right-20 text-5xl opacity-50 transform rotate-45 select-none">☁️</div>

      <div className="z-10 bg-white/40 backdrop-blur-sm p-12 rounded-[3rem] shadow-xl border-4 border-white">
        <h1 className="font-kids text-6xl md:text-8xl text-primary mb-6 drop-shadow-md">
          Leer Jugando
        </h1>
        <p className="font-parent text-xl md:text-2xl text-dark mb-12 max-w-lg mx-auto font-bold bg-white/70 p-4 rounded-2xl">
          ¡La magia de aprender a leer a través de divertidos minijuegos y recompensas!
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <KidButton
            icon="🎮"
            label="¡Empezar a Jugar!"
            onClick={handlePlayClick}
            variant="primary"
          />
          <KidButton
            icon="👨‍👩‍👧‍👦"
            label="Crear Cuenta"
            onClick={handleParentClick}
            variant="success"
          />
        </div>
      </div>

      <p className="fixed bottom-6 text-sm font-parent text-gray-500 bg-white/50 px-4 py-2 rounded-full">
        Diseñado para niños de 3 a 5 años
      </p>
    </main>
  );
}
