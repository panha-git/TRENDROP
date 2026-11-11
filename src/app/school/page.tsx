"use client";
export default function SchoolPage() {
  fetch("http://localhost:3000/api/school", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          // Handle create school logic here
        }}
      >
        Create School
      </button>
    </div>
  );
}
