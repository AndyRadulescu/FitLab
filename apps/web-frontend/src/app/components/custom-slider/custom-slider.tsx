import { forwardRef, useState, useEffect } from 'react';
import Slider from 'rc-slider';
import './custom-slider.scss'
// Note: We extend standard props but omit the ones rc-slider handles differently
type SliderProps = {
  label?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
  name?: string;
  onBlur?: () => void;
};

export const CustomSlider = forwardRef<HTMLInputElement, SliderProps>(
  ({ label, error, min = 0, max = 100, value, defaultValue, onChange, ...props }, ref) => {
    const [currentValue, setCurrentValue] = useState(value ?? defaultValue ?? min);

    useEffect(() => {
      if (value !== undefined) {
        setCurrentValue(value);
      }
    }, [value]);

    const handleChange = (val: number | number[]) => {
      const newValue = val as number;
      setCurrentValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    return (
      <div className="w-full mb-6">
        <div className="flex justify-between items-center mb-4">
          {label && (
            <label className="text-sm font-bold text-gray-700 dark:text-white">
              {label}
            </label>
          )}
          <span className="text-xs font-mono font-bold text-gray-700 dark:text-white bg-indigo-50 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">
            {currentValue}
          </span>
        </div>

        <div className="px-2">
          <Slider
            ref={ref}
            min={min}
            max={max}
            value={currentValue}
            onChange={handleChange}
            {...props}
          />
        </div>

        {error && (
          <p className="text-red-500 text-xs mt-2">{error}</p>
        )}
      </div>
    );
  }
);

CustomSlider.displayName = 'CustomSlider';
