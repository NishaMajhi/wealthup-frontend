"use client";
import React, { useEffect, useState } from "react";
import { useCodes } from "../../store/useCodes";
import { useRouter } from "next/navigation";

export default function CardPage() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [userEnteredCode, setUserEnteredCode] = useState("");
  const [message, setMessage] = useState("");
  const [copy, setCopy] = useState("");
  const { codes, setCodes } = useCodes();

  useEffect(() => {
    fetchCode();
  }, []);

  const router = useRouter();
  const fetchCode = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/codes`
      );
      const data = await response.json();
      if (response.ok) {
        setGeneratedCode(data.code);
      } else {
        throw new Error(data.error || "Failed to fetch code");
      }
    } catch (error) {
      console.error("Error fetching code:", error.message);
      setMessage("Failed to fetch code. Please try again later.");
    }
  };

  const refreshCode = () => {
    fetchCode();
    setMessage("");
  };

  const handleCodeChange = (e) => {
    setUserEnteredCode(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/codes/use`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code: userEnteredCode }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setCodes([...codes, userEnteredCode]);
        setMessage(data?.message);

        setTimeout(() => {
          if (data?.message == "Code is correct") {
            router.push("/codes");
          }
        }, 2000);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.error("Error submitting code:", error.message);
      setMessage("Failed to submit code. Please try again later.");
    }
  };

  const copyCodeToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopy("Copied");
    setTimeout(() => {
      setCopy(""); // Clear the message after 1 second
    }, 1000);
  };

  return (
    <div className="bg-indigo-500 w-max p-5 rounded-[15px]">
      <div className="flex items-center gap-3 mb-4">
        <p>
          Copy code:{" "}
          <span className="px-2 py-1 bg-gray-300 rounded-lg ">
            {generatedCode}
          </span>
        </p>

        <p onClick={() => copyCodeToClipboard()} className="cursor-pointer">
          <svg
            viewBox="0 0 1024 1024"
            fill="currentColor"
            height="1.6em"
            width="1.6em"
          >
            <path d="M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32zM704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z" />
          </svg>{" "}
        </p>

        <svg
          fill="none"
          viewBox="0 0 15 15"
          height="1.5em"
          width="1.5em"
          onClick={() => refreshCode()}
          className="cursor-pointer"
        >
          <path
            stroke="currentColor"
            d="M.5 7.5A7 7 0 0113 3.17m1.5 4.33A7 7 0 012 11.83m3-.33H1.5V15m12-15v3.5H10"
          />
        </svg>
      </div>
      {copy && (
        <div className="text-green-700-900 ">
          <p>{copy}</p>
        </div>
      )}
      <div className="flex items-center gap-3">
        <p>Input Name:</p>{" "}
        <input
          type="text"
          onChange={handleCodeChange}
          class="relative bg-gray-50ring-0 outline-none border border-neutral-500 text-neutral-900  text-sm rounded-lg    block w-64 p-2.5 checked:bg-emerald-500"
          placeholder="enter code"
        />
        <button
          className="bg-indigo-900 px-4 py-2 rounded-[10px] text-white font-medium"
          onClick={() => handleSubmit()}
        >
          Submit
        </button>
      </div>
      {message == "Code is correct" ? (
        <div className="text-white-900 ">{message}</div>
      ) : (
        <div className="text-red-900 ">{message}</div>
      )}
    </div>
  );
}
