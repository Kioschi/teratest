import { NextResponse } from 'next/server'

export async function middleware(req) {

    let jwt = req.cookies.get('JWT')

    //if cookie don't exist user is redirected to login page
    if(jwt===undefined){
        return NextResponse.redirect(new URL('/', req.url))
    }
    //if cookie exist it's sent to api endpoint which verifies its signature and expire date
    const body = {token: jwt};

    const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/verifyToken`, {
        method: 'post',
        body: JSON.stringify(body),
        headers: {'Content-Type': 'application/json'}
    });
    const data = await response.json();

    if (data.message === 'ok'){

        //check if user has privileges
        const path = req.nextUrl.pathname

        if(data.admin){
            return NextResponse.next()
        }
        if (path==='/dashboard/logout'||path==='/dashboard')
            return NextResponse.next()

        return NextResponse.redirect(new URL('/dashboard/', req.url))
    }
    else{
        return NextResponse.redirect(new URL('/', req.url))
    }

}

// See "Matching Paths" below to learn more
export const config = {
    matcher: '/dashboard/:path*',
}