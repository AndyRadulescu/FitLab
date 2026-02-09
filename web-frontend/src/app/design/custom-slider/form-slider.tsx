import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { CustomSlider } from './custom-slider';

interface FormSliderProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  error?: string;
}

export const FormSlider =
  <T extends FieldValues>({ name, control, ...props }: FormSliderProps<T>) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value, ref }, fieldState: { error } }) => (
          <CustomSlider
            {...props}
            ref={ref}
            value={value}
            onChange={onChange}
            error={error?.message || props.error}
          />
        )}
      />
    );
  };
