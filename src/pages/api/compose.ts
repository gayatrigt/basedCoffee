import type { NextApiRequest, NextApiResponse } from "next";

type ComposerActionFormResponse = {
  type: 'form';
  title: string;
  url: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ComposerActionFormResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { untrustedData, trustedData } = req.body;

  if (!untrustedData || !trustedData || typeof untrustedData.fid !== 'number') {
    return res.status(400).json({ type: 'form', title: 'Error', url: 'http://localhost:3000/error' });
  }

  const { fid } = untrustedData;

  // For local testing, use localhost. For production, use your actual domain.
  const baseUrl = 'https://based-coffee-ca.vercel.app/'

  res.status(200).json({
    type: 'form',
    title: 'dTech.vision',
    url: `${baseUrl}?fid=${fid}`, // Include FID in the URL
  });
}