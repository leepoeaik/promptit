import { toast } from "sonner";
import { PromptSchema, VariableSchema } from "./PromptSchema";
import { useState, useEffect } from "react";

export function PromptCard({
	prompt,
	onDelete,
}: {
	prompt: PromptSchema;
	onDelete: () => void;
}) {
	const [variableValues, setVariableValues] = useState<VariableSchema[]>(
		prompt.variables || []
	);
	const [finalPrompt, setFinalPrompt] = useState<string>(prompt.content || "");

	useEffect(() => {
		if (prompt.variables && prompt.variables.length > 0) {
			const uniqueVariables = getUniqueVariables(prompt.variables);
			setVariableValues(uniqueVariables);
		} else {
			setVariableValues([]);
		}
	}, [prompt.variables]);

	// Defensive check to ensure variables are always unique
	const getUniqueVariables = (
		variables: VariableSchema[]
	): VariableSchema[] => {
		const uniqueMap = new Map<string, VariableSchema>();

		variables.forEach((variable) => {
			if (!uniqueMap.has(variable.name)) {
				uniqueMap.set(variable.name, {
					name: variable.name,
					value: variable.value || "",
				});
			}
		});

		return Array.from(uniqueMap.values());
	};

	useEffect(() => {
		// Generate the final prompt whenever variable values change
		const generatedPrompt = generateFinalPrompt();
		setFinalPrompt(generatedPrompt);
	}, [variableValues, prompt.content]);

	const handleVariableChange = (index: number, value: string) => {
		setVariableValues((prev) => {
			const newValues = [...prev];
			newValues[index].value = value;
			return newValues;
		});
	};

	const generateFinalPrompt = (): string => {
		if (!variableValues || variableValues.length === 0) {
			return prompt.content;
		}

		let result = prompt.content;

		variableValues.forEach((variable) => {
			const regex = new RegExp(
				`{{\\s*${escapeRegExp(variable.name)}\\s*}}`,
				"g"
			);

			// Replace with the variable value, or keep placeholder if no value
			const replacement = variable.value || `{{ ${variable.name} }}`;
			result = result.replace(regex, replacement);
		});

		return result;
	};

	const escapeRegExp = (string: string): string => {
		return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
	};

	const copyPromptToClipboard = () => {
		navigator.clipboard
			.writeText(finalPrompt)
			.then(() => {
				toast.success("Prompt copied to clipboard");
			})
			.catch((error) => {
				console.error("Failed to copy prompt: ", error);
			});
	};

	const handleDelete = () => {
		onDelete();
		toast.success("Prompt deleted successfully", {
			description: "The prompt has been removed from your list",
		});
	};

	return (
		<div className="flex flex-col h-full p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
			<div className="flex flex-1 flex-row gap-4 overflow-hidden">
				<div className="flex-1 mr-4 overflow-y-auto p-2">
					<h3 className="text-lg font-semibold text-gray-900">
						{prompt.title}
					</h3>
					<p className="text-gray-800">{prompt.content}</p>
					{/* Display variables if they exist */}
					{prompt.variables &&
						prompt.variables.length > 0 &&
						prompt.variables.map((variable, index) => (
							<div key={index} className="mb-4">
								<label
									htmlFor="prompt"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									{variable.name}
								</label>
								<textarea
									id=""
									className="w-full border p-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none whitespace-pre-wrap break-words overflow-y-auto h-20"
									placeholder={variable.name}
									value={variableValues[index].value || ""}
									onChange={(e) => handleVariableChange(index, e.target.value)}
									autoFocus
								/>
							</div>
						))}
				</div>
				{/* Display the prompt content - 50% width with text wrapping */}
				{prompt.variables && prompt.variables.length > 0 && (
					<div className="w-1/2 bg-gray-50 p-3 rounded-md flex flex-col">
						<h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
						<div className="flex-1 overflow-y-auto">
							<p className="text-sm text-gray-600 whitespace-pre-wrap break-words">
								{finalPrompt}
							</p>
						</div>
					</div>
				)}
			</div>
			{/* Action buttons */}
			<div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
				<button
					onClick={handleDelete}
					className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-medium"
				>
					Delete Prompt
				</button>
				<div className="flex gap-3">
					<button
						onClick={copyPromptToClipboard}
						className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
					>
						Copy to Clipboard
					</button>
				</div>
			</div>
		</div>
	);
}
