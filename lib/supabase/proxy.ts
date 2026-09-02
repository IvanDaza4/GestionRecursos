import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured } from "./config";
import { demoLoginAvailable } from "@/lib/demo";

/**
 * Refresca la sesión de Supabase en cada request y protege las rutas de
 * la app: sin sesión válida, redirige a /login — salvo que haya una cuenta
 * demo configurada (DEMO_LOGIN_EMAIL/PASSWORD), en cuyo caso loguea con esa
 * cuenta ahí mismo y deja pasar a la ruta pedida (p. ej. /dashboard directo).
 */
export async function updateSession(request: NextRequest) {
  // Sin credenciales de Supabase configuradas, se deja pasar todo para
  // poder previsualizar el sistema de diseño sin un proyecto conectado.
  if (!isSupabaseConfigured) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthRoute = request.nextUrl.pathname.startsWith("/login");
  const isPublicAsset = request.nextUrl.pathname.startsWith("/_next");

  if (!user && !isAuthRoute && !isPublicAsset) {
    if (demoLoginAvailable()) {
      const { error } = await supabase.auth.signInWithPassword({
        email: process.env.DEMO_LOGIN_EMAIL!,
        password: process.env.DEMO_LOGIN_PASSWORD!,
      });
      // Al loguear con éxito, `setAll` ya dejó las cookies de sesión en
      // `response`: seguimos hacia la ruta pedida en vez de redirigir.
      if (!error) return response;
    }

    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}
