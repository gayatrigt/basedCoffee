import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");
  const [fid, setFid] = useState<number | null>(null);

  const createChannel = async (goal: string, fid: number, goalamt: number) => {
    const response = await fetch('https://cryptocoffee-opal.vercel.app/api/create-row', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ goal, fid, goalamt }),
    });

    if (!response.ok) {
      throw new Error('Failed to create channel');
    }

    return response.json();
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fidParam = urlParams.get('fid');
    if (fidParam) {
      setFid(parseInt(fidParam));
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fid) {
      return;
    }

    try {
      const { channel } = await createChannel(goal, fid, parseFloat(amount));

      window.parent.postMessage({
        type: "createCast",
        data: {
          cast: {
            text: `Goal: ${goal}\nAmount: $${amount} USD`,
            embeds: [`https://cryptocoffee-opal.vercel.app/frames/indi/fund/${channel.id}`]
          }
        }
      }, "*");
    } catch (error) {
      console.error('Error creating channel:', error);
    }
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className} bg-white dark:bg-gray-900 text-black dark:text-white`}
    >
      {/* ... (keep your existing header and logo sections) ... */}

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-1 lg:text-left">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium">Goal</label>
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black dark:text-white bg-white dark:bg-gray-800"
              required
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-sm font-medium">Amount (USD)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 text-black dark:text-white bg-white dark:bg-gray-800"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600"
          >
            Create Goal
          </button>
        </form>
      </div>
    </main>
  );
}