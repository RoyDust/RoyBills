import React, { forwardRef, memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { get } from "../../utils";
import { Icon, Popup } from "zarm";

import s from "./style.module.less";

const PopupType = forwardRef(({ onSelect }, ref) => {
  const [show, setShow] = useState(false); // 弹窗显示与关闭
  const [active, setActive] = useState("all"); // 激活的type
  const [expense, setExpense] = useState([]); // 支出标签
  const [income, setIncome] = useState([]); // 收入标签

  useEffect(async () => {
    // 请求接口放在弹窗内，这个弹窗可能会被复用，所以请求如果在外面可能会造成代码冗余
    const {
      data: { list },
    } = await get("/api/type/list");
    setExpense(list.filter((i) => i.type == 1));
    setIncome(list.filter((i) => i.type == 2));
  }, []);

  if (ref) {
    // 留给外面的操控组件显示方法
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }

  // 选择类型回调
  const choseType = (item) => {
    setActive(item.id);
    setShow(false);
    // 父组件传入的onSelect，为了获取类型
    onSelect(item);
  };

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型：
          <Icon
            type="wrong"
            className={s.cross}
            onClick={() => setShow(false)}
          />
        </div>
        <div className={s.content}>
          <div
            onClick={() => choseType({ id: "all" })}
            className={cx({ [s.all]: true, [s.active]: active == "all" })}
          >
            全部类型
          </div>
          <div className={s.title}>支出</div>
          <div className={s.expenseWrap}>
            {expense.map((item, index) => (
              <p
                key={index}
                onClick={() => choseType(item)}
                className={cx({ [s.active]: active == item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
          <div className={s.title}>收入</div>
          <div className={s.incomeWrap}>
            {income.map((item, index) => (
              <p
                key={index}
                onClick={() => choseType(item)}
                className={cx({ [s.active]: active == item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  );
});

PopupType.propTypes = {
  onSelect: PropTypes.func,
};

export default PopupType;
