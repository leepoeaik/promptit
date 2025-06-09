import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Main } from "next/document";
import { useState } from "react";
import MainInput from "./MainInput";

export default function Page() {
    return (
        <main>
            <MainInput />
        </main>
    );
}