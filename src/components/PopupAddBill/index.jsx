import type from "postcss-pxtorem/lib/type";
import React, { forwardRef, memo, useEffect, useRef, useState } from "react";
import cx from "classnames";
import { Popup, Icon, Keyboard } from "zarm";
import PopupDate from "../PopupDate";
import dayjs from "dayjs";
import CustomIcon from "../CustomIcon";
import { get, post, typeMap } from "@/utils";
import { Input } from "zarm";
import { Toast } from "zarm";

import s from "./style.module.less";

const PopupAddBill = forwardRef(({ detail = {}, onReload }, ref) => {
  const [show, setShow] = useState(false);
  const [payType, setPayType] = useState("expense"); // 收入支出
  const [date, setDate] = useState(new Date()); // 日期
  const [amount, setAmount] = useState(""); // 金额
  const [currentType, setCurrentType] = useState({}); // 当前选中账单类型
  const [expense, setExpense] = useState([]); // 支出类型数组
  const [income, setIncome] = useState([]); // 收入类型数组
  const [remark, setRemark] = useState(""); // 备注
  const [showRemark, setShowRemark] = useState(false); // 备注输入框展示控制
  const id = detail && detail.id; // 外部传进来的账单详情 id

  const dateRef = useRef();

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }

  useEffect(async () => {
    const {
      data: { list },
    } = await get("/api/type/list");
    const _expense = list.filter((i) => i.type == 1);
    const _income = list.filter((i) => i.type == 2);
    setExpense(_expense);
    setIncome(_income);
    if (!id) {
      setCurrentType(_expense[0]);
    }
  }, []);

  useEffect(() => {
    if (detail.id) {
      setPayType(detail.pay_type == 1 ? "expense" : "income");
      setCurrentType({
        id: detail.type_id,
        name: detail.type_name,
      });
      setRemark(detail.remark);
      setAmount(detail.amount);
      setDate(dayjs(Number(detail.date)).$d);
    }
  }, [detail]);

  // type改变
  const changeType = (type) => {
    setPayType(type);
  };
  // 选择日期
  const selectDate = (val) => {
    setDate(val);
  };
  // 监听输入法改变值
  const handleMoney = (value) => {
    value = String(value);
    // 点击是删除按钮时
    if (value == "delete") {
      let _amount = amount.slice(0, amount.length - 1);
      setAmount(_amount);
      return;
    }
    // 点击确定按钮时
    if (value == "ok") {
      addBill();
      return;
    }
    // 当输入的值为'.',且已经存在'.',则不让其继续字符串相加。
    if (value == "." && amount.includes(".")) return;
    // 小数点后保留两位,当超过两位时，不让其字符串继续添加。
    if (
      value != "." &&
      amount.includes(".") &&
      amount &&
      amount.split(".")[1].length >= 2
    )
      return;
    // amount += value
    setAmount(amount + value);
  };

  // 添加账单
  const addBill = async () => {
    if (!amount) {
      Toast.show("请输入金额");
      return;
    }
    const params = {
      amount: Number(amount).toFixed(2), //账单金额小数点后保留两位
      type_id: currentType.id, // 账单种类id
      type_name: currentType.name, // 账单种类名称
      date: dayjs(date).unix() * 1000, // 日期传时间戳
      pay_type: payType == "expense" ? 1 : 2, // 账单类型传1或2
      remark: remark || "", // 备注
    };

    if (id) {
      params.id = id;
      // 如果有id需要调用详情更新接口
      const res = await post("/api/bill/update", params);
      Toast.show("修改成功");
    } else {
      const res = await post("/api/bill/add", params);
      // 重置数据
      setAmount("");
      setPayType("expense");
      setCurrentType(expense[0]);
      setDate(new Date());
      setRemark("");
      Toast.show("添加成功");
    }
    setShow(false);
    if (props.onReload) props.onReload();
  };

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.addWrap}>
        {/* 关闭按钮 */}
        <header className={s.header}>
          <span className={s.close} onClick={() => setShow(false)}>
            <Icon type="wrong" />
          </span>
        </header>
        {/* 收入和支出类型切换 */}
        <div className={s.filter}>
          <div className={s.type}>
            <span
              onClick={() => changeType("expense")}
              className={cx({
                [s.expense]: true,
                [s.active]: payType == "expense",
              })}
            >
              支出
            </span>
            <span
              onClick={() => changeType("income")}
              className={cx({
                [s.income]: true,
                [s.active]: payType == "income",
              })}
            >
              收入
            </span>
          </div>
          <div
            className={s.time}
            onClick={() => dateRef.current && dateRef.current.show()}
          >
            {dayjs(date).format("MM-DD")}
            <Icon className={s.arrow} type="arrow-bottom" />
          </div>
        </div>
        <div className={s.money}>
          <span className={s.sufix}>￥</span>
          <span className={cx(s.amount, s.animation)}>{amount}</span>
        </div>
        <div className={s.typeWarp}>
          <div className={s.typeBody}>
            {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
            {(payType == "expense" ? expense : income).map((item) => (
              <div
                onClick={() => setCurrentType(item)}
                key={item.id}
                className={s.typeItem}
              >
                {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                <span
                  className={cx({
                    [s.iconfontWrap]: true,
                    [s.expense]: payType == "expense",
                    [s.income]: payType == "income",
                    [s.active]: currentType.id == item.id,
                  })}
                >
                  <CustomIcon
                    className={s.iconfont}
                    type={typeMap[item.id].icon}
                  />
                </span>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        <div className={s.remark}>
          {showRemark ? (
            <Input
              autoHeight
              showLength
              maxLength={50}
              type="text"
              rows={3}
              value={remark}
              placeholder="请输入备注信息"
              onChange={(val) => setRemark(false)}
              onBlur={() => setShowRemark(false)}
            />
          ) : (
            <span onClick={() => setShowRemark(true)}>
              {remark || "添加备注"}
            </span>
          )}
        </div>
        <Keyboard type="price" onKeyClick={(value) => handleMoney(value)} />
        <PopupDate ref={dateRef} onSelect={selectDate} />
      </div>
    </Popup>
  );
});

export default PopupAddBill;
