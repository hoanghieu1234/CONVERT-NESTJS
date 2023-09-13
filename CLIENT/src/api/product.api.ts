import axiosClient from "./AxiosClient";

class productAPI {
  static getAllProducts(query:string,sortByCategory:string) {
    const url = `/api/v1/product/get-all?_sort=${query}&_categories=${sortByCategory}`;
    return axiosClient.get(url);
  }
  static getDetailProduct(params: string) {
    const url = `/api/v1/product/get-by-id/${params}`;
    return axiosClient.get(url);
  }
  
}
export default productAPI;
