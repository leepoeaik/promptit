// "use client";

// import { PromptSchema } from "@/app/PromptSchema";
// import { Button } from "@/components/ui/button";
// import {
// 	Dialog,
// 	DialogClose,
// 	DialogContent,
// 	DialogDescription,
// 	DialogFooter,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import { PromptCardModal } from "./PromptCard";

// interface PromptProps {
// 	item: PromptSchema;
// 	onDelete: (id: string) => void;
// }

// export function Prompt({ item, onDelete }: PromptProps) {
// 	function copyPromptToClipboard() {
// 		navigator.clipboard
// 			.writeText(item.content)
// 			.then(() => {
// 				console.log("Prompt copied to clipboard");
// 			})
// 			.catch((error) => {
// 				console.error("Failed to copy prompt: ", error);
// 			});
// 	}
// 	return (
// 		<Dialog>
// 			<form>
// 				<DialogTrigger asChild>
// 					<Button variant="outline" className="w-full">
// 						{item.title}
// 					</Button>
// 				</DialogTrigger>
// 				<DialogContent>
// 					<PromptCardModal prompt={item} onDelete={() => onDelete(item.id)} />
// 				</DialogContent>
// 				<DialogClose asChild>
// 					<Button variant="ghost" className="absolute top-2 right-2">
// 						×
// 					</Button>
// 				</DialogClose>
// 			</form>
// 		</Dialog>
// 		// <div
// 		//     key={item.id}
// 		//     className="flex items-center justify-between p-2 bg-gray-50 rounded border"
// 		// >
// 		//     <span className="text-sm">{item.content}</span>
// 		//     <Button
// 		//         onClick={() => onDelete(item.id)}
// 		//         variant="ghost"
// 		//         size="sm"
// 		//         className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
// 		//     >
// 		//         ×
// 		//     </Button>
// 		// </div>
// 	);
// }
