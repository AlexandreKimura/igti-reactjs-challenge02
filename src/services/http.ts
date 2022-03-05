import axios from 'axios';

export const axiosConnection = axios.create({
  baseURL: "http://localhost:3001",
  timeout: 5000
})

export async function httpRequest(url: string) {
  const { data } = await axiosConnection.get(url)
  return data
}
