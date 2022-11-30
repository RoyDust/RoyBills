import React, { forwardRef, memo, useState } from "react";
import PropsTypes from "prop-types";
import dayjs from "dayjs";
import { DatePicker, Popup } from "zarm";

const PopupDate = forwardRef(({ onSelect, mode = "date" }, ref) => {
  const [show, setShow] = useState(false);
  const [now, setNow] = useState(new Date());

  const choseMonth = (item) => {
    setNow(item);
    setShow(false);
    if (mode == "month") {
      onSelect(dayjs(item).format("YYYY-MM"));
    } else if (mode == "date") {
      onSelect(dayjs(item).format("YYYY-MM-DD"));
    }
  };

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

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div>
        <DatePicker
          visible={show}
          value={now}
          mode={mode}
          onOk={choseMonth}
          onCancel={() => setShow(false)}
        />
      </div>
    </Popup>
  );
});

PopupDate.propTypes = {
  mode: PropsTypes.string, // 日期模式
  onSelect: PropsTypes.func, // 选择后的回调函数
};

export default PopupDate;
