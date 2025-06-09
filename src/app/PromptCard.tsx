import { toast } from "sonner";
import { PromptSchema } from "./PromptSchema";
import { useState, useEffect } from "react";

export function PromptCardModal({
	prompt,
	isOpen,
	onClose,
	onDelete,
}: {
	prompt: PromptSchema;
	isOpen: boolean;
	onClose: () => void;
	onDelete: () => void;
}) {
	const [variableValues, setVariableValues] = useState<string[]>([]);

	useEffect(() => {
		if (prompt.variables && prompt.variables.length > 0) {
			setVariableValues(new Array(prompt.variables.length).fill(""));
		} else {
			setVariableValues([]);
		}
	}, [prompt.variables]);

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [isOpen, onClose]);

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	const handleVariableChange = (index: number, value: string) => {
		setVariableValues((prev) => {
			const newValues = [...prev];
			newValues[index] = value;
			return newValues;
		});
	};

	const generateFinalPrompt = (): string => {
		if (!prompt.variables || prompt.variables.length === 0) {
			return prompt.content;
		}

		let finalPrompt = prompt.content;

		// Find all variable placeholders in the content
		const regex = /{{ *[^}]+? *}}/g;
		const matches = [...finalPrompt.matchAll(regex)];

		// Replace each match by index (from right to left to avoid index shifting)
		for (let i = matches.length - 1; i >= 0; i--) {
			const match = matches[i];
			const value = variableValues[i] || "";

			if (match.index !== undefined) {
				// Replace this specific occurrence with the value at this index
				finalPrompt =
					finalPrompt.slice(0, match.index - 1) +
					(value || match[0]) +
					finalPrompt.slice(match.index + match[0].length);
			}
		}

		return finalPrompt;
	};

	const copyPromptToClipboard = () => {
		navigator.clipboard
			.writeText(generateFinalPrompt())
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
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50"
			onClick={handleBackdropClick}
		>
			{/* Modal content */}
			<div className="flex flex-col p-4 bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
				<div className="flex flex-row gap-4">
					<div className="flex-1 mr-4">
						<h3 className="text-lg font-semibold text-gray-900">
							{prompt.title}
						</h3>
						<p className="text-gray-800">{prompt.content}</p>

						{/* Display variables if they exist */}
						{prompt.variables &&
							prompt.variables.length > 0 &&
							prompt.variables.map((variable, index) => (
								<div className="mb-4">
									<label
										htmlFor="prompt"
										className="block text-sm font-medium text-gray-700 mb-2"
									>
										{variable}
									</label>
									<input
										id=""
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
										placeholder={variable}
										value={variableValues[index] || ""}
										onChange={(e) =>
											handleVariableChange(index, e.target.value)
										}
										autoFocus
									/>
								</div>
							))}
					</div>
					{/* Display the prompt content */}
					{prompt.variables && prompt.variables.length > 0 && (
						<div className="bg-gray-50 p-3 rounded-md">
							<h4 className="text-sm font-medium text-gray-700 mb-2">
								Preview:
							</h4>
							<p className="text-sm text-gray-600 whitespace-pre-wrap">
								{generateFinalPrompt()}
							</p>
						</div>
					)}
				</div>
				<div className="mt-4 flex flex-col justify-between min-h-[200px]">
					<div className="flex gap-4 justify-end">
						<button
							onClick={copyPromptToClipboard}
							className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
						>
							Copy
						</button>
						<button
							onClick={handleDelete}
							className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
						>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
