import type { NextRequest, NextResponse } from 'next/server'
import { authenticated } from './libs/server/auth'


const isLoginRoute = (pathname: string) => {
  return pathname.startsWith('/api/login');
}


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  console.log(`middleware: ${request.url}`)
  if (isLoginRoute(request.nextUrl.pathname)) {
    return
  }

  const auth_str = request.headers.get('authorization')
  if (auth_str == null) {
    request.headers.set('x-user', 'null')
    return
  }

  // const user = await authenticated(request)
  // if (user) {
  //   request.headers.set('x-user', user.id)
  //   return
  // }
  // else {
  //   request.headers.set('x-user', 'null')
  //   return
  // }

}


// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/api/:path*']
}
