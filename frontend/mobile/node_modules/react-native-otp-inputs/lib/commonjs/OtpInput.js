"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const majorVersionIOS = parseInt(`${_reactNative.Platform.Version}`, 10);
const isOTPSupported = _reactNative.Platform.OS === 'ios' && majorVersionIOS >= 12;
const OtpInput = /*#__PURE__*/(0, _react.forwardRef)((_ref, ref) => {
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
  const [focused, setFocused] = (0, _react.useState)(false);
  (0, _react.useEffect)(() => {
    var _current;

    ref === null || ref === void 0 ? void 0 : (_current = ref.current) === null || _current === void 0 ? void 0 : _current.setNativeProps({
      value: inputValue,
      text: inputValue,
      secureTextEntry
    });
  }, [ref, inputValue, secureTextEntry]);
  const restProps = (0, _react.useMemo)(() => _reactNative.Platform.select({
    default: rest,
    web: {
      value: inputValue,
      ...rest
    }
  }), [inputValue, rest]);
  return (
    /*#__PURE__*/
    // @ts-expect-error
    _react.default.createElement(_reactNative.View, {
      style: [inputContainerStyles, focused && focusStyles]
    }, /*#__PURE__*/_react.default.createElement(_reactNative.TextInput, _extends({
      autoFocus: autoFocus,
      onBlur: () => setFocused(false),
      onChangeText: handleTextChange,
      onFocus: () => setFocused(true),
      onKeyPress: handleKeyPress,
      placeholder: placeholder,
      ref: ref,
      secureTextEntry: secureTextEntry // https://github.com/facebook/react-native/issues/18339
      ,
      selectTextOnFocus: _reactNative.Platform.select({
        ios: selectTextOnFocus,
        android: true
      }),
      style: inputStyles,
      textContentType: isOTPSupported ? 'oneTimeCode' : 'none',
      underlineColorAndroid: "transparent"
    }, restProps)))
  );
});

var _default = /*#__PURE__*/_react.default.memo(OtpInput);

exports.default = _default;
//# sourceMappingURL=OtpInput.js.map