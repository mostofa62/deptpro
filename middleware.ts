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
    

    const url = request.nextUrl.clone();
    const role = getUserRole(request);

    if (role!=null) {
      
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
        if(url.pathname.includes('admins') && role > 1){
          url.pathname = '/admin/dashboard';
          return NextResponse.redirect(url);
        }
        if (role >= 10) {
          url.pathname = '/member/dashboard'; // Redirect to user dashboard
          return NextResponse.redirect(url);
        }
      }
      //console.log('url.pathname',url.pathname.includes('admins'))
  
      // Redirect admin trying to access the user path
      if (url.pathname.startsWith('/member')) {
        if (role < 10) {
          url.pathname = '/admin/dashboard'; // Redirect to admin dashboard
          return NextResponse.redirect(url);
        }
      }
    }else {
      // Handle the case where no role is found
      if (url.pathname.startsWith('/admin') && url.pathname !== '/admin') {
        url.pathname = '/admin'; // Redirect to default admin path
        return NextResponse.redirect(url);
      }
      if (url.pathname.startsWith('/member') && url.pathname !== '/member') {
        url.pathname = '/member'; // Redirect to default member path
        return NextResponse.redirect(url);
      }
      // If the path is '/', redirect to a default page
      if (url.pathname === '/' && url.pathname !== '/'  || url.pathname === '') {
        url.pathname = '/'; // Redirect to member path by default
        return NextResponse.redirect(url);
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