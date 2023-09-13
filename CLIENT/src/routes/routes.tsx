import User from "../Layout/User";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/home/Home";
import NotFound from "../pages/NotFound/NotFound";
import Blog from "../pages/blog/Blog";
import Login from "../pages/Login/Login";
import SignUp from "../pages/Sign-Up/SignUp";
import SingleBlog from "../pages/SingleBlog/SingleBlog";
import OurStore from "../pages/OurStore/OurStore";
import Contact from "../pages/Contact/Contact";
import SingleProduct from "../pages/SingleProduct/SingleProduct";
import RequireCart from "../components/RequireCart/RequireCart";
import RequireAuth from "../components/RequireAuth";
import ResetPassword from "../pages/ResetPassword/ResetPassword";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import Profile from "../pages/Profile/Profile";
import Checkout from "../pages/Checkout/Checkout";
import WishList from "../pages/WishList/WishList";

const Router: React.FC = () => {
  //nếu như mà có người dùng thì show giỏ hàng còn không show ra trang liên quan tới hãy đăng nhập để xem giỏ hàng
  return (
    <Routes>
      <Route
        index
        element={
          <User>
            <Home />
          </User>
        }
      />
      {/* <Route
        path="/about"
        element={
          <User>
            <About />
          </User>
        }
      /> */}
      <Route
        path="/contact"
        element={
          <User>
            <Contact />
          </User>
        }
      />
      <Route element={<RequireAuth />}>
        <Route
          path="/profile"
          element={
            <User>
              <Profile />
            </User>
          }
        />
      </Route>
      <Route
        path="/product"
        element={
          <User>
            <OurStore />
          </User>
        }
      />
      <Route
        path="/product/:id"
        element={
          <User>
            <SingleProduct />
          </User>
        }
      />
      <Route
        path="/blogs"
        element={
          <User>
            <Blog />
          </User>
        }
      />
      <Route
        path="/blogs/:id"
        element={
          <User>
            <SingleBlog />
          </User>
        }
      />
      {/* <Route element={<RequireAuth />}> */}
      <Route element={<RequireAuth />}>
        <Route
          path="/cart"
          element={
            <User>
              <RequireCart />
            </User>
          }
        />
      </Route>

      {/* </Route> */}
      <Route element={<RequireAuth />}>
        <Route
          path="/checkout"
          element={
            <User>
              <Checkout />
            </User>
          }
        />
      </Route>

      {/* <Route
            path="/compare-product"
            element={
              <User>
                <CompareProduct />
              </User>
            }
          /> */}
      <Route element={<RequireAuth />}>
        <Route
          path="/wishlist"
          element={
            <User>
              <WishList />
            </User>
          }
        />
      </Route>

      <Route
        path="/login"
        element={
          <User>
            <Login />
          </User>
        }
      />
      <Route
        path="/forgot-password/:token"
        element={
          <User>
            <ResetPassword />
          </User>
        }
      />
      <Route
        path="/sign-up"
        element={
          <User>
            <SignUp />
          </User>
        }
      />
      <Route
        path="/reset-password"
        element={
          <User>
            <ForgotPassword />
          </User>
        }
      />
      {/* <Route
            path="/privacy-policy"
            element={
              <User>
                <PrivacyPolicy />
              </User>
            }
          /> */}
      {/* <Route
            path="/refund-policy"
            element={
              <User>
                <RefundPolicy />
              </User>
            }
          /> */}
      {/* <Route
            path="/shipping-policy"
            element={
              <User>
                <ShippingPolicy />
              </User>
            }
          /> */}
      {/* <Route
            path="/term-conditions"
            element={
              <User>
                <TermAndCondition />
              </User>
            }
          />   */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
