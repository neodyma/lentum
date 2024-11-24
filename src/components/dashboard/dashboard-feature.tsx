import React, { useState, useEffect } from 'react';
import { AppHero } from '../ui/ui-layout';
import { Coin } from '../../types/Coin';
import { WalletButton } from '../solana/solana-provider';
import TokenActionModal from '../modals/token-action-modal'; // Ensure correct import path

const DashboardFeature: React.FC = () => {
  // State to manage the modal visibility and content
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [action, setAction] = useState<string>('');
  const [isRiskModalOpen, setIsRiskModalOpen] = useState<boolean>(false); // New state for the risk metrics modal

  // Totals and overall risk parameters
  const [totalSupplied, setTotalSupplied] = useState<number>(0);
  const [totalBorrowed, setTotalBorrowed] = useState<number>(0);
  const [overallHealthScore, setOverallHealthScore] = useState<number>(0);

  // Sample data for the assets, including Supply Balance and Supply APY
  const coins: Coin[] = [
    { 
      id: 'bonk',
      name: 'BONK',
      symbol: 'BONK',
      tokenMintAddress: 'AM2UdPbBLBCfr9sShJicSTPSQM8ryq8faioD2oQ6G7t6', // Replace with actual address
      tokenBorrowAddress: 'DXYNfbRaMBerXHLSTygoCEhfiVf7t8S41yxv9HemFw6o',
      currentPrice: 0.00004814,
      supplyBalance: 1000000,
      borrowBalance: 20000,
      dollarValue: 100,
      supplyAPY: 8.0,
      borrowAPY: 10.0,
      liquidationThreshold1: 0.55,
      liquidationThreshold2: 0.65,
      liquidationPenalty: 0.12,
      LTV: 0.45,
      depositAmount: 50000,
      borrowAmount: 20000,
    },
    {
      id: 'jupsol',
      name: 'Jupiter SOL',
      symbol: 'JUPSOL',
      tokenMintAddress: 'Gxisa84BD7nKQtzDXzp1sTzfNeLjaq4qKsnREUdfThGm', // Replace with actual address
      tokenBorrowAddress: 'A4cX4jccYcyDwD7GZm3avn5XXnpqRjCu54TzvBc4Z5aN',
      currentPrice: 25,
      supplyBalance: 200,
      borrowBalance: 20,
      dollarValue: 5000,
      supplyAPY: 6.5,
      borrowAPY: 8.5,
      liquidationThreshold1: 0.58,
      liquidationThreshold2: 0.68,
      liquidationPenalty: 0.09,
      LTV: 0.52,
      depositAmount: 50,
      borrowAmount: 20,
    },
    {
      id: 'chainlink',
      name: 'Chainlink',
      symbol: 'LINK',
      tokenMintAddress: '4v1Et7kKSRAAkkPkwCBpY7KKX3bMKNFarZFZR36R1tPy', // Replace with actual address
      tokenBorrowAddress:'ArWGLKUuQvH1pb4YVGVQrmGoEAyrgtjrTqrZsNGjV5TD',
      currentPrice: 7.5,
      supplyBalance: 300,
      borrowBalance: 30,
      dollarValue: 2250,
      supplyAPY: 7.0,
      borrowAPY: 9.0,
      liquidationThreshold1: 0.6,
      liquidationThreshold2: 0.7,
      liquidationPenalty: 0.1,
      LTV: 0.5,
      depositAmount: 75,
      borrowAmount: 30,
    },
    {
      id: 'solana',
      name: 'Solana',
      symbol: 'SOL',
      tokenMintAddress: '3aXXx5qmuHgmkWUe5M3ZHM98Jb48GqjiCtHZWddbVTir', // Replace with actual address
      tokenBorrowAddress: 'CHBAHKVCUpnqpc77DRvwKy6jM14VbTBXzwVaJsFHboq6',
      currentPrice: 150,
      supplyBalance: 500,
      borrowBalance: 50,
      dollarValue: 75000,
      supplyAPY: 5.5,
      borrowAPY: 7.5,
      liquidationThreshold1: 0.6,
      liquidationThreshold2: 0.7,
      liquidationPenalty: 0.1,
      LTV: 0.5,
      depositAmount: 150,
      borrowAmount: 50,
    },
    {
      id: 'usdc',
      name: 'USD Coin',
      symbol: 'USDC',
      tokenMintAddress: 'BERfP22tJmnRaR59FpyT5usNsPqg2TxCu8FHWQLFZdCr', // Replace with actual address
      tokenBorrowAddress: '2fmHzMKos8ARSxkj76EParQpjqFzAM2G4AbKSAJsArNx',
      currentPrice: 1,
      supplyBalance: 1000000,
      borrowBalance: 200000,
      dollarValue: 1000000,
      supplyAPY: 2.0,
      borrowAPY: 4.0,
      liquidationThreshold1: 0.7,
      liquidationThreshold2: 0.8,
      liquidationPenalty: 0.05,
      LTV: 0.6,
      depositAmount: 500000,
      borrowAmount: 200000,
    },
    {
      id: 'usdt',
      name: 'Tether',
      symbol: 'USDT',
      tokenMintAddress: '3aXXx5qmuHgmkWUe5M3ZHM98Jb48GqjiCtHZWddbVTir', // Replace with actual address
      tokenBorrowAddress: 'ESdK2cJGTU8Pf1zSc3cuZvmEv5vqPJJa6gJPTh1kfx3v',
      currentPrice: 1,
      supplyBalance: 2000000,
      borrowBalance: 400000,
      dollarValue: 2000000,
      supplyAPY: 1.8,
      borrowAPY: 3.8,
      liquidationThreshold1: 0.7,
      liquidationThreshold2: 0.8,
      liquidationPenalty: 0.05,
      LTV: 0.6,
      depositAmount: 1000000,
      borrowAmount: 400000,
    },
    {
      id: 'wif', // Ensure this ID is correct; replace if necessary
      name: 'DogWithHat', // Placeholder name; replace with actual name
      symbol: 'WIF',
      tokenMintAddress: '7wVt229Gzhm5JCFPLnTMDqb4NY8D6YKp3JeqzWqCRBeQ', // Replace with actual address
      tokenBorrowAddress: '3BgPKLcBnp59oibVmAcEzihx1Hn1r6rmepk6WMeySYoz',
      currentPrice: 3.11,
      supplyBalance: 750000,
      borrowBalance: 120000,
      dollarValue: 1500000,
      supplyAPY: 3.0,
      borrowAPY: 5.0,
      liquidationThreshold1: 0.65,
      liquidationThreshold2: 0.75,
      liquidationPenalty: 0.06,
      LTV: 0.55,
      depositAmount: 300000,
      borrowAmount: 120000,
    },
  ];
  
    
  useEffect(() => {
    const totalSuppliedCalc = coins.reduce((acc, coin) => acc + coin.supplyBalance, 0);
    const totalBorrowedCalc = coins.reduce((acc, coin) => acc + coin.borrowBalance, 0);

    setTotalSupplied(totalSuppliedCalc);
    setTotalBorrowed(totalBorrowedCalc);

    setOverallHealthScore(1.1);
  }, [coins]);

  const handleActionClick = (coin: Coin, actionType: string) => {
    setSelectedCoin(coin);
    setAction(actionType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCoin(null);
    setAction('');
  };

  const toggleRiskModal = () => {
    setIsRiskModalOpen(!isRiskModalOpen);
  };

  return (
    <div>
      <div className="flex justify-end p-4">
        <WalletButton />
      </div>

      <AppHero title="Asset Dashboard" subtitle="View and manage your assets" />
        <div className="px-4 py-6 mx-auto max-w-7xl">
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
    {/* Total Supplied */}
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-sm font-medium text-gray-500 text-center">Total Supplied</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900 text-center">
        {totalSupplied.toLocaleString()}
      </p>
    </div>

    {/* Overall Health Score */}
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-sm font-medium text-gray-500 text-center">Overall Health Score</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900 text-center">
        {overallHealthScore}
      </p>
    </div>

    {/* Total Borrowed */}
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-sm font-medium text-gray-500 text-center">Total Borrowed</h3>
      <p className="mt-1 text-2xl font-semibold text-gray-900 text-center">
        {totalBorrowed.toLocaleString()}
      </p>
    </div>
  </div>

</div>

  
        <div className="grid grid-cols-1 gap-6 px-4 py-6 mx-auto sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl">
          {coins.map((coin) => (
            <div key={coin.id} className="p-6 bg-white rounded shadow">
              <h2 className="mb-2 text-xl font-semibold text-center">{coin.name}</h2>
              <p className="mb-4 text-lg text-center text-gray-700">
                ${coin.currentPrice.toLocaleString()}
              </p>
              <div className="mb-4 border-b pb-4">
                <h3 className="mb-2 text-lg font-medium text-center text-green-600">Supply</h3>
                <div className="mb-2">
                  <p className="text-center text-gray-500">Supply Balance</p>
                  <p className="text-xl font-medium text-center">{coin.supplyBalance.toLocaleString()}</p>
                  <p className="text-center text-gray-700">
                    ${coin.dollarValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-center text-gray-500">Supply APY</p>
                  <p className="text-xl font-medium text-center text-green-500">{coin.supplyAPY}%</p>
                </div>
              </div>
  
              <div>
                <h3 className="mb-2 text-lg font-medium text-center text-red-600">Borrow</h3>
                <div className="mb-2">
                  <p className="text-center text-gray-500">Borrow Balance</p>
                  <p className="text-xl font-medium text-center">{coin.borrowBalance.toLocaleString()}</p>
                  <p className="text-center text-gray-700">
                    ${ (coin.borrowBalance * coin.currentPrice).toLocaleString() }
                  </p>
                </div>
                <div>
                  <p className="text-center text-gray-500">Borrow APY</p>
                  <p className="text-xl font-medium text-center text-red-500">{coin.borrowAPY}%</p>
                </div>
              </div>
  
              <div className="flex flex-wrap justify-center space-x-2 mt-4">
                <button
                  className="px-3 py-1 text-white bg-blue-500 rounded hover:bg-blue-600 m-1"
                  onClick={() => handleActionClick(coin, 'Deposit')}
                >
                  Deposit
                </button>
                <button
                  className="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600 m-1"
                  onClick={() => handleActionClick(coin, 'Lend')}
                >
                  Borrow
                </button>
                <button
                  className="px-3 py-1 text-white bg-orange-500 rounded hover:bg-orange-600 m-1"
                  onClick={() => handleActionClick(coin, 'Withdraw')}
                >
                  Withdraw
                </button>
                <button
                  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600 m-1"
                  onClick={() => handleActionClick(coin, 'Repay')}
                >
                  Repay
                </button>
              </div>
            </div>
          ))}
        </div>
  
        {isModalOpen && selectedCoin && (
          <TokenActionModal
            coin={selectedCoin}
            action={action}
            onClose={closeModal}
          />
        )}
      </div>
    );
  };
  
  export default DashboardFeature;