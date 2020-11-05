import axios from "axios";
import { CONFIG } from "../config";

export async function generateToken() {
    try {
        const token = btoa(`${CONFIG.APIM_ID}:${CONFIG.APIM_SECRET}`);

        const { data } = await axios.post(`${CONFIG.APIM_URL}/token`, "grant_type=client_credentials", {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${token}`,
            },
        });

        return data.access_token;
    } catch (error) {
        console.log("generateToken error", error);
    }
}

export async function fetchUserProfile(accessToken, apimAccesstoken) {
    if (!accessToken || !apimAccesstoken) {
        return;
    }

    try {
        const { data: profile } = await axios.get(`${CONFIG.APIM_URL}/user-profile/1.0.0`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "X-HT-APIM-Authorization": `Bearer ${apimAccesstoken}`,
            },
        });
        return profile;
    } catch (error) {
        console.log(error);
    }
}
