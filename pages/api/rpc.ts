import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { NEXT_PUBLIC_RPC_ENDPOINT } = process.env;

  res.status(200).json({ RPC: NEXT_PUBLIC_RPC_ENDPOINT });
}
