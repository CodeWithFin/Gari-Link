declare type SetOtpTextForIndex = {
    type: 'setOtpTextForIndex';
    payload: {
        index: number;
        text: string;
    };
};
declare type SetOtpCode = {
    type: 'setOtpCode';
    payload: {
        numberOfInputs: number;
        code: string;
    };
};
declare type ClearOtp = {
    type: 'clearOtp';
    payload: number;
};
declare type SetHandleChange = {
    type: 'setHandleChange';
    payload: any;
};
declare type SetHasKeySupport = {
    type: 'setHasKeySupport';
    payload: boolean;
};
export declare type ReducerState = {
    otpCode: {
        [key: string]: string;
    };
    handleChange: (otpCode: string) => void;
    hasKeySupport: boolean;
};
export declare type ActionTypes = {
    setHandleChange: 'setHandleChange';
    setOtpTextForIndex: 'setOtpTextForIndex';
    setOtpCode: 'setOtpCode';
    clearOtp: 'clearOtp';
    setHasKeySupport: 'setHasKeySupport';
};
export declare type Actions = SetOtpTextForIndex | SetOtpCode | ClearOtp | SetHandleChange | SetHasKeySupport;
export declare type OtpInputsRef = {
    reset: () => void;
    focus: () => void;
};
export declare type KeyEventType = {
    action: number;
    pressedKey: string;
    keyCode: number;
};
export declare type SupportedKeyboardType = 'default' | 'email-address' | 'phone-pad' | 'visible-password' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'name-phone-pad' | 'twitter' | 'web-search' | undefined;
export {};
