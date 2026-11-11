"use client";
import { useParams } from "next/navigation";
export default function SchoolDetail() {
    const { id } = useParams();
    return (
        <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <h1 className="text-2xl font-bold">School Detail Page</h1>
            <p>School ID: {}</p>
        </div>
    );
}
