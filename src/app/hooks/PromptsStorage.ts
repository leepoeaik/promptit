// hooks/usePromptsPersistence.ts
import { useState, useEffect } from "react";
import { PromptSchema } from "../PromptSchema";

const STORAGE_KEY = "promptsList";
const NEXT_ID_KEY = "promptsNextId";

interface PromptsStorageReturn {
	promptsList: PromptSchema[];
	nextId: number;
	addPrompt: (prompt: PromptSchema) => void;
	deletePrompt: (id: string) => void;
}

export const PromptsStorage = (): PromptsStorageReturn => {
	const [promptsList, setPromptsList] = useState<PromptSchema[]>([]);
	const [nextId, setNextId] = useState<number>(1);
	const [isLoading, setIsLoading] = useState(true);

	// Storage operations
	const loadFromStorage = (): PromptSchema[] => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : [];
		} catch (error) {
			console.error("Error loading prompts from storage:", error);
			return [];
		}
	};

	const loadNextIdFromStorage = (): number => {
		try {
			const stored = localStorage.getItem(NEXT_ID_KEY);
			return stored ? parseInt(stored, 10) : 1;
		} catch (error) {
			console.error("Error loading next ID from storage:", error);
			return 1;
		}
	};

	const saveToStorage = (prompts: PromptSchema[]) => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
		} catch (error) {
			console.error("Error saving prompts to storage:", error);
		}
	};

	const saveNextIdToStorage = (id: number) => {
		try {
			localStorage.setItem(NEXT_ID_KEY, id.toString());
		} catch (error) {
			console.error("Error saving next ID to storage:", error);
		}
	};

	// Initialize from storage
	useEffect(() => {
		const storedPrompts = loadFromStorage();
		const storedNextId = loadNextIdFromStorage();

		setPromptsList(storedPrompts);
		setNextId(storedNextId);
		setIsLoading(false);
	}, []);

	// Auto-save when data changes
	useEffect(() => {
		if (!isLoading) {
			saveToStorage(promptsList);
			saveNextIdToStorage(nextId);
		}
	}, [promptsList, isLoading]);

	// Actions
	const addPrompt = (newPrompt: PromptSchema) => {
		setPromptsList((prev) => [...prev, newPrompt]);
		setNextId((prev) => prev + 1);
	};

	const deletePrompt = (idToDelete: string) => {
		setPromptsList((prev) => prev.filter((item) => item.id !== idToDelete));
		// Optionally, you can also update nextId if you want to avoid gaps
		if (promptsList.length === 1 && promptsList[0].id === idToDelete) {
			setNextId(1); // Reset nextId if the last prompt is deleted
		}
		saveToStorage(promptsList.filter((item) => item.id !== idToDelete));
	};

	return {
		promptsList,
		nextId,
		addPrompt,
		deletePrompt,
	};
};
