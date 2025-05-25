import { fillOtpCode } from './helpers';
const ACTION_TYPES = {
  setHandleChange: 'setHandleChange',
  setOtpTextForIndex: 'setOtpTextForIndex',
  setOtpCode: 'setOtpCode',
  clearOtp: 'clearOtp',
  setHasKeySupport: 'setHasKeySupport'
};
export default ((state, _ref) => {
  let {
    type,
    payload
  } = _ref;

  switch (type) {
    case ACTION_TYPES.setOtpTextForIndex:
      {
        const otpCode = { ...state.otpCode,
          [`${payload.index}`]: payload.text
        };
        state.handleChange(Object.values(otpCode).join(''));
        return { ...state,
          otpCode
        };
      }

    case ACTION_TYPES.setOtpCode:
      {
        const otpCode = fillOtpCode(payload.numberOfInputs, payload.code);
        state.handleChange(Object.values(otpCode).join(''));
        return { ...state,
          otpCode
        };
      }

    case ACTION_TYPES.clearOtp:
      {
        const otpCode = fillOtpCode(payload);
        state.handleChange(Object.values(otpCode).join(''));
        return { ...state,
          otpCode
        };
      }

    case ACTION_TYPES.setHandleChange:
      {
        return { ...state,
          handleChange: payload
        };
      }

    case ACTION_TYPES.setHasKeySupport:
      {
        return { ...state,
          hasKeySupport: payload
        };
      }

    default:
      return state;
  }
});
//# sourceMappingURL=reducer.js.map