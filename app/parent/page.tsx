'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats, getKids } from '@/lib/actions/dashboard-actions';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { Kid } from '@/types/database.types';

export default function ParentDashboardPage() {
    const [kids, setKids] = useState<Kid[]>([]);
    const [selectedKid, setSelectedKid] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function init() {
            setLoading(true);
            try {
                const k = await getKids();
                setKids(k);
                if (k.length > 0) {
                    setSelectedKid(k[0].id);
                }
            } catch (e) {
                console.error('Error fetching kids', e);
            } finally {
                setLoading(false);
            }
        }
        init();
    }, []);

    useEffect(() => {
        async function fetchStats() {
            if (!selectedKid) return;
            try {
                const data = await getDashboardStats(selectedKid);
                setStats(data);
            } catch (e) {
                console.error('Error fetching stats', e);
            }
        }
        fetchStats();
    }, [selectedKid]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Cargando perfiles...</div>;
    }

    if (kids.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
                <h2 className="text-2xl font-bold text-dark mb-4">¡Bienvenido al Panel!</h2>
                <p className="text-gray-600 mb-6">Aún no has registrado a ningún niño. Por favor regresa al inicio para registrar un perfil.</p>
                <Link
                    href="/play"
                    className="inline-block bg-secondary text-white px-8 py-4 rounded-2xl font-bold lg:hover:scale-105 transition-transform"
                >
                    Volver atrás
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Selector de Niños */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-dark">Perfil Seleccionado</h2>
                    <p className="text-sm text-gray-500">Viendo estadísticas de aprendizaje</p>
                </div>
                <div className="flex gap-2">
                    {kids.map((k) => (
                        <button
                            key={k.id}
                            onClick={() => setSelectedKid(k.id)}
                            className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-2 ${selectedKid === k.id
                                ? 'bg-primary text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <span className="text-xl bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-sm">{k.avatar_url || '🧑'}</span>
                            {k.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tarjetas de Estadísticas Principales */}
            {stats && (
                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <span className="text-4xl mb-2">📚</span>
                            <h3 className="text-gray-500 font-medium text-sm">Lecciones Completadas (7 días)</h3>
                            <p className="text-3xl md:text-4xl font-bold text-dark mt-1">{stats.totalLessons}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <span className="text-4xl mb-2">⏱️</span>
                            <h3 className="text-gray-500 font-medium text-sm">Tiempo Estimado de Uso</h3>
                            <p className="text-3xl md:text-4xl font-bold text-dark mt-1">{stats.totalLessons * 3} <span className="text-lg text-gray-400">min</span></p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <span className="text-4xl mb-2">🏆</span>
                            <h3 className="text-gray-500 font-medium text-sm">Recompensas Obtenidas</h3>
                            <p className="text-3xl md:text-4xl font-bold text-dark mt-1">{stats.totalRewards}</p>
                        </div>
                    </div>

                    {/* Gráfica Recharts */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-dark mb-6">Actividad Reciente</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                                    <Bar dataKey="phonetics" name="Fonética" stackId="a" fill="#3B82F6" maxBarSize={40} />
                                    <Bar dataKey="math" name="Números" stackId="a" fill="#F97316" maxBarSize={40} />
                                    <Bar dataKey="tracing" name="Trazos" stackId="a" fill="#22C55E" maxBarSize={40} />
                                    <Bar dataKey="story" name="Cuentos" stackId="a" fill="#A855F7" maxBarSize={40} />
                                    <Bar dataKey="memory" name="Memoria" stackId="a" fill="#6366F1" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            )}

            {/* Si no hay historial reciente, mostramos algo amigable */}
            {stats && stats.totalLessons === 0 && (
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl shadow-inner text-center">
                    <p className="text-blue-800 font-medium">Aún no hay mucha actividad esta semana. ¡Anima a tu pequeño a jugar y aprender hoy mismo!</p>
                </div>
            )}
        </div>
    );
}
