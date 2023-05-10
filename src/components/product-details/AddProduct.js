import React from "react";
import "./AddProduct.scss";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AddProducts() {
  //states
  const selectedOptions = [
    { value: "DVD-Disk", label: "DVD", inputLabel: "Size (MB)", id: "DVD" },
    {
      value: "Furniture",
      label: "Furniture",
      inputLabel: "Dimensions (HxWxL)",
      id: "Furniture",
    },
    { value: "Book", label: "Book", inputLabel: "Weight (KG)", id: "Book" },
  ];
  const [inputs, setInputs] = useState({
    sku: "",
    name: "",
    price: "",
    attribute: "",
    value: "",
    width: "",
    height: "",
    length: "",
    weight: "",
    size: "",
  });
  const [selectedOption, setSelectedOption] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({
    sku: "",
    name: "",
    price: "",
    attribute: "",
    value: "",
    height: "",
    width: "",
    length: "",
    weight: "",
    size: "",
  });

  // change handler
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    setErrorMessages((messages) => ({ ...messages, [name]: "" }));

    if (name === "attribute") {
      if (value === "Book") {
        setInputs((values) => ({ ...values, value: inputs.weight }));
      } else if (value === "DVD-Disk") {
        setInputs((values) => ({ ...values, value: inputs.size }));
      } else {
        setInputs((values) => ({ ...values, value: "" }));
      }
    }

    let formattedValue = value; // Initialize formattedValue with the input value

    if (selectedOption === "Furniture") {
      const dimensions = ["height", "width", "length"];
      const updatedValues = dimensions.reduce((acc, dimension) => {
        if (name === dimension) {
          return { ...acc, [dimension]: value };
        }
        return { ...acc, [dimension]: inputs[dimension] };
      }, {});

      const dimensionValues = dimensions.map(
        (dimension) => updatedValues[dimension]
      );
      // Update formattedValue for Furniture
      formattedValue = dimensionValues.join("x");
    }

    setInputs((values) => ({ ...values, value: formattedValue }));
  };
  // handle option change
  const handleOptionChange = (event) => {
    const name = event.target.name;
    const option = event.target.value;
    setSelectedOption(option);
    setInputs((values) => ({ ...values, [name]: option }));
    setErrorMessages((messages) => ({ ...messages, [name]: "" }));
  };

  //handle submit
  const Navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Input validation
    const errorMessages = {};

    if (!inputs.sku.trim()) {
      errorMessages.sku = "Please provide SKU";
    }

    if (!inputs.name.trim()) {
      errorMessages.name = "Please provide Name";
    }

    if (!inputs.price.trim()) {
      errorMessages.price = "Please provide Price";
    }

    if (!inputs.attribute) {
      errorMessages.attribute = "Please select a Type";
    } else {
      switch (selectedOption) {
        case "Furniture":
          if (!inputs.height.trim()) {
            errorMessages.height = "Please provide Height";
          }
          if (!inputs.width.trim()) {
            errorMessages.width = "Please provide Width";
          }
          if (!inputs.length.trim()) {
            errorMessages.length = "Please provide Length";
          }
          break;

        case "Book":
          if (!inputs.weight.trim()) {
            errorMessages.value = "Please provide weight in KG";
          }
          break;

        case "DVD-Disk":
          if (!inputs.size.trim()) {
            errorMessages.value = "Please provide Size in MB";
          }
          break;

        default:
          break;
      }
    }
    setErrorMessages(errorMessages);

    // Check if there are any error messages
    const hasErrors = Object.values(errorMessages).some(
      (message) => message !== ""
    );

    if (!hasErrors) {
      const config = {
        method: "post",
        url: "https://www.screen2script-mag.com/api/product/save",
        data: {
          sku: inputs.sku,
          name: inputs.name,
          price: inputs.price,
          attribute: inputs.attribute,
          value: inputs.value,
        },
      };

      axios(config)
        .then(function (response) {
          console.log(response.config);
          console.log(response.data);

          // clear inputs if success
          if (
            JSON.stringify(response.data) ===
            JSON.stringify({ status: 1, message: "Data created." })
          ) {
            setInputs({
              sku: "",
              name: "",
              price: "",
              attribute: "",
              value: "",
              height: "",
              width: "",
              length: "",
              weight: "",
              size: "",
            });
            Navigate("/");
          }

          // if SKU already exists
          if (
            typeof response.data === "string" &&
            (response.data.includes(
              "Integrity constraint violation: 1048 Column 'SKU' cannot be null"
            ) ||
              response.data.includes(
                "Integrity constraint violation: 1062 Duplicate entry"
              ))
          ) {
            setErrorMessage("SKU already exists!");
          } else {
            setErrorMessage("");
          }
        })
        .catch((err) => {
          console.log(err.config);
          console.log(err);
        });
    }
  };
  return (
    <>
      <header className="addheader">
        <div className="logo">
          <img
            src="../product-manager-app-high-resolution-logo-black-on-transparent-background.png"
            alt="logo"
          />
        </div>
        <h1 className="void">|</h1>
        <h1>Add Product {inputs.sku}</h1>
      </header>
      <div className="addcontainer">
        <div className="">
          <form id="product_form" onSubmit={handleSubmit} className="form">
            <div className="lables">
              <label>SKU </label>
              <input
                id="sku"
                type="text"
                name="sku"
                placeholder=""
                value={inputs.sku}
                onChange={handleChange}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Spacebar") e.preventDefault();
                }}
              />
              {errorMessage && (
                <span className="error-message">{errorMessage}</span>
              )}
              {errorMessages.sku && (
                <span className="error-message">{errorMessages.sku}</span>
              )}
            </div>

            <div className="lables">
              <label>Name </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder=""
                value={inputs.name}
                onChange={handleChange}
              />
              {errorMessages.name && (
                <span className="error-message">{errorMessages.name}</span>
              )}
            </div>
            <div className="lables">
              <label>Price ($)</label>
              <input
                id="price"
                type="number"
                name="price"
                placeholder=""
                value={inputs.price}
                onChange={handleChange}
              />
              {errorMessages.price && (
                <span className="error-message">{errorMessages.price}</span>
              )}
            </div>
            <div className="lables">
              <label>Type switcher</label>
              <select
                id="productType"
                name="attribute"
                value={inputs.attribute}
                onChange={handleOptionChange}
              >
                <option hidden></option>
                {selectedOptions.map((option) => (
                  <option
                    name="attribute"
                    id={option.id}
                    key={option.id}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
              {errorMessages.attribute && (
                <span className="error-message">{errorMessages.attribute}</span>
              )}
            </div>

            {selectedOption === "Furniture" && (
              <>
                <div className="lables">
                  <label>Height (cm)</label>
                  <input
                    id="height"
                    type="number"
                    name="height"
                    value={inputs.height}
                    placeholder=""
                    onChange={handleChange}
                  />

                  {errorMessages.height && (
                    <span className="error-message">
                      {errorMessages.height}
                    </span>
                  )}
                </div>
                <div className="lables">
                  <label>Width (cm)</label>
                  <input
                    id="width"
                    type="number"
                    name="width"
                    value={inputs.width}
                    placeholder=""
                    onChange={handleChange}
                  />
                  {errorMessages.width && (
                    <span className="error-message">{errorMessages.width}</span>
                  )}
                </div>
                <div className="lables">
                  <label>Length (cm)</label>
                  <input
                    id="length"
                    type="number"
                    name="length"
                    value={inputs.length}
                    placeholder=""
                    onChange={handleChange}
                  />
                  {errorMessages.length && (
                    <span className="error-message">
                      {errorMessages.length}
                    </span>
                  )}
                </div>
                <span className="format-text">
                  Please provide dimensions in HxWxL format
                </span>
              </>
            )}
            {selectedOption === "Book" && (
              <>
                <div className="lables">
                  <label>Weight (KG)</label>
                  <input
                    id="weight"
                    type="number"
                    name="weight"
                    value={inputs.weight}
                    placeholder=""
                    onChange={handleChange}
                  />

                  {errorMessages.value && (
                    <span className="error-message">{errorMessages.value}</span>
                  )}
                </div>
                <span className="format-text">Please provide weight in KG</span>
              </>
            )}
            {selectedOption === "DVD-Disk" && (
              <>
                <div className="lables">
                  <label>Size (MB)</label>
                  <input
                    id="size"
                    type="number"
                    name="size"
                    value={inputs.size}
                    placeholder=""
                    onChange={handleChange}
                  />

                  {errorMessages.value && (
                    <span className="error-message">{errorMessages.value}</span>
                  )}
                </div>
                <span className="format-text">Please provide Size in Mb</span>
              </>
            )}

            <div className="buttonsA">
              <input
                className="submit-btn"
                type="submit"
                name="submit"
                value="Save"
              />

              <Link className="submit-btn" to="/">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AddProducts;
