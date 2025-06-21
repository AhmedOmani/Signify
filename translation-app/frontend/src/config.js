const config = {
    API_URL: __DEV__ 
      ? 'http://172.20.10.3:4000'  // Development with hotspot
      : 'https://your-production-url.com'  // Production
  };
  
  export default config; 
  //http://192.168.100.3:4000