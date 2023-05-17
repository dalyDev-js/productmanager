import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductList.scss";
import { FaTrash } from "react-icons/fa";
import { BsStack } from "react-icons/bs";
import { AiFillEdit, AiOutlinePlus } from "react-icons/ai";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [checked, setChecked] = useState({});

  useEffect(() => {
    getUsers();
  }, []);

  function getUsers() {
    axios
      .get("https://www.screen2script-mag.com/api/products")
      .then(function (response) {
        console.log(response.data);
        if (
          JSON.stringify(response.data) ===
          JSON.stringify({ message: "No products found." })
        ) {
          setProducts([]);
        } else {
          setProducts(response.data);
        }
      });
  }

  const deleteProducts = (SKUsToDelete) => {
    const deletePromises = SKUsToDelete.map((sku) => {
      const productToDelete = products.find((product) => product.sku === sku);
      const { attribute } = productToDelete;

      console.log("Attribute:", attribute);

      return axios.delete(
        `https://www.screen2script-mag.com/api/product/${sku}/delete`,
        {
          data: { attribute },
        }
      );
    });

    Promise.all(deletePromises)
      .then(function (responses) {
        console.log(responses.map((response) => response.data));
        getUsers();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleDeleteChecked = () => {
    const checkedProducts = products.filter((product) => checked[product.sku]);
    const SKUsToDelete = checkedProducts.map((product) => product.sku);
    deleteProducts(SKUsToDelete);
  };

  const handleCheckboxChange = (event, sku) => {
    const isChecked = event.target.checked;
    setChecked((prevChecked) => ({
      ...prevChecked,
      [sku]: isChecked,
    }));
  };

  const deleteProduct = (sku) => {
    const productToDelete = products.find((product) => product.sku === sku);
    const { attribute } = productToDelete;

    console.log("Attribute:", attribute);

    axios
      .delete(`https://www.screen2script-mag.com/api/product/${sku}/delete`, {
        data: { attribute },
      })
      .then(function (response) {
        console.log(response.data);
        getUsers();
      });
  };

  const getDescription = (product) => {
    if (product.attribute === "Furniture") {
      return "Dimensions: " + product.value + ` CM`;
    } else if (product.attribute === "DVD-Disk") {
      return "Size: " + product.value + " MB";
    } else if (product.attribute === "Book") {
      return "Weight: " + product.value + " KG";
    }
    return "";
  };

  return (
    <div>
      <header>
        <div className="logo">
          <Link to="/">
            <img
              src="product-manager-app-high-resolution-logo-black-on-transparent-background.png"
              alt="logo"
            />
          </Link>
        </div>
        <div className="buttons">
          <Link to="add-product">ADD</Link>
          <button id="delete-product-btn" onClick={handleDeleteChecked}>
            MASS DELETE
          </button>
        </div>
      </header>

      <div className="products">
        <div>
          <h1>
            <BsStack /> Product List
          </h1>
        </div>

        <div className="cards-container">
          {products.map((product, key) => (
            <div key={key} className="cards">
              <input
                className="delete-checkbox"
                type="checkbox"
                id={`cbx-${key}`}
                checked={checked[product.sku] || false}
                onChange={(event) => handleCheckboxChange(event, product.sku)}
              />
              <label htmlFor={`cbx-${key}`} className="cbx" />

              <p>{product.sku}</p>
              <p className="name">Product: {product.name}</p>
              <p>Price: {product.price} $</p>
              <p>{getDescription(product)}</p>
              <div className="edit-delete">
                <Link to={`edit-product/${product.sku}`}>
                  <AiFillEdit /> Edit
                </Link>
                <button onClick={() => deleteProduct(product.sku)}>
                  {" "}
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductList;
