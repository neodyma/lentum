# Lentum

# User Journey

## 1. Deposit Assets
Step 1: Connect your wallet.
Step 2: Choose the asset (e.g., Sol, USDC, Bonk) to deposit and specify the amount.
Step 3: Approve the transaction and confirm the deposit.
### Contract Interaction:
Get LTokens get minted() when deposited, they earn intrest and can be brunded when repaid()

## 2. View Portfolio Parameters
After depositing, the platform calculates personalized risk metrics based on your portfolio:
### Dynamic Parameters:
TLV, liqThreshold, liqBonus, APYDeposit, APYBorrow
## 3. Borrow Against Portfolio
Step 1: Choose the asset you want to borrow.
Step 2: Specify the borrowing amount.
The app calcuates on the percentage of ongoing loans the percentage of colateral to be used. based on the ration conside the usd amount of all coletarl to the pair  calcuate the risk parmaters and the tlv allowed.
Step 3: Approve the transaction and confirm.
Contract Interaction:

### 4. Portfolio Health Monitoring
The platform provides a dashboard to monitor:
Real-time LTV
Liquidation thresholds
Asset performance
Contract Interaction:

Calls the getPortfolioData() function on the Analytics Contract (AC).
## 5. Repay Loans or Withdraw Collateral
Step 1: Repay borrowed assets burn bororw token
Step 2: Withdraw collateral if portfolio health allows.


Calls the repay() or withdrawCollateral() function on the respective contracts.
Technical Details

Contracts Overview
Contract Name	Purpose
Asset Vault Contract (AVC)	Manages user deposits and collateral balances.
Portfolio Risk Optimization Contract (PROC)	Calculates and updates risk metrics dynamically.
Loan Contract (LC)	Handles borrowing and repayments.
Analytics Contract (AC)	Provides real-time portfolio data and metrics.
Parameter Calculation
LTV: Based on deposit amount, asset volatility, and liquidity.
Formula: LTV = (Collateral Value * Collateral Weight) / Debt
liqThreshold: Adjusted dynamically by PROC based on portfolio diversification.
Formula: liqThreshold = Base Threshold + Volatility Modifier
Reserve Factor: Derived from the overall risk profile of the portfolio.
Formula: Reserve Factor = Average Risk Score / Total Portfolio Value
Testing and Debugging

Clone the repository and deploy the contracts on a local Ethereum testnet (e.g., Hardhat or Ganache).
Run unit tests for each contract interaction:
npm run test
Deploy to a testnet (e.g., Goerli) and verify interactions with a front-end or CLI.
