import { RequestBody, ResponseBody } from "./route";


export default async function createPromotionCodes({ number, params }: RequestBody): Promise<ResponseBody> {
    return fetch('/api/stripe/create-promotion-codes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number, params })

    }).then(response => {
        return response.json()
    })
}