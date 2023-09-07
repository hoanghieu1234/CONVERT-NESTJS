import React, { useEffect, useState } from "react";
import "./index.css";
import productApi from "../../api/Product.Api";
import { Product } from "../../types/type";

const ProductManager: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [product, setProduct] = useState<Product[]>([]);
  const [reloadTable, setReloadTable] = useState(false);
  const [editData, setEditData] = useState<Product | null>(null);
  const [editImage, setEditImage] = useState<any>();
  const [createProduct, setCreateProduct] = useState<Product>({
    _id: "",
    title: "",
    price: "",
    category: "",
    image: "",
    quantity: "",
  });

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateProduct({
      ...createProduct,
      [e.target.name]: e.target.value,
    });
  };

  // handle change image
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageFile = e.target.files![0];
    setEditImage(imageFile);
  };

  // Get Api Product
  const getProduct = async () => {
    const myProduct = await productApi.getAllProduct();
    setProduct(myProduct.data);
  };
  useEffect(() => {
    getProduct();
  }, [reloadTable]);

  // TOGGLE FORM
  const handleAddProductClick = () => {
    setShowForm(true);
  };

  // SUBMIT FORM
  const handleSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      setReloadTable(!reloadTable);

      const formData = new FormData();

      formData.append("title", createProduct.title);
      formData.append("price", createProduct.price);
      formData.append("category", createProduct.category);
      formData.append("image", editImage);
      formData.append("quantity", createProduct.quantity);

      if (editData) {
        const formData = new FormData();

        formData.append("title", createProduct.title);
        formData.append("price", createProduct.price);
        formData.append("category", createProduct.category);
        formData.append("image", editImage);
        formData.append("quantity", createProduct.quantity);

        productApi
          .updateProduct(formData, createProduct._id!)
          .then(() => {
            getProduct();
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        await productApi.createProduct(formData);
      }
      getProduct();
      setCreateProduct({
        title: "",
        price: "",
        category: "",
        image: "",
        quantity: "",
      });
      setShowForm(false);
      setEditData(null);
    } catch (error) {
      console.log(error);
    }
    setShowForm(false);
  };

  // Xóa sản phẩm
  const deleteProduct = async (id: string) => {
    try {
      await productApi.deleteProduct({ id: id });
      setReloadTable((prevReloadTable) => !prevReloadTable);
      getProduct();
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Sản Phẩm
  const handleEditProduct = (pro: any) => {
    setShowForm(true);
    const data = {
      ...pro,
      title: pro.title,
      price: pro.price,
      category: pro.category,
      image: pro.image,
      quantity: pro.quantity,
    };
    setEditData(data);
    setCreateProduct(data);
  };

  return (
    <div className="wrapper-home">
      <div className="content-home">
        <div className="product-actions">
          <input
            type="text"
            id="searchInput"
            placeholder="Search for product..."
          />
          <button
            type="button"
            id="addProductButton"
            onClick={handleAddProductClick}
          >
            Create Product
          </button>
        </div>
        {showForm && (
          <form
            onSubmit={handleSubmitForm}
            className="product-form"
            id="form-create"
          >
            <div className="form-row">
              <label htmlFor="title" className="label-pro">
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={createProduct.title}
                placeholder="title"
                className="input-pro"
                onChange={handleChangeInput}
              />
            </div>
            <div className="form-row">
              <label htmlFor="price" className="label-pro">
                Price:
              </label>
              <input
                value={createProduct.price}
                type="number"
                id="price"
                name="price"
                min={1}
                max={10}
                required
                placeholder="price"
                className="input-pro"
                onChange={handleChangeInput}
              />
            </div>
            <div className="form-row">
              <label htmlFor="category" className="label-pro">
                Category:
              </label>
              <input
                value={createProduct.category}
                type="text"
                id="category"
                name="category"
                placeholder="category"
                required
                className="input-pro"
                onChange={handleChangeInput}
              />
            </div>
            <div className="form-row">
              <label htmlFor="image" className="label-pro">
                Image:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                required
                className="input-pro"
                onChange={handleImageChange}
              />
            </div>
            <div className="form-row">
              <label htmlFor="quantity" className="label-pro">
                Quantity:
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min={1}
                max={10}
                placeholder="0"
                required
                value={createProduct.quantity}
                className="input-pro"
                onChange={handleChangeInput}
              />
            </div>
            <div className="form-row">
              {editData ? (
                <>
                  <button type="submit" className="btn-update" id="btn-product">
                    Update Product
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditData(null);
                      setCreateProduct({
                        _id: "",
                        title: "",
                        price: "",
                        category: "",
                        image: "",
                        quantity: "",
                      });
                    }}
                    className="btn-cancel"
                    id="btn-product"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button type="submit" className="btn-save" id="btn-product">
                    Save Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="btn-cancel"
                    id="btn-product"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </form>
        )}

        <div className="product-list">
          <h2>Manager Product</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {product.length > 0 &&
                product.map((pro, index) => {
                  return (
                    <tr key={pro._id}>
                      <td>{index + 1}</td>
                      <td>{pro.title}</td>
                      <td>{pro.price}</td>
                      <td>{pro.category}</td>
                      <td>
                        <div className="img-fluid">
                          <img src={pro.image} />
                        </div>
                      </td>
                      <td>{pro.quantity}</td>
                      <td>
                        <button
                          type="button"
                          className="edit-btn"
                          id="btn-pro"
                          onClick={() => handleEditProduct(pro)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteProduct(pro._id as any);
                          }}
                          className="dele-btn"
                          id="btn-pro"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
