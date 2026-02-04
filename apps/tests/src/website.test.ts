import axios from "axios";
import { describe, expect, it } from "bun:test";

const BASE_URL = process.env.BASE_URL || "https://localhost:3001";

describe("Website gets created!", () => {
    it("Website not created, if url is not present!", async () => {
        try {
            await axios.post(`${BASE_URL}/website`, {

            })
            expect(false, "Website create when it shouldn't")
        } catch (e) {

        }
    })

    it("Website not created, if url is not present!", async () => {
        try {
            const response = await axios.post(`${BASE_URL}/website`, {
                url: "https://google.com"
            })
            expect(response.data.id).not.toBeNull()
        } catch (e) {

        }
    })
})