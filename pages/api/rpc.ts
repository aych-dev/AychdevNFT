import { NextApiRequest, NextApiResponse } from 'next';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const RPC = process.env.NEXT_PUBLIC_RPC_ENDPOINT;

  res.status(200).json({ RPC });
};
