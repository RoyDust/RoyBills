import Home from "@/container/Home";
import Data from "@/container/Data";
import User from "@/container/User";
import Login from "@/container/Login";
import Detail from "@/container/Detail";
import UserInfo from "@/container/UserInfo";
import About from "@/container/About";
import Account from "@/container/Account";

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/data",
    component: Data,
  },
  {
    path: "/user",
    component: User,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/detail",
    component: Detail,
  },
  {
    path: "/userInfo",
    component: UserInfo,
  },
  {
    path: "/about",
    component: About,
  },
  {
    path: "/account",
    component: Account,
  },
];

export default routes;
