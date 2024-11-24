import React, { useState } from 'react';
import { Coin } from '../../types/Coin';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';

interface TokenActionModalProps {
  coin: Coin;
  action: string;
  onClose: () => void;
}

const TokenActionModal: React.FC<TokenActionModalProps> = ({ coin, action, onClose }) => {
  const { publicKey, sendTransaction } = useWallet();
  const [amount, setAmount] = useState<string>('');

  const connection = new Connection('https://api.mainnet-beta.solana.com');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleAddTokenToWallet = async () => {
    if (!publicKey || !sendTransaction) {
      console.error('Wallet not connected');
      alert('Wallet not connected. Please connect your wallet.');
      return;
    }

    if (!amount) {
      alert('Please enter an amount.');
      return;
    }

    try {
      const tokenMintAddress = new PublicKey(coin.tokenMintAddress);

      // Get the associated token account address for the user's wallet
      const associatedTokenAddress = await getAssociatedTokenAddress(
        tokenMintAddress,
        publicKey
      );

      // Check if the associated token account exists
      const accountInfo = await connection.getAccountInfo(associatedTokenAddress);

      if (accountInfo === null) {
        // The account doesn't exist, so we need to create it
        const ataInstruction = createAssociatedTokenAccountInstruction(
          publicKey, // Payer
          associatedTokenAddress, // ATA Address
          publicKey, // Owner
          tokenMintAddress // Mint
        );

        const transaction = new Transaction().add(ataInstruction);

        // Send the transaction
        const signature = await sendTransaction(transaction, connection);

        // Confirm the transaction
        await connection.confirmTransaction(signature, 'confirmed');
        console.log(`Created associated token account: ${associatedTokenAddress.toBase58()}`);
      } else {
        console.log('Associated token account already exists');
      }

      console.log(`Added ${coin.name} to wallet with amount: ${amount}`);

      alert(`${coin.name} added to wallet successfully with amount ${amount}.`);
      onClose();
    } catch (error) {
      console.error('Error adding token to wallet:', error);
      alert('An error occurred while adding the token to your wallet. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="w-full max-w-md p-6 mx-auto bg-white rounded shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">
            {action} {coin.name}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-4">
          <p>
            You are about to <strong>{action.toLowerCase()}</strong> <strong>{coin.name}</strong>.
          </p>

          {/* Amount Input Field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
            onClick={handleAddTokenToWallet}
          >
            Add {coin.symbol.toUpperCase()} to Wallet
          </button>
          <button
            className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenActionModal;
