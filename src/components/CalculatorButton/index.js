import "./index.css";

function CalculatorButton(props) {
	const { children, operator, ...rest } = props;

	return (
		<td className={operator ? "calculator-button-operator" : "calculator-button"} {...rest}>
			{children}
		</td>
	);
}

export default CalculatorButton;
export { CalculatorButton };
