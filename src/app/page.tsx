"use client";
import dynamic from "next/dynamic";

const MainInput = dynamic(() => import("./MainInput"), {
	ssr: false, // This prevents server-side rendering
	loading: () => <div>Loading...</div>, // Optional loading state
});

export default function Page() {
	return (
		<main>
			<MainInput />
		</main>
	);
}
