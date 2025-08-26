// ...existing code...
"use client";
import React from "react";

export default function Home() {
  const [response1, setResponse1] = React.useState("");
  const [response2, setResponse2] = React.useState("");
  const endpoint1 = process.env.NEXT_PUBLIC_API_ENDPOINT_1;
  const endpoint2 = process.env.NEXT_PUBLIC_API_ENDPOINT_2;

  const callApi1 = async () => {
    try {
      const res = await fetch(endpoint1);
      const data = await res.text();
      setResponse1(data);
    } catch (err) {
      setResponse1("Error: " + err.message);
    }
  };

  const callApi2 = async () => {
    try {
      const res = await fetch(endpoint2);
      const data = await res.text();
      setResponse2(data);
    } catch (err) {
      setResponse2("Error: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <h1 className="text-2xl font-bold mb-4">Simple Next.js API Demo</h1>
      <div className="flex gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={callApi1}
        >
          Call API 1
        </button>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={callApi2}
        >
          Call API 2
        </button>
      </div>
      <div className="w-full max-w-xl mt-8">
        <div className="mb-4">
          <h2 className="font-semibold">API 1 Response:</h2>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap break-words">{response1}</pre>
        </div>
        <div>
          <h2 className="font-semibold">API 2 Response:</h2>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap break-words">{response2}</pre>
        </div>
      </div>
    </div>
  );
}
