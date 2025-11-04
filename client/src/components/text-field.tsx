import * as React from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	label?: string;
	error?: string;
	onValue?: (value: string) => void;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const TextField = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, label, type, id, error, onValue, onChange, ...props }, ref) => {
		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			onValue?.(e.target.value);
			onChange?.(e);
		};

		return (
			<div className="w-full">
				{label && (
					<Label htmlFor={id}>
						{label} {props.required && <span className="text-red-600">*</span>}
					</Label>
				)}
				<Input
					{...props}
					type={type}
					ref={ref}
					className={className}
					onChange={handleChange}
				/>
				{error && (
					<p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>
				)}
			</div>
		);
	},
);

TextField.displayName = "TextField";

export { TextField };
