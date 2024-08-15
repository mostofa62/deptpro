//"use client";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'
import { getCookie, hasCookie } from 'cookies-next';

const getUserRole = (req:NextRequest) => {
  // Example: Extract role from cookie or session  
  let auth_data:any = req.cookies.get('AUTH_DATA')?.value;
  if(typeof auth_data != 'undefined'){
    auth_data = JSON.parse(auth_data)
    return auth_data["role"];
  }
  else 
   return null;
};

  
// Limit the middleware to paths starting with `/api/`
/*
export const config = {
  matcher: '/api/:function*',
};
*/ 
export function middleware(request: NextRequest) {
    // Call our authentication function to check the request
    const { pathname } = request.nextUrl

    const url = request.nextUrl.clone();
    const role = getUserRole(request);

    if (role) {
      if (url.pathname === '/member' || url.pathname === '/admin' || url.pathname === '/' || url.pathname === '') {
        // Redirect to the appropriate dashboard based on role
        if (role < 10) {
          url.pathname = '/admin/dashboard';
        } else if (role >= 10) {
          url.pathname = '/member/dashboard';
        }
        return NextResponse.redirect(url);
      }
  
      // Redirect user trying to access the admin path
      if (url.pathname.startsWith('/admin')) {
        if (role >= 10) {
          url.pathname = '/member/dashboard'; // Redirect to user dashboard
          return NextResponse.redirect(url);
        }
      }
  
      // Redirect admin trying to access the user path
      if (url.pathname.startsWith('/member')) {
        if (role < 10) {
          url.pathname = '/admin/dashboard'; // Redirect to admin dashboard
          return NextResponse.redirect(url);
        }
      }
    } 

   
    return NextResponse.next();
    
}

export const config = {
  matcher: [
    '/admin/:path*', 
    '/member/:path*',     
    '/',
    /*'/((?!_next).*)(.+)'*/
    '/((?!api|_next/static|favicon.ico|assets).*)'
  ],
}