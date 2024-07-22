import { useState, FormEvent } from 'react';
import type { ComposerActionState } from "frames.js/types";


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

export default function CreateChannelForm({
  searchParams,
}: {
  searchParams: {
    state: string;
    uid: string;
  };
}) {
  const [goal, setGoal] = useState('');
  const [amount, setAmount] = useState('');
  const composerActionState = JSON.parse(searchParams.state) as ComposerActionState;

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const fid = JSON.parse(searchParams.uid) as number
      const channel = await createChannel(goal, fid, parseFloat(amount));

      console.log(composerActionState, fid)

      // Use the full URL as specified
      const newFrameUrl = `https://cryptocoffee-opal.vercel.app/frames/indi/fund/${channel.id}`;

      // Prepare the data for the cast
      const castData = {
        type: "createCast",
        data: {
          cast: {
            ...composerActionState,
            text: `Goal: ${goal}\nAmount: $${amount} USD`,
            embeds: [...composerActionState.embeds, newFrameUrl],
          },
        },
      };

      // Post message to parent window
      window.parent.postMessage(castData, "*");
    } catch (error) {
      console.error('Error creating channel:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Channel</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <label htmlFor="goal" className="font-semibold">Goal</label>
        <input
          id="goal"
          name="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="rounded border border-slate-800 p-2"
          placeholder="Enter your goal"
          required
        />

        <label htmlFor="amount" className="font-semibold">Amount (USD)</label>
        <input
          id="amount"
          name="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded border border-slate-800 p-2"
          placeholder="Enter amount"
          required
        />

        <button className="rounded bg-slate-800 text-white p-2" type="submit">
          Create Channel
        </button>
      </form>
    </div>
  );
}