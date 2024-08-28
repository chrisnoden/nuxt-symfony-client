import type { H3Event } from 'h3';

export default defineEventHandler(async (event: H3Event) => {
    const beUrl = process.env.BACKEND_URL;

    return proxyRequest(event, `${beUrl}/security/login`)
})
