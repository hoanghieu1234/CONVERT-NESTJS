import React, { useEffect, useState } from "react";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import Meta from "../../components/Meta/Meta";
import "./WishList.css";
import userApi from "../../api/user.api";
import { AiTwotoneDelete } from "react-icons/ai";

interface Product {
  _id: string;
  title: string;
  category: string;
  price: number;
  image: string; // Thay 'string' bằng kiểu dữ liệu thực tế của trường 'image'
}

interface WishlistItemProps {
  product?: Product;
  removeFromWishlist?: (productId: string) => void;
}

const WishList: React.FC<WishlistItemProps> = () => {
  const [wishList, setWishList] = useState<Product[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null
  );

  const openPopup = (productId: string) => {
    setShowPopup(true);
    setProductIdToDelete(productId);
  };

  const closePopup = () => {
    setShowPopup(false);
    setProductIdToDelete(null);
  };

  const handleDelete = () => {
    if (productIdToDelete) {
      userApi
        .deleteWishList(productIdToDelete)
        .then((response) => {
          console.log(response, "delete-wish-list");
          if (response.status === 200) {
            // Xoá thành công, cập nhật danh sách wishList
            setWishList((prevWishList) =>
              prevWishList.filter(
                (product) => product._id !== productIdToDelete
              )
            );
          } else {
            console.error(
              "Error deleting product from wishlist:",
              response.data.msg
            );
          }
        })
        .catch((error) => {
          console.error("Error deleting product from wishlist:", error);
        })
        .finally(() => {
          closePopup();
        });
    }
  };

  let userLogin: any = localStorage.getItem("userLogin");
  userLogin = JSON.parse(userLogin);
  let idUser = userLogin?.data?._id;

  useEffect(() => {
    userApi
      .getWishList(idUser)
      .then((res) => {
        setWishList(res.data);
      })
      .catch((err) => {
        console.error("Error fetching wishlist:", err);
      });
  }, []);
  return (
    <>
      <Meta title={"Wishlist"} />
      <BreadCrumb title="Wishlist" />

      <div className="wishlist-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row get-wishlist">
            {wishList.length > 0 &&
              wishList.map((pro) => {
                return (
                  <div className="box-wishlist" key={pro._id}>
                    <div className="wishlist-card position-relative">
                      <AiTwotoneDelete
                        className="icons-delete-wishlist"
                        onClick={() => openPopup(pro._id)}
                      />
                      <div className="wishlist-card-image">
                        <img src={pro.image} alt="watch" />
                      </div>
                      <div className="py-3">
                        <h5 className="title-wishlist">{pro.title}</h5>
                        <h5 className="title">{pro.category}</h5>
                        <h6 className="price">{pro.price} $</h6>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {showPopup && (
        <div className="popup">
          <p>Bạn có chắc chắn muốn xóa sản phẩm này?</p>
          <button onClick={closePopup}>Hủy</button>
          <button onClick={handleDelete}>Xoá</button>
        </div>
      )}
    </>
  );
};

export default WishList;
