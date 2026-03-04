import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000
});

export const getHealth = () => client.get('/health');

export const getPackages = () => client.get('/packages');

export const getPackageById = (id) => client.get(`/packages/${id}`);

export const getFeaturedPackages = () => client.get('/packages/featured');

export const getGallery = () => client.get('/gallery');

export const getReviews = (packageId) =>
  client.get('/reviews', {
    params: packageId ? { package_id: packageId } : {}
  });


export const createReview = (data) => client.post('/reviews', data);

export const getFaqs = () => client.get('/faqs');

export const getVideos = () => client.get('/videos');

export const sendContactMessage = (data) => client.post('/contact', data);
