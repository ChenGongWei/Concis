import React, { useEffect, useState, useContext, forwardRef } from 'react';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import chunk from 'lodash/chunk';
import type { YearPickerProps, YearItemProps } from './interface';
import Input from '../../Input';
import Popover from '../../Popover';
import { GlobalConfigProps } from '../../GlobalConfig/interface';
import cs from '../../common_utils/classNames';
import { globalCtx } from '../../GlobalConfig';
import { getSiteTheme } from '../../common_utils/storage/getSiteTheme';
import { getRenderColor } from '../../common_utils/getRenderColor';
import { ctx } from '../../Form';
import './index.module.less';

const dayjs = require('dayjs');

const YearPicker = (props, ref) => {
  const {
    className,
    style,
    showClear = false,
    align,
    handleChange,
    disableCheck = () => false,
    format = 'YYYY',
  } = props;
  const [year, setYear] = useState(dayjs().get('year'));
  const [yearList, setYearList] = useState<YearItemProps[][]>([]);
  const [dateValue, setDateValue] = useState('');
  const formCtx = useContext(ctx);

  const { globalColor, prefixCls, darkTheme } = useContext(globalCtx) as GlobalConfigProps;
  const classNames = cs(prefixCls, className, `concis-${darkTheme ? 'dark-' : ''}year-picker`);
  const [clickDate, setClickDate] = useState(new Date());
  useEffect(() => {
    const length12 = new Array(12).fill('');
    setYearList(
      chunk(
        length12.map((_, i) => {
          const date = new Date(year + i, 1, 1);
          return {
            date,
            disable: disableCheck(date),
            value: year + i,
          };
        }),
        3
      )
    );
  }, [year]);
  useEffect(() => {
    // 用于监听Form组件的重置任务
    if (formCtx.reset) {
      setDateValue('');
    }
  }, [formCtx.reset]);
  useEffect(() => {
    if (formCtx.submitStatus) {
      formCtx.getChildVal(dateValue);
    }
  }, [formCtx.submitStatus]);
  const clearCallback = () => {
    setDateValue('');
    handleChange && handleChange(null);
  };
  const setInputVal = (data: YearItemProps) => {
    if (data.disable) {
      return;
    }
    setClickDate(data.date);
    setDateValue(dayjs(data.date).format(format));
    handleChange && handleChange(data.date);
  };

  const isSameDate = (date: Date) => {
    return date.getFullYear() === clickDate.getFullYear();
  };

  return (
    <Popover
      type="click"
      align={align}
      dialogWidth="auto"
      closeDeps={[dateValue]}
      content={
        <div
          className={classNames}
          ref={ref}
          style={
            {
              '--checked-color': getRenderColor(
                (getSiteTheme() === ('dark' || 'auto') || darkTheme) as boolean,
                globalColor
              ),
              ...style,
            } as any
          }
        >
          <div className="year-picker-select">
            <div className="left-select">
              <DoubleLeftOutlined onClick={() => setYear(year - 12)} />
            </div>
            <div className="middle-select">
              <span>{year}</span>-<span>{year + 11}</span>
            </div>
            <div className="right-select">
              <DoubleRightOutlined onClick={() => setYear(year + 12)} />
            </div>
          </div>
          <table>
            <tbody>
              {yearList.map((row, idx) => (
                <tr key={idx}>
                  {row.map((date, i) => (
                    <td
                      key={i}
                      onClick={() => setInputVal(date)}
                      className={`${date.disable ? 'disable' : ''}  ${
                        isSameDate(date.date) ? 'active' : ''
                      }`}
                    >
                      <span>{date.value}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }
    >
      <Input
        placeholder="请选择日期"
        defaultValue={dateValue}
        type="primary"
        showClear={showClear}
        clearCallback={clearCallback}
        isFather
      />
    </Popover>
  );
};

export default forwardRef<unknown, YearPickerProps>(YearPicker);
