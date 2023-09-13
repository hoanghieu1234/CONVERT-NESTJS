import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { addCartItems, addSubtotal } from "../../redux/reduce/checkout";
import "./Checkout.css";
import { PayPalButtons } from "@paypal/react-paypal-js";
import PaymentAPI from "../../api/payment.api";
import { updateState } from "../../redux/reduce/updateSlice";

const Checkout: React.FC = () => {
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const checkoutSelector = useSelector((state: any) => state.checkout);
  console.log(checkoutSelector, "checkout selected");
  let getUserLocalStorage: any = localStorage.getItem("userLogin");
  getUserLocalStorage = JSON.parse(getUserLocalStorage)?.data;
  console.log(getUserLocalStorage, "getUserLocalStorage");
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  // PAYMENT
  // call api cart qua checkout
  const handlePostCheckout = async () => {
    try {
      if (checkoutSelector.cartItems.length > 0) {
        const paymentData = {
          idUser: getUserLocalStorage._id,
          listProduct: checkoutSelector.cartItems,
          total: checkoutSelector.subtotal,
        };
        console.log("total", paymentData.total);
        await PaymentAPI.postCartToPayment(paymentData);
        await PaymentAPI.deleteCartToPayment(getUserLocalStorage._id).then(
          (res) => {
            console.log(res);
            dispatch(updateState());
          }
        );
        dispatch(addCartItems([]));
        dispatch(addSubtotal(0));
      }
    } catch (error) {
      console.error("Lỗi khi đặt hàng", error);
    }
  };
  return (
    <>
      <div className="checkout-wrapper py-5 home-wrapper-2">
        <div className="container-xxl">
          <div className="row">
            <div className="col-7">
              <div className="checkout-left-data">
                <h3 className="website-name">H&H Store</h3>
                <nav
                  style={
                    { "--bs-breadcrumb-divider": ">" } as React.CSSProperties
                  }
                  aria-label="breadcrumb"
                >
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item active" aria-current="page">
                      <Link
                        className="text-dark"
                        to="/cart"
                        onClick={() => dispatch(addCartItems([]))}
                      >
                        Cart
                      </Link>
                    </li>
                    &nbsp;
                    <li className="breadcrumb-item active" aria-current="page">
                      Information
                    </li>
                    &nbsp;
                    <li className="breadcrumb-item active" aria-current="page">
                      Payment
                    </li>
                  </ol>
                </nav>
                <h4 className="title">Contact Information</h4>
                <p className="user-details">
                  {/* {idUser.firstname + idUser.lastname} {idUser.email} */}
                </p>
                <form
                  action=""
                  className="d-flex flex-wrap gap-15 justify-content-center"
                >
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      placeholder="first-name"
                      className="form-control"
                      value={getUserLocalStorage?.firstname}
                      readOnly={true}
                    />
                  </div>
                  <div className="flex-grow-1">
                    <input
                      type="text"
                      placeholder="last-name"
                      className="form-control"
                      value={getUserLocalStorage?.lastname}
                      readOnly={true}
                    />
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      placeholder="address"
                      className="form-control"
                      value={address} // Liên kết giá trị của trường "address"
                      onChange={handleAddressChange}
                    />
                  </div>
                  <div className="w-100">
                    <input
                      type="text"
                      placeholder="phone"
                      className="form-control"
                      value={getUserLocalStorage?.mobile}
                      readOnly={true}
                    />
                  </div>
                  <div className="w-100">
                    <div className="d-flex justify-content-between align-items-center gap-15">
                      <NavLink
                        className="text-dark"
                        to="/cart"
                        onClick={() => dispatch(addCartItems([]))}
                      >
                        <BiArrowBack className="fs-4 mb-1" /> Return to Cart
                      </NavLink>
                      {/* <Button className="button"  onClick={handlePostCheckout}>
                        Continue Shipping
                      </Button> */}
                      <PayPalButtons
                        style={{
                          layout: "horizontal",
                          height: 48,
                        }}
                        createOrder={(data, actions) => {
                          {
                            console.log(data);
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    currency_code: "USD",
                                    value: `${checkoutSelector.subtotal
                                      .toFixed(2)
                                      .replace(".00", "")}`, // Sử dụng giá trị totalAmount ở đây
                                  },
                                  description: `Purchase at ${new Date().toLocaleString()}`,
                                },
                              ],
                            });
                          }
                        }}
                        onApprove={(_, actions): any => {
                          return actions.order
                            ?.capture()
                            .then(() => handlePostCheckout());
                        }}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-5">
              <div className="border-bottom py-4 product-checkout">
                {checkoutSelector.cartItems.length > 0 &&
                  checkoutSelector.cartItems.map((product: any) => {
                    return (
                      <div className="d-flex gap-10 align-items-center">
                        <div className="w-75 d-flex gap-10">
                          <div className="w-25">
                            <img
                              src={product.idProduct.image}
                              className="img-fluid img-centered"
                              alt="product"
                            />
                          </div>
                          <div>
                            <h5 className="title">{product.idProduct.title}</h5>
                            <p>{product.idProduct.category}</p>
                            <p>
                              {product.idProduct.price * product.quantity} $
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="d-flex justify-content-between align-items-center py-4">
                <h4>Subtotal</h4>
                <h5>{checkoutSelector.subtotal}.00 $</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
