"use client";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { PromptSchema } from "./PromptSchema";
import InsertModal from "./InsertCard";
import { PromptCard } from "./PromptCard";
import { PromptsStorage } from "./hooks/PromptsStorage";
import PromptList from "./PromptList";

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
		<div className="flex h-screen w-full">
			{/* Left Sidebar - PromptList */}
			<div className="w-80 bg-gray-50 border-r border-gray-200 overflow-y-auto">
				<div className="p-4">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold">Prompts</h2>
						<Button
							onClick={() => setInsertCardModalOpen(true)}
							size="sm"
							className="ml-2"
						>
							+
						</Button>
					</div>
					<PromptList onOpenPromptCardModal={handleOpenPromptCardModal} />
				</div>
			</div>

			{/* Main Content Area */}
			<div className="flex-1 overflow-y-auto">
				<div className="h-full">
					{/* Other content can go here */}
					{openPrompt && (
						<PromptCard
							prompt={openPrompt}
							onDelete={() => handleDeletePrompt(openPrompt.id)}
						/>
					)}
				</div>
			</div>

			{/* Modals */}
			<InsertModal
				onAddPrompt={handleAddPrompt}
				nextId={nextId}
				isOpen={isInsertCardModalOpen}
				onClose={() => setInsertCardModalOpen(false)}
			/>
		</div>
	);
}
