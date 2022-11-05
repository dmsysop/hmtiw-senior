import axios, { AxiosInstance } from 'axios'

export const axiosSenior: AxiosInstance = axios.create({
  baseURL: 'https://platform.senior.com.br/'
})

export const axiosSeniorGetaway: AxiosInstance = axios.create({
  baseURL: 'https://snr-getaway.fly.dev/'
})
