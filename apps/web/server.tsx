import axios from "axios"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001/api";

export const getDashboardDetails = async() => {
    try {
        const response = await axios.get(`${BACKEND_URL}/website`,{
            withCredentials: true
        })
        return response.data;
    } catch (e) {
        console.error(e)
    }
}

export const addNewWebsite = async(url: string) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/website`,{
            url
        },{
            withCredentials: true
        })
        return response.data;
    } catch (e) {
        console.error(e)
    }
}

export const getWebsiteDetail = async(websiteId: string, timeline: number) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/status?websiteId=${websiteId}&timeline=${timeline}`,{
            withCredentials: true
        })
        return response.data;
    } catch (e) {
        console.error(e)
    }
}