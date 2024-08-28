import type { H3Event } from 'h3';
import { joinURL } from 'ufo'

export default defineEventHandler(async (event: H3Event) => {
    const beUrl = process.env.BACKEND_URL;

    if (undefined === beUrl) {
        throw new Error();
    }

    // check the path
    const path = event.path.replace(/^\/api\//, '') // /api/users -> users
    const target = joinURL(beUrl, path)

    // proxy it!
    return proxyRequest(event, target)
})
