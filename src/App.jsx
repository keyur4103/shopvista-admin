import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Users from "./pages/User";
import { Toaster } from "react-hot-toast";
import Products from "./pages/Products";
import ProductAdd from "./components/Product/ProductAdd";
import ProductUpdate from "./components/Product/ProductUpdate";
import Categories from "./pages/Categories";
import Stocks from "./pages/Stocks";
import Orders from "./pages/Orders";
import ProductView from "./components/Product/ProductView";
import PageNotFound from "./utils/PageNotFound";
import Profile from "./pages/Profile";
import FAQ from "./pages/FAQ";
import AddFAQ from "./components/FAQ/AddFAQ";
import EditFAQ from "./components/FAQ/EditFAQ";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<PageNotFound />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/add" element={<ProductAdd />} />
            <Route path="/product/update/:slug" element={<ProductUpdate />} />
            <Route path="/product/:slug" element={<ProductView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/faq/add" element={<AddFAQ />} />
            <Route path="/faq/edit/:id" element={<EditFAQ />} />
          </Route>
        </Routes>
        <Toaster position="top-center" autoClose="3000" />
      </BrowserRouter>
    </>
  );
}

export default App;
