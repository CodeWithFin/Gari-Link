"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillOtpCode = void 0;

const fillOtpCode = (numberOfInputs, value) => {
  const otpCode = {};

  for (let i = 0; i < numberOfInputs; i++) {
    otpCode[`${i}`] = (value === null || value === void 0 ? void 0 : value[i]) || '';
  }

  return otpCode;
};

exports.fillOtpCode = fillOtpCode;
//# sourceMappingURL=helpers.js.map