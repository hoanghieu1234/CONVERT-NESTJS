// import React, { useEffect, useState } from "react";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";
import Meta from "../../components/Meta/Meta";
import ReactStars from "react-rating-star-with-type";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./OutStore.css";
import Color from "../../components/color/color";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { sortByProduct } from "../../redux/reduce/sorfByProduct";
import { sortByCategory } from "../../redux/reduce/sortByCategory";

const OurStore: React.FC = () => {
  const [sortOption, setSortOption] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const dispatch = useDispatch();

  console.log(category,"setCategory")
  const handleSortChange = (event: any) => {
    const selectedOption = event.target.value;
    setSortOption(selectedOption);
    if (selectedOption !== "") {
      dispatch(sortByProduct(selectedOption));
    }
  };

  // DISPATCH CATEGORY
  dispatch(sortByCategory(category));
  return (
    <>
      <Meta title={"Our Store"} />
      <BreadCrumb title="Our Store" />
      <div className="store-wrapper home-wrapper-2 py-5">
        <div className="container-xxl">
          <div className="row">
            <div className="col-3">
              <div className="filter-card mb-3">
                <h3 className="filter-title">Shop By Categories</h3>
                <div>
                  <ul className="ps-0 category-filter">
                    <li
                      className={category == "mobile" ? "active-catalog" : ""}
                      onClick={() => {
                        category === "mobile"
                          ? setCategory("")
                          : setCategory("mobile");
                      }}
                    >
                      Mobile
                    </li>
                    <li
                      className={category == "Tv" ? "active-catalog" : ""}
                      onClick={() => {
                        category === "Tv" ? setCategory("") : setCategory("Tv");
                      }}
                    >
                      Tv
                    </li>
                    <li
                      className={category == "camera" ? "active-catalog" : ""}
                      onClick={() => {
                        category === "camera"
                          ? setCategory("")
                          : setCategory("camera");
                      }}
                    >
                      Camera
                    </li>
                    <li
                      className={category == "Laptop" ? "active-catalog" : ""}
                      onClick={() => {
                        category === "Laptop"
                          ? setCategory("")
                          : setCategory("Laptop");
                      }}
                    >
                      Laptop
                    </li>
                  </ul>
                </div>
              </div>
              <div className="filter-card mb-3">
                <h3 className="filter-title">Filter By</h3>
                <div>
                  <h5 className="sub-title">Availablity</h5>
                  <div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id=""
                      />
                      <label className="form-check-label" htmlFor="">
                        In Stock (1)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id=""
                      />
                      <label className="form-check-label" htmlFor="">
                        Out of Stock (0)
                      </label>
                    </div>
                  </div>
                  <h5 className="sub-title">Price</h5>
                  <div className="d-flex align-items-center gap-10">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="From"
                      />
                      <label htmlFor="floatingInput">From</label>
                    </div>
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="floatingInput"
                        placeholder="To"
                      />
                      <label htmlFor="floatingInput">To</label>
                    </div>
                  </div>
                  <h5 className="sub-title">Color</h5>
                  <div className="d-flex flex-wrap">
                    <Color />
                  </div>
                  <h5 className="sub-title">Size</h5>
                  <div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="color-1"
                      />
                      <label className="form-check-label" htmlFor="color-1">
                        S (2)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="color-2"
                      />
                      <label className="form-check-label" htmlFor="color-2">
                        M (2)
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id="color-3"
                      />
                      <label className="form-check-label" htmlFor="color-3">
                        L (3)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="filter-card mb-3">
                <h3 className="filter-title">Product Tags</h3>
                <div>
                  <div className="product-tags d-flex flex-wrap align-items-center gap-10">
                    <span
                      className={
                        tags == "headphone"
                          ? "badge bg-light text-secondary rounded-3 py-2 px-3 active-tags"
                          : "badge bg-light text-secondary rounded-3 py-2 px-3"
                      }
                      onClick={() => {
                        tags == "headphone"
                          ? setTags("")
                          : setTags("headphone");
                      }}
                    >
                      Headphone
                    </span>
                    <span
                      className={
                        tags == "Mobile"
                          ? "badge bg-light text-secondary rounded-3 py-2 px-3 active-tags"
                          : "badge bg-light text-secondary rounded-3 py-2 px-3"
                      }
                      onClick={() => {
                        tags == "Mobile" ? setTags("") : setTags("Mobile");
                      }}
                    >
                      Mobile
                    </span>
                    <span
                      className={
                        tags == "Laptop"
                          ? "badge bg-light text-secondary rounded-3 py-2 px-3 active-tags"
                          : "badge bg-light text-secondary rounded-3 py-2 px-3"
                      }
                      onClick={() => {
                        tags == "Laptop" ? setTags("") : setTags("Laptop");
                      }}
                    >
                      Laptop
                    </span>
                    <span
                      className={
                        tags == "Wire"
                          ? "badge bg-light text-secondary rounded-3 py-2 px-3 active-tags"
                          : "badge bg-light text-secondary rounded-3 py-2 px-3"
                      }
                      onClick={() => {
                        tags == "Wire" ? setTags("") : setTags("Wire");
                      }}
                    >
                      Wire
                    </span>
                  </div>
                </div>
              </div>
              <div className="filter-card mb-3">
                <h3 className="filter-title">Random Product</h3>
                <div>
                  <div className="random-products d-flex mb-3">
                    <div className="w-50">
                      <img
                        src="images/watch.jpg"
                        alt="watch"
                        className="img-fluid"
                      />
                    </div>
                    <div className="w-50">
                      <h5>
                        Kids headphones bulk 10 pack multi colored for students
                      </h5>
                      {/* Thư việc reactStars */}
                      <ReactStars
                        count={5}
                        size={24}
                        value={3}
                        // edit={false} // Dòng này ngăn ko cho sữa
                        activeColor="#ffd700"
                      />
                      <p>$300</p>
                    </div>
                  </div>
                  <div className="random-products d-flex">
                    <div className="w-50">
                      <img
                        src="images/watch.jpg"
                        alt="watch"
                        className="img-fluid"
                      />
                    </div>
                    <div className="w-50">
                      <h5>
                        Kids headphones bulk 10 pack multi colored for students
                      </h5>
                      {/* Thư việc reactStars */}
                      <ReactStars
                        count={5}
                        size={24}
                        value={3}
                        // edit={false} // Dòng này ngăn ko cho sữa
                        activeColor="#ffd700"
                      />
                      <p>$300</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-9">
              <div className="filter-sort-grid mb-4">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-10">
                    <p className="mb-0 d-block" style={{ width: "100px" }}>
                      Soft By:
                    </p>
                    <select
                      name=""
                      className="form-control form-select"
                      id=""
                      value={sortOption}
                      onChange={handleSortChange}
                    >
                      <option value="">Featured</option>

                      <option value="title">Sort By Name</option>
                      <option value="price">Sort By Price</option>
                      <option value="createdAt">Sort By Date</option>
                    </select>
                  </div>
                  <div className="d-flex align-items-center gap-10">
                    <p className="total-products mb-0">21 products</p>
                    <div className="d-flex gap-10 align-items-center grid">
                      <img
                        src="images/gr4.svg"
                        className="d-block img-fluid"
                        alt="grid"
                      />
                      <img
                        src="images/gr3.svg"
                        className="d-block img-fluid"
                        alt="grid"
                      />
                      <img
                        src="images/gr2.svg"
                        className="d-block img-fluid"
                        alt="grid"
                      />
                      <img
                        src="images/gr.svg"
                        className="d-block img-fluid"
                        alt="grid"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="products-list pb-5">
                <div className="d-flex flex-wrap">
                  <ProductCard grid={4} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OurStore;
