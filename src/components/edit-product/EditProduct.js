import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProduct.scss";
import { BiArrowBack } from "react-icons/bi";
import { AiFillEdit } from "react-icons/ai";

function EditProduct() {
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
  const [attributeInput, setAttributeInput] = useState("");
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

  useEffect(() => {
    getProduct();
  }, []);
  useEffect(() => {
    console.log(inputs);
  }, [inputs]);
  const { sku } = useParams();

  function getProduct() {
    axios
      .get(`https://www.screen2script-mag.com/api/products/${sku}`)
      .then(function (response) {
        console.log(response.data);

        if (response.data.attribute === "Furniture") {
          const dimensions = response.data.value.split("x");
          if (dimensions.length === 3) {
            setInputs((prevInputs) => ({
              ...prevInputs,
              sku: response.data.sku,
              name: response.data.name,
              price: response.data.price,
              attribute: response.data.attribute,
              value: response.data.value,
              height: dimensions[0],
              width: dimensions[1],
              length: dimensions[2],
            }));
          }
        } else if (response.data.attribute === "DVD-Disk") {
          setInputs((prevInputs) => ({
            ...prevInputs,
            sku: response.data.sku,
            name: response.data.name,
            price: response.data.price,
            attribute: response.data.attribute,
            value: response.data.value,
            size: response.data.value,
          }));
        } else if (response.data.attribute === "Book") {
          setInputs((prevInputs) => ({
            ...prevInputs,
            sku: response.data.sku,
            name: response.data.name,
            price: response.data.price,
            attribute: response.data.attribute,
            value: response.data.value,
            weight: response.data.value,
          }));
        }
      });
  }

  //CHANGE HANDLE
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;

    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));

    setErrorMessages((prevErrorMessages) => ({
      ...prevErrorMessages,
      [name]: "",
    }));

    if (name === "attribute") {
      setSelectedOption(value); // Update the selected option

      if (value === "Book") {
        setInputs((prevInputs) => ({
          ...prevInputs,
          attribute: value,
          value: prevInputs.weight, // Set the value to weight
        }));
      } else if (value === "DVD-Disk") {
        setInputs((values) => ({
          ...values,
          attribute: value,
          value: values.size, // Set the value to size
        }));
      } else {
        setInputs((values) => ({
          ...values,
          attribute: value,
          value: "", // Clear the value
        }));
      }
    }

    // Update dimensions for Furniture
    if (
      (name === "height" || name === "width" || name === "length") &&
      selectedOption === "Furniture"
    ) {
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
      const formattedValue = dimensionValues.join("x");
      setInputs((values) => ({ ...values, value: formattedValue }));
    }

    // Update value for DVD-Disk
    if (name === "size" && selectedOption === "DVD-Disk") {
      setInputs((values) => ({
        ...values,
        value: value,
      }));
    }

    // Update value for Book
    if (name === "weight" && selectedOption === "Book") {
      setInputs((prevInputs) => ({
        ...prevInputs,
        value: value,
      }));
    }
  };

  const handleOptionChange = (event) => {
    const name = event.target.name;
    const option = event.target.value;
    setSelectedOption(option);
    setInputs((values) => ({
      ...values,
      attribute: option,
      value: "", // Clear the value when the attribute changes
      height: "",
      width: "",
      length: "",
      weight: "", // Clear the weight field
      size: "", // Clear the size field
    }));
    setErrorMessages((messages) => ({ ...messages, [name]: "" }));
  };

  //handle submit
  const navigate = useNavigate();
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
        method: "put",
        url: `https://www.screen2script-mag.com/api/product/${sku}/edit`,
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
            JSON.stringify({ status: 1, message: "Data updated." })
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
            navigate("/");
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
      <header className="editheader">
        <div className="logo">
          <img
            src="../product-manager-app-high-resolution-logo-black-on-transparent-background.png"
            alt="logo"
          />
        </div>
        <h1 className="void">|</h1>
        <h1>
          {" "}
          <AiFillEdit />
          Edit Product : {inputs.sku}
        </h1>
      </header>
      <div className="editcontainer">
        <div className="card">
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
                required
              />
              {errorMessage && (
                <span className="error-message">{errorMessage}</span>
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
                required
              />
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
                required
              />
            </div>
            <div className="lables">
              <label>Type switcher</label>
              <select
                id="productType"
                name="attribute"
                value={inputs.attribute}
                onChange={handleOptionChange}
                required
              >
                <option hidden></option>
                {selectedOptions.map((option) => (
                  <option
                    name="attribute"
                    id={option.id}
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {selectedOption === "Furniture" && (
              <>
                <div className="lables">
                  <label>Height (cm)</label>
                  <input
                    required
                    id="height"
                    type="number"
                    name="height"
                    value={inputs.height}
                    placeholder=""
                    onChange={handleChange}
                  />
                </div>
                <div className="lables">
                  <label>Width (cm)</label>
                  <input
                    id="width"
                    required
                    type="number"
                    name="width"
                    value={inputs.width}
                    placeholder=""
                    onChange={handleChange}
                  />
                </div>
                <div className="lables">
                  <label>Length (cm)</label>
                  <input
                    id="length"
                    required
                    type="number"
                    name="length"
                    value={inputs.length}
                    placeholder=""
                    onChange={handleChange}
                  />
                </div>
                <span>Please provide dimensions in HxWxL format</span>
              </>
            )}
            {selectedOption === "Book" && (
              <>
                <div className="lables">
                  <label>Weight (KG)</label>
                  <input
                    required
                    id="weight"
                    type="number"
                    name="weight"
                    value={inputs.weight}
                    placeholder=""
                    onChange={handleChange}
                  />
                </div>
                <span>Please provide weight in KG</span>
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
                <span>Please provide Size in Mb</span>
              </>
            )}

            <div className="buttonsA">
              <input
                className="submit-btn"
                type="submit"
                name="submit"
                value="Update"
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

export default EditProduct;
