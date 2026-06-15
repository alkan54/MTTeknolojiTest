import axios from 'axios';

// Get CompanyId from local storage or set a default one for test purposes
const getCompanyId = () => {
  let companyId = localStorage.getItem('companyId');
  if (!companyId) {
    companyId = 'MT-TEKNOLOJI-TEST-1';
    localStorage.setItem('companyId', companyId);
  }
  return companyId;
};

const api = axios.create({
  baseURL: 'http://localhost:5064/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  config.headers['X-Company-Id'] = getCompanyId();
  return config;
});

export default api;
