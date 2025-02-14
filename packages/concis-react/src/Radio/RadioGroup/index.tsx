import React, { useState, useCallback, useContext, forwardRef } from 'react';
import type { RadioItemProps, RadioGroupProps } from '../interface';
import Input from '../../Input';
import { GlobalConfigProps } from '../../GlobalConfig/interface';
import cs from '../../common_utils/classNames';
import { globalCtx } from '../../GlobalConfig';
import { getSiteTheme } from '../../common_utils/storage/getSiteTheme';
import { getRenderColor } from '../../common_utils/getRenderColor';
import './index.module.less';

const RadioGroup = (props, ref) => {
  const {
    children,
    style,
    className,
    value,
    canAddOption,
    addOptionText = 'More...',
    boxStyle,
    onChange,
  } = props;

  const [selectIndex, setSelectIndex] = useState(value || 0); // 选中索引
  const [renderOptions, setRenderOptions] = useState(children);
  const [addOptionVal, setAddOptionVal] = useState('');
  const [showAddOption, setShowAddOption] = useState(canAddOption);

  const { globalColor, prefixCls, darkTheme } = useContext(globalCtx) as GlobalConfigProps;
  const theme = getSiteTheme();

  const classNames = cs(prefixCls, className, `concis-${darkTheme ? 'dark-' : ''}radio-group`);

  const changeOptions = (item: RadioItemProps, i: number, e: any) => {
    if (item.disabled) return;
    e && e.stopPropagation();
    setSelectIndex(i);
    onChange && onChange(item, i);
    canAddOption && setShowAddOption(false);
  };
  const addOptions = () => {
    // 新增options
    setSelectIndex(renderOptions.length);
    setShowAddOption(true);
  };
  const handleKeyDown = (e: any) => {
    // 新增确认
    if (e.keyCode === 13 && addOptionVal) {
      setRenderOptions((old) => {
        const addOption = {
          props: {
            children: addOptionVal,
          },
        };
        return [...old, addOption];
      });
      setShowAddOption(false);
    }
  };
  const handleIptChange = (val: string) => {
    // 新增输入框
    setAddOptionVal(val);
  };
  const boxStyleClassName = useCallback(
    (props: RadioItemProps, i: number) => {
      if (props.disabled) {
        return 'groupDisabledStyle';
      }
      if (i === selectIndex) {
        return 'groupActive';
      }
      return 'groupStyle';
    },
    [children, boxStyle, value, selectIndex]
  );

  return (
    <div
      className={classNames}
      style={
        {
          ...style,
          '--global-color': getRenderColor(theme === ('auto' || 'dark'), globalColor),
        } as any
      }
      ref={ref}
    >
      {renderOptions.map((item: any, index: number) => {
        return boxStyle ? (
          <div
            className={boxStyleClassName(item.props, index)}
            style={item.props.disabled ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
            key={index}
            onClick={(e) => changeOptions(item.props, index, e)}
          >
            {item.props.children}
          </div>
        ) : (
          <div
            className="radioBox"
            style={item.props.disabled ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
            key={index}
            onClick={(e) => changeOptions(item.props, index, e)}
          >
            <div
              className={selectIndex === index ? 'radio-checked' : 'radio'}
              style={item.props.disabled ? { cursor: 'not-allowed' } : { cursor: 'pointer' }}
            />
            <span className={item.props.disabled ? 'disabledLabel' : 'radioLabel'}>
              {item.props.children}
            </span>
          </div>
        );
      })}
      {
        // 新增Options项(优雅之王)
        canAddOption ? (
          boxStyle ? (
            <div className="addOption">
              <div
                className={selectIndex === renderOptions.length ? 'groupActive' : 'groupStyle'}
                onClick={addOptions}
              >
                {addOptionText}
              </div>
              {showAddOption && (
                <Input handleKeyDown={handleKeyDown} handleIptChange={handleIptChange} />
              )}
            </div>
          ) : (
            <div className="addOption">
              <div className="radioBox" onClick={addOptions}>
                <div className={selectIndex === renderOptions.length ? 'radio-checked' : 'radio'} />
                <span className="radioLabel">{addOptionText}</span>
              </div>
              {showAddOption && (
                <Input handleKeyDown={handleKeyDown} handleIptChange={handleIptChange} />
              )}
            </div>
          )
        ) : (
          <></>
        )
      }
    </div>
  );
};

export default forwardRef<unknown, RadioGroupProps>(RadioGroup);
