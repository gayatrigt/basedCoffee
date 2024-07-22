import type { NextApiRequest, NextApiResponse } from "next";

type ComposerActionFormResponse = {
  type: 'form';
  title: string;
  url: string;
}

type ComposerActionMetadata = {
  type: "composer";
  name: string;
  icon: string;
  description: string;
  imageUrl: string;
  aboutUrl?: string;
  action: {
    type: "post";
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ComposerActionFormResponse | ComposerActionMetadata>
) {

  if (req.method === 'GET') {
    const metadata: ComposerActionMetadata = {
      type: "composer",
      name: "BasedCoffee",
      icon: "rocket",
      description: "Create a Crowd Fund",
      imageUrl: "https://based-coffee-ca.vercel.app/favicon.png",
      action: {
        type: "post"
      }
    };
    return res.status(200).json(metadata);
  }

  if (req.method === 'POST') {
    const { untrustedData, trustedData } = req.body;

    if (!untrustedData || !trustedData || typeof untrustedData.fid !== 'number') {
      return res.status(400).json({ type: 'form', title: 'Error', url: 'https://based-coffee-ca.vercel.app' });
    }

    const { fid } = untrustedData;

    // For local testing, use localhost. For production, use your actual domain.
    const baseUrl = 'https://based-coffee-ca.vercel.app'

    res.status(200).json({
      type: 'form',
      title: 'BasedCoffee',
      url: `${baseUrl}?fid=${fid}`, // Include FID in the URL
    });
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}