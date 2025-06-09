"use client";

import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from "react";
import { PromptSchema } from "./PromptSchema";

export default function InsertModal({
	onAddPrompt,
	nextId,
	isOpen,
	onClose,
}: {
	onAddPrompt: (newPrompt: PromptSchema) => void;
	nextId: number;
	isOpen: boolean;
	onClose: () => void;
}) {
	const [title, setTitle] = useState("");
	const [promptText, setPromptText] = useState("");

	// Handle escape key to close modal
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				handleCancel();
			}
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			return () => document.removeEventListener("keydown", handleEscape);
		}
	}, [isOpen, onClose]);

	// Handle backdrop click to close modal
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			handleCancel();
		}
	};

	const handleAdd = () => {
		// Handle the add logic here
		if (promptText.trim()) {
			const newPrompt: PromptSchema = {
				id: `prompt-${nextId}`, // Unique ID based on timestamp
				title: title || `Untitled ${nextId}`, // Default title if empty
				content: promptText.trim(),
				variables: extractVariables(promptText.trim()), // Extract variables from the prompt text
			};
			onAddPrompt(newPrompt);
			resetInput();
			onClose();
		}
	};

	function extractVariables(prompt: string): string[] {
		const variableRegex = /{{.*?}}/g;
		const matches = prompt.match(variableRegex);
		return matches
			? matches.map((match) => match.replace(/{{|}}/g, "").trim())
			: [];
	}

	const handleAddVariables = () => {
		setPromptText(promptText + " {{ variable }} ");
		// Optionally, you can set the cursor position to the end of the text area
		// set cursor to highlight the work "variable"
		const textarea = document.getElementById("prompt") as HTMLTextAreaElement;
		if (textarea) {
			textarea.focus();
		}
	};

	const handleCancel = () => {
		resetInput();
		onClose();
	};

	function resetInput() {
		setTitle("");
		setPromptText("");
	}

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50"
			onClick={handleBackdropClick}
		>
			<div className="bg-white rounded-lg p-6 w-96 max-w-[90vw] shadow-xl">
				<h3 className="text-lg font-semibold mb-4">Add New Prompt</h3>

				<div className="mb-4">
					<label
						htmlFor="prompt"
						className="block text-sm font-medium text-gray-700 mb-2"
					>
						Title
					</label>
					<input
						id="title"
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
						placeholder="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						// onChange={(e) => setPromptText(e.target.value)}
						autoFocus
					/>
				</div>

				<div className="mb-4">
					<div className="flex items-center justify-between mb-2">
						<label
							htmlFor="prompt"
							className="block text-sm font-medium text-gray-700 mb-2"
						>
							Prompt Text
						</label>

						<Button onClick={handleAddVariables}>Add Variables</Button>
					</div>
					<textarea
						id="prompt"
						rows={4}
						className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
						placeholder="Enter your prompt here..."
						value={promptText}
						onChange={(e) => setPromptText(e.target.value)}
						autoFocus
					/>
				</div>

				<div className="flex gap-3 justify-end">
					<Button variant="outline" onClick={handleCancel}>
						Cancel
					</Button>
					<Button onClick={handleAdd} disabled={!promptText.trim()}>
						Add
					</Button>
				</div>
			</div>
		</div>
	);
}
