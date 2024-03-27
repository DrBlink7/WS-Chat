import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    "http://confi-codin-1xbkniq7crrwz-645813469.us-west-2.elb.amazonaws.com",
});
axiosClient.defaults.headers.common["Accept"] = "application/json";

export default axiosClient;
