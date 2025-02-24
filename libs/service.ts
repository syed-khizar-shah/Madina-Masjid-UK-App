import axios from "axios";
import { format } from "date-fns";
import { base_url } from "./base-url";

export const fetchSettings = async () => {
    const response = await axios.get(`${base_url}/settings`);
    return response.data;
};

export const fetchHijriMethods = async () => {
    const response = await axios.get("https://api.aladhan.com/v1/methods");
    return Object.entries(response.data.data).map(([_, method]) => ({
        methodId: String(method.id),
        name: method.name,
    }));
};

// Fetch Hijri date based on selected method
export const fetchHijriDate = async (methodId,adjustment=0) => {
    let date = new Date();
    date.setDate(date.getDate()+adjustment);

    const gregorianDate =format(date,"dd-MM-yyyy"); // Format: YYYY-MM-DD

    const response = await axios.get(`https://api.aladhan.com/v1/gToH/${gregorianDate}`,{
        params:{
            method:methodId,
        }
    });
    const hijriDate = response.data.data.hijri;
    console.log(hijriDate);
    return hijriDate;
};