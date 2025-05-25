import { Actions, ReducerState } from './types';
declare const _default: (state: ReducerState, { type, payload }: Actions) => {
    handleChange: any;
    otpCode: {
        [key: string]: string;
    };
    hasKeySupport: boolean;
};
export default _default;
