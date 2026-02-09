import { createClient } from "redis";

type Website = {
    url: string;
    id: string;
}

type MessageType = {
    id: string;
    message: {
        id: string,
        url: string
    }
}

const STREAM_NAME = process.env.STREAM_NAME || "stackwatch:websites";
const COUNT = process.env.COUNT || 5;

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

export const XReadGroup = async (consumer_group: string, worker_id: string): Promise<MessageType[] | undefined> => {
    try {
        const response = await client.xReadGroup(consumer_group, worker_id, {
            key: STREAM_NAME,
            id: '>'
        }, {
            COUNT: Number(COUNT)
        });

        if (!response) {
            return [];
        }

        const messages: MessageType[] = (response as any)[0].messages;
        return messages;
    } catch (e) {
        console.error(e);
    }
}

const XAck = async (consumer_group: string, event_id: string) => {
    try {
        await client.xAck(STREAM_NAME, consumer_group, event_id);
    } catch (e) {
        console.error(e);
    }
}

export const XAckBulk = async (consumer_group: string, event_ids: string[]) => {
    try {
        event_ids.map(event_id => XAck(consumer_group, event_id));
    } catch (e) {
        console.error(e);
    }
}