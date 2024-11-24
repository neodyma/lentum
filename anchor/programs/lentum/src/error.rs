
use anchor_lang::prelude::*;

#[error_code]
pub enum LentumError {
    #[msg("Overflow occurred.")]
    Overflow,
    #[msg("Underflow occurred.")]
    Underflow,
    #[msg("Maximum number of deposits exceeded.")]
    MaxDepositsExceeded,
    #[msg("Deposit not found.")]
    DepositNotFound,
    #[msg("Not enough available deposits.")]
    InsufficientAvailableDeposits,
    #[msg("Insufficient liquidity in the market.")]
    InsufficientLiquidity,
    #[msg("Insufficient collateral provided.")]
    InsufficientCollateral,
    #[msg("Maximum number of borrows exceeded.")]
    MaxBorrowsExceeded,
    #[msg("Borrow not found.")]
    BorrowNotFound,
    #[msg("Repay amount exceeds borrowed amount.")]
    RepayAmountExceedsBorrow,
    #[msg("User is not undercollateralized.")]
    NotUnderCollateralized,
    #[msg("Insufficient collateral after withdrawal.")]
    InsufficientCollateralAfterWithdrawal,
    #[msg("Unauthorized.")]
    Unauthorized,
}
