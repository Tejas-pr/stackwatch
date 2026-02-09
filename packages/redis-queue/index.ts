import { createClient } from "redis";

type Website = {
    url: string;
    id: string;
}

const STREAM_NAME = process.env.STREAM_NAME || "stackwatch:websites";

const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error: ", err))
    .connect();

export const XAddBulk = async (websites: Website[]) => {
    try {
        for (let i = 0; i < websites.length; i++) {
            const site = websites[i];

            if (!site) {
                throw new Error("Invalid website data");
            }

            if (!site.url || !site.id) {
                throw new Error("Invalid website data");
            }

            await XAdd({
                url: site.url,
                id: site.id,
            });
        }
    } catch (e) {
        console.error(e);
    }
};

const XAdd = async ({ url, id }: Website) => {
    try {
        await client.xAdd(STREAM_NAME, "*", {
            url,
            id
        })
    } catch (e) {
        console.error(e);
    }
}
