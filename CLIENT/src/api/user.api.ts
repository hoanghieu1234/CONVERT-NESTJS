import axios from "axios";
import axiosClient from "./AxiosClient";
class userApi {
  static register(param: object) {
    const url = "http://localhost:8080/api/v1/user/register";
    return axios.post(url, param);
  }
  static login(param: object) {
    const url = "http://localhost:8080/api/v1/user/login";
    return axios.post(url, param);
  }
  // Logout Administrator
  static logout() {
    const url = "api/v1/user/logout";
    return axiosClient.post(url);
  }
  static addWishList(idProduct: string) {
    const url = `api/v1/user/add-wishlist/${idProduct}`;
    return axiosClient.post(url);
  }
  static getWishList(idUser: string) {
    const url = `api/v1/user/get-wishlist/${idUser}`;
    return axiosClient.get(url);
  }
  static deleteWishList(idProduct: string) {
    const url = `api/v1/user/remove-wishlist/${idProduct}`;
    return axiosClient.delete(url);
  }
}

export default userApi;
