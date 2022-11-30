import React, { memo } from "react";
import { createForm } from "rc-form";
import { Button, Input, Toast, Cell } from "zarm";
import Header from "@/components/Header";
import { post } from "@/utils";

import s from "./style.module.less";

const index = memo((props) => {
  // Account 通过 createForm  高阶组件包裹之后，可以在props中获取到form属性
  const { getFieldProps, getFieldError } = props.form;

  // 提交修改方法
  const submit = () => {
    // validateFields 获取表单属性元素
    props.form.validateFields(async (error, value) => {
      // error 表单验证全部通过  ，为false ，否则为 ture
      if (!error) {
        console.log(value);
        if (value.newpass != value.newpass2) {
          Toast.show("新密码输入不一致");
          return;
        }
        await post("/api/user/modify_pass", {
          old_pass: value.old_pass,
          new_pass: value.new_pass,
          new_pass2: value.new_pass2,
        });
        Toast.show("修改成功");
      }
    });
  };

  return (
    <>
      <Header title="重置密码" />
      <div className={s.account}>
        <div className={s.form}>
          <Cell title="原密码">
            <Input
              clearable
              type="text"
              placeholder="请输入原密码"
              {...getFieldProps("oldpass", { rules: [{ required: true }] })}
            />
          </Cell>
          <Cell title="新密码">
            <Input
              clearable
              type="text"
              placeholder="请输入新密码"
              {...getFieldProps("newpass", { rules: [{ required: true }] })}
            />
          </Cell>
          <Cell title="确认密码">
            <Input
              clearable
              type="text"
              placeholder="请再次输入新密码"
              {...getFieldProps("newpass2", { rules: [{ required: true }] })}
            />
          </Cell>
        </div>
        <Button className={s.bnt} block theme="primary" onClick={submit}>
          提交
        </Button>
      </div>
    </>
  );
});

export default createForm()(index);
