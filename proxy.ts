import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
    const supabaseResponse = NextResponse.next({ request });

    // Instanciar cliente Supabase para Middleware
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value);
                        supabaseResponse.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // Obtener el usuario actual
    const { data: { user } } = await supabase.auth.getUser();
    const path = request.nextUrl.pathname;

    // Rutas protegidas que requieren sesión activa
    const protectedRoutes = ['/play', '/rewards', '/parent'];
    const isProtected = protectedRoutes.some(route => path.startsWith(route));

    // Si intenta acceder a ruta protegida y no hay usuario -> a login
    if (!user && isProtected) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Redirigir si ya está autenticado e intenta ir a auth
    const authRoutes = ['/login', '/register'];
    if (user && authRoutes.includes(path)) {
        return NextResponse.redirect(new URL('/play', request.url));
    }

    return supabaseResponse;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
