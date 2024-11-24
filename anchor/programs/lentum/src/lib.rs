use anchor_lang::prelude::*;

mod contexts;
use contexts::*;

mod state;
use state::*;

mod error;
use error::*;

declare_id!("LentumHwpvG7jndx9EEE42M28DZ6EHEedogVCyjt7mL");

#[program]
pub mod lentum {
    use super::*;

    pub fn initialize_market(ctx: Context<InitializeMarket>) -> Result<()> {
        let params = InitializeParams {
            owner: *ctx.program_id,
            reserve: Pubkey::default(),
            interest_rate_model: Pubkey::default(),
            initial_liquidity: 0,
            fee_percentage: 0,
        };

        ctx.accounts.initialize_market(params)
    }

    pub fn deposit_tokens(ctx: Context<DepositTokens>, amount: u64) -> Result<()> {
        ctx.accounts.deposit_tokens(amount)
    }

    pub fn withdraw_tokens(ctx: Context<WithdrawTokens>, amount: u64) -> Result<()> {
        ctx.accounts.withdraw_tokens(amount)
    }

    pub fn borrow_tokens(ctx: Context<BorrowTokens>, amount: u64) -> Result<()> {
        ctx.accounts.borrow_tokens(amount)
    }

    pub fn repay_borrow(ctx: Context<RepayBorrow>, amount: u64) -> Result<()> {
        ctx.accounts.repay_borrow(amount)
    }
}
