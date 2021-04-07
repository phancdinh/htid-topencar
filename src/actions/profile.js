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

export async function fetchUserProfile(ht_id, accessToken, apimAccesstoken) {
    if (!accessToken) {
        return;
    }
    try {
        // const { data: profile } = await axios.get(
        //     `https://app-profile-dev.hungthinhcorp.com.vn/get-basic-info`,
        //     {
        //         headers: {
        //             Authorization: `Bearer ${accessToken}`,
        //         },
        //     },
        // );
        // return profile;
        return {
            ht_id: "1040779300653348",
            gender: "male",
            nationalities: ["VietNam", "USA"],
            dob: "19901031",
            full_name: "Phan Công Định",
            pob: "64/5a",
            hometown: "64/5a ấp hậun, xã Bà Điểm, H.Hoc mon, HCM",
            permanent_address: "64/5a ân, xã Bà Điểm, H.Hoc mon, HCM",
            last_modified_date: "20210202093017",
        };
    } catch (error) {
        console.log(error);
    }
}
