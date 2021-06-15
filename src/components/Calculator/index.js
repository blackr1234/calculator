import { useState, useEffect } from "react";
import "./index.css";
import { CalculatorButton } from "../CalculatorButton";

function Calculator(props) {
	const [output, setOutput] = useState("0");
	const [equation, setEquation] = useState("0");

	// when the equation has changed, recalculate the output
	useEffect(() => {
		try {
			// prettier-ignore
			let newEquation = equation.replace(/−/g, "-")
								      .replace(/×/g, "*")
									  .replace(/÷/g, "/");

			const openBracketCount = (equation.match(/\(/g) || []).length;
			const closeBracketCount = (equation.match(/\)/g) || []).length;
			const missingCloseBracketCount = openBracketCount - closeBracketCount;

			// autofill close brackets to display output of undone equation
			for (let i = 0; i < missingCloseBracketCount; i++) {
				newEquation += ")";
			}

			// eslint-disable-next-line no-eval
			setOutput(eval(newEquation));
		} catch (err) {}
	}, [equation]);

	const removeLastChar = (e) => e.substring(0, e.length - 1);

	const endsWith = (str, chars) => new RegExp(`[${chars}]$`).test(str);

	const handleClickAC = () => {
		setEquation("0");
	};

	const handleClickBackspace = () => {
		setEquation(removeLastChar(equation) || "0");
	};

	const handleClickOpenBracket = () => {
		// if equation is init value, replace it
		if (equation === "0") {
			setEquation("(");
			return;
		}

		// if equation ends with an operator or an open bracket, add the open bracket
		if (endsWith(equation, "+−×÷(")) {
			setEquation(equation + "(");
			return;
		}

		// if equation ends with a digit or a close bracket, append an additional multiplication operator
		if (endsWith(equation, "\\d)")) {
			setEquation(equation + "×(");
			return;
		}

		// if equation ends with a dot, replace it with a multiplication operator
		if (endsWith(equation, ".")) {
			setEquation(removeLastChar(equation) + "×(");
		}
	};

	const handleClickCloseBracket = () => {
		// if equation ends with an operator or an open bracket, do nothing
		if (endsWith(equation, "+−×÷(")) {
			return;
		}

		const openBracketCount = (equation.match(/\(/g) || []).length;
		const closeBracketCount = (equation.match(/\)/g) || []).length;

		// if the number of open brackets is not greater than the number of close brackets, do nothing
		if (openBracketCount <= closeBracketCount) {
			return;
		}

		// if equation ends with a dot, remove it
		if (endsWith(equation, ".")) {
			setEquation(removeLastChar(equation) + ")");
			return;
		}

		setEquation(equation + ")");
	};

	const handleClickDot = () => {
		// if equation ends with a close bracket, do nothing
		if (endsWith(equation, ")")) {
			return;
		}

		// if equation ends with an open bracket, append an additional digit 0
		if (endsWith(equation, "(")) {
			setEquation(equation + "0.");
			return;
		}

		// if equation ends with an operator, append an additional digit 0
		if (endsWith(equation, "+−×÷")) {
			setEquation(equation + "0.");
			return;
		}

		// if the last number contains a dot, do nothing
		const splits = equation.split(/[+−×÷]/g);
		if (/\./.test(splits[splits.length - 1])) {
			return;
		}

		// if equation ends with a digit, add the dot
		if (endsWith(equation, "\\d")) {
			setEquation(equation + ".");
			return;
		}
	};

	const handleClickOperator = (e) => {
		// if equation is init value and operator is subtraction, replace equation with subtraction operator
		if (equation === "0" && e === "−") {
			setEquation("−");
			return;
		}

		// if equation is subtraction operator and operator is subtraction, replace equation with digit 0
		if (equation === "−" && e === "−") {
			setEquation("0");
			return;
		}

		// if equation ends with an operator and operator is substraction, append an additional open bracket
		if (endsWith(equation, "+−×÷") && e === "−") {
			setEquation(equation + "(−");
			return;
		}

		// if equation ends with an open bracket and operator is not substraction, do nothing
		if (endsWith(equation, "(") && e !== "−") {
			return;
		}

		// if equation ends with an operator that does not follow an open bracket, replace it
		if (/[^(][+−×÷]$/.test(equation)) {
			setEquation(removeLastChar(equation) + e);
			return;
		}

		// if equation ends with a dot, remove it
		if (endsWith(equation, ".")) {
			setEquation(removeLastChar(equation) + e);
			return;
		}

		// if equation ends with a digit or a bracket, add the operator
		if (endsWith(equation, "\\d()")) {
			setEquation(equation + e);
			return;
		}
	};

	const handleClickDigit = (e) => {
		// if equation is init value, replace it
		if (equation === "0") {
			setEquation(e);
			return;
		}

		// if equation ends with a close bracket, do nothing
		if (endsWith(equation, ")")) {
			return;
		}

		// if equation ends with digit 1~9, a dot or an open bracket, add the digit
		if (endsWith(equation, "1-9+−×÷.(")) {
			setEquation(equation + e);
			return;
		}

		// if equation ends with a decimal number or a whole number that starts with digit 1~9, add the digit
		if (/\.\d+$/.test(equation) || /[1-9]\d*$/.test(equation)) {
			setEquation(equation + e);
			return;
		}

		// if equation ends with number 0, replace it
		if (endsWith(equation, "0")) {
			setEquation(removeLastChar(equation) + e);
			return;
		}
	};

	return (
		<table>
			<thead>
				<tr>
					<th colSpan={4} style={{ textAlign: "right" }}>
						{String(
							Number(output).toLocaleString("en-US", {
								minimumFractionDigits: 0,
								maximumFractionDigits: 10,
							})
						)}
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td colSpan={4} style={{ textAlign: "right" }}>
						{equation}
					</td>
				</tr>
				<tr>
					<CalculatorButton onClick={() => handleClickAC()}>AC</CalculatorButton>
					<CalculatorButton onClick={() => handleClickOpenBracket()}>(</CalculatorButton>
					<CalculatorButton onClick={() => handleClickCloseBracket()}>)</CalculatorButton>
					<CalculatorButton operator onClick={() => handleClickBackspace()}>
						⌫
					</CalculatorButton>
				</tr>
				<tr>
					<CalculatorButton onClick={() => handleClickDigit("7")}>7</CalculatorButton>
					<CalculatorButton onClick={() => handleClickDigit("8")}>8</CalculatorButton>
					<CalculatorButton onClick={() => handleClickDigit("9")}>9</CalculatorButton>
					<CalculatorButton operator onClick={() => handleClickOperator("÷")}>
						÷
					</CalculatorButton>
				</tr>
				<tr>
					<CalculatorButton onClick={() => handleClickDigit("4")}>4</CalculatorButton>
					<CalculatorButton onClick={() => handleClickDigit("5")}>5</CalculatorButton>
					<CalculatorButton onClick={() => handleClickDigit("6")}>6</CalculatorButton>
					<CalculatorButton operator onClick={() => handleClickOperator("×")}>
						×
					</CalculatorButton>
				</tr>
				<tr>
					<CalculatorButton onClick={() => handleClickDigit("1")}>1</CalculatorButton>
					<CalculatorButton onClick={() => handleClickDigit("2")}>2</CalculatorButton>
					<CalculatorButton onClick={() => handleClickDigit("3")}>3</CalculatorButton>
					<CalculatorButton operator onClick={() => handleClickOperator("−")}>
						−
					</CalculatorButton>
				</tr>
				<tr>
					<CalculatorButton colSpan={2} onClick={() => handleClickDigit("0")}>
						0
					</CalculatorButton>
					<CalculatorButton onClick={() => handleClickDot()}>.</CalculatorButton>
					<CalculatorButton operator onClick={() => handleClickOperator("+")}>
						+
					</CalculatorButton>
				</tr>
			</tbody>
		</table>
	);
}

export default Calculator;
export { Calculator };
