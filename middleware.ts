// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const INTERNAL_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/api/')) {
        const authHeader = request.headers.get('authorization') ?? ''
        const bearerToken = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7)
            : null

        const headerToken = request.headers.get('x-internal-token')
        const token = bearerToken || headerToken
        console.log(headerToken, token)

        if (!INTERNAL_TOKEN || token !== INTERNAL_TOKEN) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            )
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/:path*'],
}