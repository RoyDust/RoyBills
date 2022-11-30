import React, { memo, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header"; // 由于是内页，所以要公用头部
import axios from "axios"; // 采用form-data 传递参数，所以直接用axios进行请求
import { get, post, imgUrlTrans } from "@/utils";
import { baseUrl } from "config"; // 由于使用原生axios，统一封装了请求baseUrl
import { Button, FilePicker, Input, Toast } from "zarm";

import s from "./style.module.less";

const index = memo(() => {
  const navigateTo = useNavigate();
  const [user, setUser] = useState({}); // 用户
  const [avatar, setAvatar] = useState(""); // 头像
  const [signature, setSignature] = useState(""); // 个性签名
  const token = localStorage.getItem("token"); // 登录令牌

  useEffect(() => {
    getUserInfo(); // 初始化请求
  }, []);

  // 获取用户信息
  const getUserInfo = async () => {
    const { data } = await get("/api/user/get_userinfo");
    setUser(data);
    setAvatar(imgUrlTrans(data.avatar));
    setSignature(data.signature);
  };
  // 上传图片
  const handleSelect = (file) => {
    console.log("file", file);
    if (file && file.file.size > 200 * 1024) {
      Toast.show("上传头像不得超过200kb！");
      return;
    }
    let formData = new FormData();
    // 通过 axios 设置  'Content-Type': 'multipart/form-data', 进行文件上传
    formData.append("file", file.file);
    axios({
      method: "post",
      url: `${baseUrl}/upload`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    }).then((res) => {
      // 返回图片地址
      setAvatar(imgUrlTrans(res.data));
    });
  };
  // 编辑用户信息方法
  const save = async () => {
    const { data } = await post("/api/user/edit_userinfo", {
      signature,
      avatar,
    });
    Toast.show("修改成功");
    navigateTo(-1);
  };

  return (
    <>
      <Header title="用户信息" />
      <div className={s.userinfo}>
        <h1>个人资料</h1>
        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img className={s.avatarUrl} src={avatar} alt="" />
            <div className={s.desc}>
              <span>支持jpg、png、jpeg格式大小200kb以内的图片</span>
              <FilePicker
                className={s.filePicker}
                onChange={handleSelect}
                accept="image/*"
              >
                <Button className={s.upload} theme="primary" size="xs">
                  点击上传
                </Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value) => setSignature(value)}
            />
          </div>
        </div>
        <Button onClick={save} style={{ marginTop: 50 }} block theme="primary">
          保存
        </Button>
      </div>
    </>
  );
});

export default index;
