import axios from 'axios'


axios.interceptors.request.use(function (config) {

  config = {
    ...config,
    baseURL: "http://127.0.0.1:8888/api/private/v1"
  
  }
  
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
 
// Add a response interceptor
axios.interceptors.response.use(function (response) {

    return response;
  }, function (error) {
    return Promise.reject(error);
});
  
export default axios;