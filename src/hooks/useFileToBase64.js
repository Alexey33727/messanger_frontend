import { fileToBase64 } from 'base64-file'
export default async function useFileToBase64(file) {
    return new Promise((resolve, reject) => {
        fileToBase64(file).then((base64) => {
            resolve(base64)
        })
    })
}