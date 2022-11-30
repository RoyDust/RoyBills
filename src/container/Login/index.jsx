import React, { memo, useCallback, useState } from "react";
import { Button, Cell, Checkbox, Input, Toast } from "zarm";
import CustomIcon from "@/components/CustomIcon";
import Captcha from "react-captcha-code";
import { post } from "@/utils";

import s from "./style.module.less";
import cx from "classnames";
import { useNavigate } from "react-router-dom";

const index = memo(() => {
  const [type, setType] = useState("login");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("111111");
  const [verify, setVerify] = useState("");
  const [captcha, setCaptcha] = useState(""); // 验证码变化后的值

  const navigate = useNavigate();

  // 验证码变化回调方法
  const handleChange = useCallback((captcha) => {
    console.log("captcha", captcha);
    setCaptcha(captcha);
  });

  // 注册逻辑
  const onSubmit = async () => {
    if (!username) {
      console.log(username);
      Toast.show("请输入账号");
      return;
    }
    if (!password) {
      Toast.show("请输入密码");
      return;
    }

    try {
      if (type == "login") {
        // 执行登录接口，获取token
        const { data } = await post("/api/user/login", {
          username,
          password,
        });
        console.log(data.token);
        // 将token 写入 localStorage
        localStorage.setItem("token", data.token);
        Toast.show("登录成功");
        navigate("/");
      } else {
        if (!verify) {
          Toast.show("请输入验证码");
          return;
        }
        if (verify != captcha) {
          Toast.show("验证码错误，请重新输入验证码");
          return;
        }
        const { data } = await post("/api/user/register", {
          username,
          password,
        });
        console.log(data);
        Toast.show("注册成功");
      }
    } catch (error) {
      console.log(error);
      Toast.show("系统错误");
    }
  };

  return (
    <div className={s.auth}>
      <div className={s.head} />
      <div className={s.tab}>
        <span
          className={cx({ [s.active]: type == "login" })}
          onClick={() => setType("login")}
        >
          登录
        </span>
        <span
          className={cx({ [s.active]: type == "register" })}
          onClick={() => setType("register")}
        >
          注册
        </span>
      </div>
      <div className={s.form}>
        <Cell icon={<CustomIcon type="zhanghao" />}>
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(value) => setUsername(value)}
          />
        </Cell>
        <Cell icon={<CustomIcon type="mima" />}>
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(value) => setPassword(value)}
          />
        </Cell>
        {type == "register" ? (
          <Cell icon={<CustomIcon type="mima" />}>
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={(value) => setVerify(value)}
            />
            <Captcha charNum={4} onChange={handleChange} />
          </Cell>
        ) : null}
      </div>
      <div className={s.operation}>
        {type == "register" ? (
          <div className={s.agree}>
            <Checkbox />
            <label className="text-light">
              阅读并同意 <a>《用户协议》</a>
            </label>
          </div>
        ) : null}
        <Button block theme="primary" onClick={onSubmit}>
          {type == "login" ? "登录" : "注册"}
        </Button>
      </div>
    </div>
  );
});

export default index;
