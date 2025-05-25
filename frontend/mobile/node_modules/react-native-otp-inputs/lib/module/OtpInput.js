function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import { Platform, TextInput, View } from 'react-native';
const majorVersionIOS = parseInt(`${Platform.Version}`, 10);
const isOTPSupported = Platform.OS === 'ios' && majorVersionIOS >= 12;
const OtpInput = /*#__PURE__*/forwardRef((_ref, ref) => {
  let {
    autoFocus,
    focusStyles,
    handleKeyPress,
    handleTextChange,
    inputContainerStyles,
    inputStyles,
    inputValue,
    placeholder,
    selectTextOnFocus,
    secureTextEntry,
    ...rest
  } = _ref;
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    var _current;

    ref === null || ref === void 0 ? void 0 : (_current = ref.current) === null || _current === void 0 ? void 0 : _current.setNativeProps({
      value: inputValue,
      text: inputValue,
      secureTextEntry
    });
  }, [ref, inputValue, secureTextEntry]);
  const restProps = useMemo(() => Platform.select({
    default: rest,
    web: {
      value: inputValue,
      ...rest
    }
  }), [inputValue, rest]);
  return (
    /*#__PURE__*/
    // @ts-expect-error
    React.createElement(View, {
      style: [inputContainerStyles, focused && focusStyles]
    }, /*#__PURE__*/React.createElement(TextInput, _extends({
      autoFocus: autoFocus,
      onBlur: () => setFocused(false),
      onChangeText: handleTextChange,
      onFocus: () => setFocused(true),
      onKeyPress: handleKeyPress,
      placeholder: placeholder,
      ref: ref,
      secureTextEntry: secureTextEntry // https://github.com/facebook/react-native/issues/18339
      ,
      selectTextOnFocus: Platform.select({
        ios: selectTextOnFocus,
        android: true
      }),
      style: inputStyles,
      textContentType: isOTPSupported ? 'oneTimeCode' : 'none',
      underlineColorAndroid: "transparent"
    }, restProps)))
  );
});
export default /*#__PURE__*/React.memo(OtpInput);
//# sourceMappingURL=OtpInput.js.map