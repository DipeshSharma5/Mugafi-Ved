import axios from "axios";

export default async function vedApiCall(data: any) {
    const res = await axios.post('https://gpt-mj-bridge.mugafi.com/api/tools/ved/story', {prompts: data}, {
        headers: {
            Authorization: 'hiouegiyeriugerhiowehioekber'
        }
    })

    return res;
}