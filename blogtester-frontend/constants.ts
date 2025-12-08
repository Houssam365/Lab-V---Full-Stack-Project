// Change this to match your local backend port
// Example: if your express app listens on 3000, use http://localhost:3000/api
// We assume your routers are mounted at /api/auth, /api/articles, /api/comments
export const API_BASE_URL = 'http://localhost:5000/api';

export enum FetchState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}