"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PromptSchema } from "./PromptSchema";
import InsertModal from "./InsertCard";
import { PromptCardModal } from "./PromptCard";
import { PromptsStorage } from "./hooks/PromptsStorage";

export default function MainInput() {
	const { promptsList, nextId, addPrompt, deletePrompt } = PromptsStorage();
	const [isInsertCardModalOpen, setInsertCardModalOpen] =
		useState<boolean>(false);
	const [openPromptCardModalId, setOpenPromptCardModalId] = useState<
		string | null
	>(null);
	const [openPrompt, setOpenPrompt] = useState<PromptSchema | null>(null);

	useEffect(() => {
		if (openPromptCardModalId) {
			const prompt = promptsList.find(
				(item) => item.id === openPromptCardModalId
			);
			setOpenPrompt(prompt || null);
		} else {
			setOpenPrompt(null);
		}
	}, [openPromptCardModalId]);

	const handleAddPrompt = (newPrompt: PromptSchema) => {
		addPrompt(newPrompt);
		toast.success("Prompt added successfully", {
			description: "The prompt has been added to your list",
		});
	};

	const handleOpenPromptCardModal = (id: string): void => {
		setOpenPromptCardModalId(id);
	};

	const handleClosePromptModal = (): void => {
		setOpenPromptCardModalId(null);
	};

	const handleDeletePrompt = async (idToDelete: string): Promise<void> => {
		try {
			deletePrompt(idToDelete);
			toast.success("Prompt deleted successfully", {
				description: "The prompt has been removed from your list",
			});
		} catch (error) {
			// Handle error during deletion
			console.error("Error deleting prompt:", error);
			toast.error("Failed to delete prompt", {
				description:
					"Please try again or contact support if the issue persists",
			});
		}
	};

	return (
		<div className="w-full max-w-md mx-auto p-6 space-y-4">
			{/* Input section */}
			<div className="flex w-full items-center gap-2">
				<div className="flex flex-col items-center justify-center h-full">
					<Button
						onClick={() => setInsertCardModalOpen(true)}
						className="w-full"
					>
						Add Prompt
					</Button>
				</div>
			</div>

			{/* Display submitted values */}
			<div className="space-y-2">
				<h3 className="text-sm font-medium text-gray-700">Added Items:</h3>
				<div className="space-y-1">
					{promptsList.map((item) => (
						<Button
							key={item.id}
							onClick={() => handleOpenPromptCardModal(item.id)}
							className="w-full"
						>
							{item.title || `Untitled ${item.id}`}
						</Button>
					))}
				</div>
			</div>

			<InsertModal
				onAddPrompt={handleAddPrompt}
				nextId={nextId}
				isOpen={isInsertCardModalOpen}
				onClose={() => setInsertCardModalOpen(false)}
			/>

			{openPrompt && (
				<PromptCardModal
					prompt={openPrompt}
					isOpen={!!openPromptCardModalId}
					onClose={handleClosePromptModal}
					onDelete={() => handleDeletePrompt(openPrompt.id)}
				/>
			)}
		</div>
	);
}
