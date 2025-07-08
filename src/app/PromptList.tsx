"use client";

import { Button } from "@/components/ui/button";
import { PromptsStorage } from "./hooks/PromptsStorage";

export default function PromptList({
	onOpenPromptCardModal,
}: {
	onOpenPromptCardModal: (id: string) => void;
}) {
	const { promptsList } = PromptsStorage();
	return (
		<div className="space-y-2">
			<h3 className="text-sm font-medium text-gray-700">Added Items:</h3>
			<div className="space-y-1">
				{promptsList.map((item) => (
					<Button
						key={item.id}
						onClick={() => onOpenPromptCardModal(item.id)}
						className="w-full"
					>
						{item.title || `Untitled ${item.id}`}
					</Button>
				))}
			</div>
		</div>
	);
}
