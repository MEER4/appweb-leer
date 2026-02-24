'use client';

import { useState, useEffect } from 'react';
import { getKids } from '@/lib/actions/dashboard-actions';
import { addKid, deleteKid, updateParentPin, parentSignOut } from '@/lib/actions/settings-actions';
import { Kid } from '@/types/database.types';

export default function SettingsPage() {
    const [kids, setKids] = useState<Kid[]>([]);
    const [loading, setLoading] = useState(true);

    // Forms state
    const [newKidName, setNewKidName] = useState('');
    const [newKidAge, setNewKidAge] = useState('');
    const [newPin, setNewPin] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const fetchKids = async () => {
        setLoading(true);
        try {
            const data = await getKids();
            setKids(data);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchKids();
    }, []);

    const handleAddKid = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        const fd = new FormData();
        fd.append('name', newKidName);
        fd.append('age', newKidAge);

        try {
            const res = await addKid(fd);
            if (!res?.success) {
                setErrorMsg(res?.error || 'Error al agregar');
                return;
            }
            setSuccessMsg(`¡${newKidName} agregado correctamente!`);
            setNewKidName('');
            setNewKidAge('');
            fetchKids(); // Refrescar lista
        } catch (err: any) {
            setErrorMsg(err.message || 'Error al agregar (catch)');
        }
    };

    const handleDeleteKid = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de eliminar el perfil de ${name}? Esto borrará todo su progreso.`)) return;

        setErrorMsg('');
        try {
            await deleteKid(id);
            setSuccessMsg('Perfil eliminado');
            fetchKids();
        } catch (err: any) {
            setErrorMsg(err.message || 'Error al eliminar');
        }
    };

    const handleUpdatePin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        if (newPin.length !== 4) {
            setErrorMsg('El PIN debe ser exactamente de 4 números');
            return;
        }

        const fd = new FormData();
        fd.append('pin', newPin);

        try {
            await updateParentPin(fd);
            setSuccessMsg('PIN actualizado correctamente');
            setNewPin('');
        } catch (err: any) {
            setErrorMsg(err.message || 'Error al actualizar PIN');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">

            {/* Mensajes globales rápidos */}
            {errorMsg && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">{errorMsg}</div>}
            {successMsg && <div className="bg-green-50 text-green-600 p-4 rounded-xl border border-green-200">{successMsg}</div>}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Columna Izquierda: Gestión de Perfiles */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-dark">Perfiles de Niños</h2>
                            <p className="text-gray-500 text-sm mt-1">Administra quiénes pueden acceder al portal de juegos.</p>
                        </div>

                        <div className="p-6">
                            {kids.length === 0 ? (
                                <p className="text-gray-400 italic mb-4">No hay perfiles registrados.</p>
                            ) : (
                                <ul className="space-y-3 mb-8">
                                    {kids.map((kid) => (
                                        <li key={kid.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-4">
                                                <span className="text-3xl">{kid.avatar_url || '🧑'}</span>
                                                <div>
                                                    <p className="font-bold text-dark">{kid.name}</p>
                                                    <p className="text-sm text-gray-500">{kid.age} años</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteKid(kid.id, kid.name)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg transition-colors text-sm font-bold"
                                            >
                                                Eliminar
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {/* Formulario Agregar */}
                            <div className="bg-[#F8FAFC] p-6 rounded-xl border border-blue-100">
                                <h3 className="font-bold text-dark mb-4 text-sm uppercase tracking-wider">Agregar Nuevo Perfil</h3>
                                <form onSubmit={handleAddKid} className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-xs text-gray-500 mb-1 font-bold">Nombre</label>
                                        <input
                                            type="text"
                                            value={newKidName}
                                            onChange={(e) => setNewKidName(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                                            placeholder="Ej. Lucas"
                                            required
                                        />
                                    </div>
                                    <div className="w-24">
                                        <label className="block text-xs text-gray-500 mb-1 font-bold">Edad</label>
                                        <input
                                            type="number"
                                            min="2" max="12"
                                            value={newKidAge}
                                            onChange={(e) => setNewKidAge(e.target.value)}
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary outline-none"
                                            placeholder="5"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="bg-primary hover:bg-opacity-90 text-white font-bold py-2 px-6 rounded-xl transition-colors h-[42px]"
                                    >
                                        Guardar
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Seguridad y Sesión */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-dark mb-2">Seguridad</h2>
                        <p className="text-gray-500 text-sm mb-6">Actualiza tu PIN numérico de acceso al área parental.</p>

                        <form onSubmit={handleUpdatePin} className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1 font-bold">Nuevo PIN (4 dígitos)</label>
                                <input
                                    type="password"
                                    maxLength={4}
                                    value={newPin}
                                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))} // Solo num
                                    className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] rounded-xl border border-gray-200 focus:border-primary outline-none font-parent"
                                    placeholder="••••"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={newPin.length !== 4}
                                className="w-full bg-dark text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:bg-gray-800 transition-colors"
                            >
                                Cambiar PIN
                            </button>
                        </form>
                    </div>

                    <div className="bg-red-50 rounded-2xl border border-red-100 p-6">
                        <h2 className="text-xl font-bold text-red-800 mb-2">Sesión</h2>
                        <p className="text-red-600/80 text-sm mb-6">Al cerrar sesión, requerirás volver a introducir tu contraseña (o Magic Link) para entrar.</p>

                        <form action={parentSignOut}>
                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                            >
                                Cerrar Sesión
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
