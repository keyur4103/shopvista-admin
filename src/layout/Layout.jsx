import { useEffect } from "react";
import Aside from "./Aside/Aside";
import Header from "./Header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Layout = () => {
  const navigate = useNavigate();
  const isLoggedIn =
    useSelector((state) => state.token) || localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
  }, []);

  return (
    <div>
      <Header />
      <Aside />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
