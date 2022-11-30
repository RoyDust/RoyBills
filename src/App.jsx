import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import NavBar from "@/components/NavBar";
import { ConfigProvider } from "zarm";
import routes from "@/router";

function App() {
  const { pathname } = useLocation(); // 获取当前路径
  const needNav = ["/", "/data", "/user"]; //需要navbar的页面
  const [showNav, setShowNav] = useState(false); //是否显示Nav

  useEffect(() => {
    setShowNav(needNav.includes(pathname));
  }, [pathname]);

  return (
    <>
      <ConfigProvider primaryColor={"#007fff"}>
        <Routes>
          {routes.map((route) => (
            <Route
              exact
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </>
  );
}

export default App;
