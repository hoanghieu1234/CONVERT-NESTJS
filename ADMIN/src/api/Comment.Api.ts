import axiosClient from "./AxiosAdmin";

class commentApi {
  static getAllComments() {
    const url = "api/v1/get-all-comment";
    return axiosClient.get(url);
  }
}
export default commentApi;
