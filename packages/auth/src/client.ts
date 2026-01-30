import { createAuthClient } from "better-auth/react"

const BASE_URL = process.env.BETTER_AUTH_URL;

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: BASE_URL
})

export const { signIn, signUp, useSession } = createAuthClient()
export { fromNodeHeaders, toNodeHandler } from "better-auth/node";