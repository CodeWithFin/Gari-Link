import { Text, TextInput, View } from 'react-native';
import { twMerge } from 'tailwind-merge';
import { Controller, Control } from 'react-hook-form';

interface FormInputProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  className?: string;
  rules?: object;
}

export function FormInput({
  control,
  name,
  label,
  placeholder,
  secureTextEntry,
  className,
  rules
}: FormInputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-700 mb-1 font-medium">{label}</Text>
      )}
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              secureTextEntry={secureTextEntry}
              className={twMerge(
                'px-4 py-3 rounded-lg bg-gray-100',
                'border border-gray-200',
                error && 'border-red-500',
                className
              )}
            />
            {error && (
              <Text className="text-red-500 text-sm mt-1">
                {error.message}
              </Text>
            )}
          </>
        )}
      />
    </View>
  );
}
