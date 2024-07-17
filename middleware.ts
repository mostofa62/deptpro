//"use client";
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'
import { getCookie, hasCookie } from 'cookies-next';

  
// Limit the middleware to paths starting with `/api/`
/*
export const config = {
  matcher: '/api/:function*',
};
*/ 
export function middleware(request: NextRequest) {
    // Call our authentication function to check the request
    const { pathname } = request.nextUrl
  /*
    if (pathname.slice(-9)=='callstart') {
      //console.log('here')
        //return NextResponse.rewrite(new URL('catincd/1introduction_permission', request.url))
        return NextResponse.redirect(new URL('fgdtwo/1introduction_permission', request.url));
    }
        */
    //console.log(pathname)
    /*
    console.log(request.cookies.get('AUTH_DATA')?.value
    )*/
   /*
    const auth_data = request.cookies.get('AUTH_DATA')?.value;

    if(typeof auth_data =='undefined' && pathname!='/'){
      //return NextResponse.redirect('');
      //const url = request.nextUrl.clone()
      //url.pathname = '/'
      //return NextResponse.redirect(url)
      return NextResponse.redirect(new URL('/', request.url));
    }
    */

    /*
    if(hasCookie('token')){
      console.log(getCookie('tokne'))
    }
    */
    
    
    

    //console.log(pathname)
    
}

export const config = {
  matcher: [
    /*'/((?!_next).*)(.+)'*/
    '/((?!api|_next/static|favicon.ico|assets).*)'
  ],
}