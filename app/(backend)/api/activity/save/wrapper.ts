import { RequestBody, ResponseBody } from "./route";


export default async function saveActivity({ id, activity }: RequestBody): Promise<ResponseBody> {
    return fetch('/api/activity/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, activity })

    }).then(response => {
        return response.json()
    })
}