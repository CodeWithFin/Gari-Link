import React from 'react';
import { NativeSyntheticEvent, StyleProp, TextInput, TextInputKeyPressEventData, TextInputProps, TextStyle, ViewStyle } from 'react-native';
declare const _default: React.MemoExoticComponent<React.ForwardRefExoticComponent<TextInputProps & {
    inputContainerStyles?: StyleProp<ViewStyle>;
    firstInput: boolean;
    focusStyles?: StyleProp<ViewStyle>;
    inputStyles?: StyleProp<TextStyle>;
    numberOfInputs: number;
    handleTextChange: (text: string) => void;
    inputValue: string;
    handleKeyPress: (keyPressEvent: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
} & React.RefAttributes<TextInput>>>;
export default _default;
