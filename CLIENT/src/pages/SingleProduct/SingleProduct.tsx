import { useEffect, useState } from "react";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import Meta from "../../components/Meta/Meta";
import ReactStars from "react-stars";
import "./SingleProduct.css";
import Color from "../../components/color/color";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import productAPI from "../../api/product.api";
import cartAPI from "../../api/cart.api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingComponent from "../../components/LoadingComponent";
import { updateState } from "../../redux/reduce/updateSlice";
import { useDispatch } from "react-redux";
import BaseAxios from "../../api/AxiosClient";
import axios from "axios";
import userApi from "../../api/user.api";

interface Comment {
  idUser: string;
  content: string;
  rating: any;
  // Các thuộc tính khác của comment
}

const SingleProduct = () => {
  const [orderedProduct, _] = useState(true);
  const location = useLocation();
  const [product, setProduct] = useState<any>();
  console.log(product, "product =>>>>>");
  const navigate = useNavigate();
  const getUserLogin = JSON.parse(localStorage.getItem("userLogin") as any);
  const [isLoading, setIsLoading] = useState(true);
  const idProduct = location.pathname.split("/")[2];
  const idUser = getUserLogin?.data?._id;

  const params = useParams();
  // COMMENT START
  const [rating, setRating] = useState<number>(0);
  const [commentContent, setCommentContent] = useState("");
  const [inputComment, _setInputComment] = useState<string>("");
  const [comment, setCommnet] = useState<Comment[]>([]); // Đảm bảo rằng kiểu Comment[] phù hợp với cấu trúc của dữ liệu từ API trả về
  const [shouldFetchComments, setShouldFetchComments] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleRatingChange = (value: number) => {
    setRating(value);
  };

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCommentContent(event.target.value);
  };

  // Tính tổng số sao từ mảng comment
  const totalStars = comment?.reduce((total, commentItem) => {
    // Chuyển đổi giá trị rating thành kiểu số (number)
    const rating = parseFloat(commentItem.rating);

    // Kiểm tra xem rating có phải là một số hợp lệ không
    if (!isNaN(rating)) {
      return total + rating;
    }

    return total; // Không thêm vào tổng nếu rating không hợp lệ
  }, 0);

  // Tính trung bình số sao
  const averageRating = totalStars / comment.length;
  console.log(averageRating, 455);
  // COMMENT END

  const dispatch = useDispatch();

  useEffect(() => {
    // Gọi sản phẩm để lấy thông tin sản phẩm dựa vào ID
    const fetchProduct = async (idProduct: string) => {
      try {
        const getProductById = await productAPI.getDetailProduct(idProduct);

        setProduct(getProductById);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log("Lỗi khi gọi API" + error);
      }
    };
    fetchProduct(idProduct);
  }, [idProduct]);

  // Add to cart
  const handleAddToCart = () => {
    if (!getUserLogin) {
      toast.error("Vui lòng đăng nhập trước khi thêm sản phẩm vào giỏ hàng", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/login");
    } else {
      setIsLoading(true);
      // Người dùng đã đăng nhập, tiếp tục thêm sản phẩm vào giỏ hàng
      cartAPI
        .userAddToCart({ idUser, idProduct, quantity: 1 })
        .then((_respone) => {
          setIsLoading(false);
          // Hiển thị toast thông báo sản phẩm đã được thêm vào giỏ hàng thành công
          toast.success("Sản phẩm đã được thêm vào giỏ hàng", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          dispatch(updateState(true as any));
        })
        .catch((error: any) => {
          setIsLoading(false);
          console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
        });
    }
  };

  //  SUBMIT COMMENTS
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!getUserLogin) {
      navigate("/login");
      return;
    }
    try {
      const requestBody = {
        idUser: idUser,
        idProduct: params.id,
        content: commentContent,
        rating: rating,
      };
      await BaseAxios.post("/api/v1/post-comments", requestBody);
      setCommentContent("");
      setShouldFetchComments(!shouldFetchComments);
    } catch (error) {
      console.log("Lỗi khi gọi API" + error);
    }
  };

  // GET COMMENT RENDER
  useEffect(() => {
    const getComment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/get-comments/${params.id}`
        );
        console.log("response =====>", response);
        setCommnet(response.data);
      } catch (error) {
        console.log("Lỗi khi gọi API" + error);
      }
    };
    getComment();
  }, [shouldFetchComments]);

  // HANDLE ADD WISHLIST
  const handleAddWishList = async () => {
    try {
      if (!getUserLogin || !getUserLogin.data?.email) {
        // Kiểm tra nếu người dùng chưa đăng nhập hoặc không có email
        toast.error("Please log in to add to wishlist", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/login");
        }, 3000);
        // Chuyển hướng đến trang đăng nhập
        return;
      }

      const response = await userApi.addWishList(idProduct);
      if (response.status === 200) {
        if (response.data.msg === "delete success") {
          toast.error("Product deleted from wishlist!!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setIsInWishlist(false);
          // Xoá sản phẩm khỏi danh sách yêu thích
          let storeWishlist: any = localStorage.getItem("userLogin");
          storeWishlist = JSON.parse(storeWishlist);
          let wishList = storeWishlist?.data?.wishlist || [];
          const updatedWishList = wishList.filter(
            (item: any) => item !== idProduct
          );
          storeWishlist.data.wishlist = updatedWishList;
          localStorage.setItem("userLogin", JSON.stringify(storeWishlist));
        } else {
          toast.success("Product added to wishlist!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });

          // Cập nhật lại localStorage
          let storeWishlist: any = localStorage.getItem("userLogin");
          storeWishlist = JSON.parse(storeWishlist);
          let wishList = storeWishlist?.data?.wishlist || [];

          // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
          if (!wishList.includes(idProduct)) {
            wishList.push(idProduct);
            storeWishlist.data.wishlist = wishList;
            localStorage.setItem("userLogin", JSON.stringify(storeWishlist));
          }
          setIsInWishlist(true);
        }
      }
      console.log(response);
    } catch (error) {
      console.error("Error adding/removing product from wishlist:", error);
    }
  };
  // USE_EFFECT WISHT
  useEffect(() => {
    // Kiểm tra nếu sản phẩm có trong danh sách yêu thích thì cập nhật trạng thái isInWishlist
    let storeWishlist: any = localStorage.getItem("userLogin");
    storeWishlist = JSON.parse(storeWishlist);
    let wishList = storeWishlist?.data?.wishlist || [];

    if (wishList.includes(idProduct)) {
      setIsInWishlist(true);
    }
  }, [idProduct]);

  useEffect(() => {
    userApi
      .getWishList(idUser)
      .then((res) => {
        const wishList = res.data;
        const findWishlist = wishList.find((pro: any) => {
          return pro._id == idProduct;
        });
        if (findWishlist) {
          setIsInWishlist(true);
        } else {
          setIsInWishlist(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching wishlist:", err);
      });
  }, []);
  return (
    <>
      {isLoading && <LoadingComponent />}
      <Meta title={"Product Name"} />
      <BreadCrumb title="Product Name" />
      <ToastContainer />
      <div className="main-product-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-6">
              <div className="main-product-image">
                <div>
                  <img
                    src={product?.data.image}
                    style={{
                      margin: "auto",
                      width: "100%",
                      height: "400px",
                    }}
                  />
                </div>
              </div>
              <div className="other-product-images d-flex flex-wrap gap-15">
                <div>
                  <img src={product?.data.image} alt="" className="img-fluid" />
                </div>
                <div>
                  <img src={product?.data.image} alt="" className="img-fluid" />
                </div>
                <div>
                  <img src={product?.data.image} alt="" className="img-fluid" />
                </div>
                <div>
                  <img src={product?.data.image} alt="" className="img-fluid" />
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="main-product-details">
                <div className="border-bottom">
                  <h3 className="title">{product?.title}</h3>
                </div>
                <div className="border-bottom py-3">
                  <p className="price">{product?.price}</p>
                  <div className="d-flex align-items-center gap-10">
                    <ReactStars
                      count={5}
                      size={24}
                      edit={false}
                      value={averageRating}
                      color2={"#ffd700"}
                    />
                    <p className="mb-0 t-review">{comment.length} Reviews</p>
                  </div>
                </div>

                <div className=" py-3">
                  <div className="d-flex gap-10 align-items-center my-2">
                    <h3 className="product-heading">Title</h3>
                    <p className="product-data"> {product?.data.title}</p>
                  </div>
                  <div className="d-flex gap-10 align-items-center my-2">
                    <h3 className="product-heading"> Category</h3>
                    <p className="product-data">{product?.data.category}</p>
                  </div>
                  <div className="d-flex gap-10 align-items-center my-2">
                    <h3 className="product-heading">Price:</h3>
                    <p className="product-data">{product?.data.price} $</p>
                  </div>

                  <div className="d-flex gap-10 flex-column mt-2 mb-3">
                    <h3 className="product-heading">Color:</h3>
                    <Color />
                  </div>
                  <div className="d-flex align-items-center gap-15 flex-row mt-2 mb-3">
                    <h3 className="product-heading">Quantity:</h3>
                    <div className="">
                      <input
                        type="number"
                        placeholder="1"
                        name=""
                        id=""
                        min={0}
                        max={10}
                        className="form-control"
                        style={{ width: "70px" }}
                      />
                    </div>
                    <div className="d-flex just-content-center gap-15 align-items-center ms-5">
                      <button
                        className="button border-0"
                        type="submit"
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </button>
                      <Link to="/" className="button signup">
                        Buy it Now
                      </Link>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-15 ">
                    <div onClick={handleAddWishList} className="wishlist">
                      {isInWishlist ? (
                        <AiFillHeart className="fs-4 me-2 text-danger icons-wishlist" />
                      ) : (
                        <AiOutlineHeart className="fs-4 me-2 icons-wishlist" />
                      )}
                      {isInWishlist
                        ? "Remove from Wishlist"
                        : "Add to Wishlist"}
                    </div>
                  </div>
                  <div className="d-flex gap-10 flex-column my-3">
                    <h3 className="product-heading">Shipping & Return</h3>
                    <p className="product-data">
                      Free shipping and returns available on all orders! <br />
                      We ship all Us domestic orders within
                      <b>5-10 business day!</b>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="description-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h4>Description</h4>
              <div className="bg-white p-3">
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section className="reviews-wrapper  home-wrapper-2  ">
        <div className="container-xxl">
          <div className="row">
            <div className="col-12">
              <h3 id="review">Reviews</h3>
              <div className="review-inner-wrapper mb-3">
                <div className="review-head d-flex justify-content-between align-items-end">
                  <div>
                    <h4 className="mb-2">Customer Reviews</h4>
                    <div className="d-flex align-items-center gap-10">
                      {/* Thư việc reactStars */}
                      <ReactStars
                        count={5}
                        size={24}
                        value={averageRating}
                        edit={false} // Dòng này ngăn ko cho sữa
                        color2={"#ffd700"}
                      />
                      <p className="mb-0">{comment.length} Review</p>
                    </div>
                  </div>
                  {orderedProduct && (
                    <div>
                      <Link
                        className="text-dark text-decoration-underline"
                        to="#"
                      >
                        Write a Review
                      </Link>
                    </div>
                  )}
                </div>
                <div className="review-form py-4">
                  <h4>Write a Review</h4>
                  <form action="" className="d-flex flex-column gap-15">
                    <div>
                      {/* Thư việc reactStars */}
                      <ReactStars
                        count={5}
                        size={24}
                        value={rating}
                        color2={"#ffd700"}
                        onChange={handleRatingChange}
                      />
                    </div>
                    <div>
                      <textarea
                        name=""
                        id=""
                        cols={30}
                        rows={4}
                        className="w-100 form-control"
                        placeholder="comments"
                        value={commentContent}
                        onChange={handleCommentChange}
                      ></textarea>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button
                        value={inputComment}
                        className="button border-0"
                        onClick={handleSubmitComment}
                      >
                        Submit Review
                      </button>
                    </div>
                  </form>
                </div>
                <div className="reviews mt-4">
                  {comment.map((commentItem: any, index) => (
                    <div className="review" key={index}>
                      <div className="d-flex gap-10 align-items-center">
                        <h6 className="mb-0">
                          {commentItem?.idUser?.firstname}
                        </h6>
                        <ReactStars
                          count={5}
                          size={24}
                          color2={"#ffd700"}
                          edit={false}
                          value={commentItem.rating}
                        />
                      </div>
                      <p className="mt-3">{commentItem.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SingleProduct;
