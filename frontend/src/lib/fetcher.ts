import axios from 'axios'

const fetcher = axios.create({
  baseURL: '/api',
  timeout: 60 * 1000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

export default fetcher
