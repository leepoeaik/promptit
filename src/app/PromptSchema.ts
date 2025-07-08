export interface PromptSchema {
	title: string;
	id: string;
	content: string;
	variables: VariableSchema[];
}
export interface VariableSchema {
	name: string;
	value: string;
}
