export interface PromptSchema {
	title: string;
	id: string;
	content: string;
	variables: string[]; // Optional: Array of variable names used in the prompt
}
