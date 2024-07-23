import Image from "next/image";
import { Inter } from "next/font/google";
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [goal, setGoal] = useState("");
  const [amount, setAmount] = useState("");
  const [fid, setFid] = useState<number | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const createChannel = async (goal: string, fid: number, goalamt: number) => {
    const response = await fetch('/api/proxy-create-row', {
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

    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-blue-600 text-white">
      <div className="w-full p-6 flex flex-col items-center">
        <img src="/white-logo.png" alt="" className="w-10 h-10 mb-4" />
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="goal" className="block text-base mb-1 font-integral">What is the Goal for the crowd funding?</label>
            <input
              type="text"
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-gray-900"
              required
              placeholder="Getting more builders on chain"
            />
          </div>
          <div>
            <label htmlFor="amount" className="block text-base mb-1 font-integral">Set the Goal in USD</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-lg text-gray-900"
              required
              placeholder="1000"
            />
          </div>

          {!isLoading && <button
            type="submit"

            className="w-full px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-200 hover:text-blue-800 font-integral font-bold duration-300 ease-in-out select-none"
          >
            Create a Campaign
          </button>}

          {isLoading && <div
            className="w-full px-4 h-[40px] flex items-center justify-center bg-blue-800 text-white rounded-lg font-integral font-bold text-center"
          >
            <span className="loader"></span>
          </div>}
        </form>
      </div>
    </main>
  );
}