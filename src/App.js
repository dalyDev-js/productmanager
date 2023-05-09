import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.scss";

import ProductList from "./components/product-list/ProductList";
import AddProducts from "./components/product-details/AddProduct";
import EditProduct from "./components/edit-product/EditProduct";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<ProductList />} />
          <Route path="add-product" element={<AddProducts />} />
          <Route path={`edit-product/:sku`} element={<EditProduct />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
