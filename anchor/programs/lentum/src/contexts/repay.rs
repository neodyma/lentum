use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount, Transfer};

use crate::{LentumError, Market, UserAccount};

#[derive(Accounts)]
pub struct RepayBorrow<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut, seeds = [b"lentumMarket".as_ref()], bump)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub reserve_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_bor_account: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,
    pub bor_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}

impl<'info> RepayBorrow<'info> {
    pub fn repay_borrow(&mut self, amount: u64) -> Result<()> {
        let user_account = &mut self.user_account;
        let market = &mut self.market;

        // Calculate interest
        // calculate_interest(market)?;

        // Burn borX tokens from the user
        let cpi_accounts = Burn {
            mint: self.bor_mint.to_account_info(),
            from: self.user_bor_account.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        let cpi_program = self.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program.clone(), cpi_accounts);
        token::burn(cpi_ctx, amount)?;

        // Transfer tokens from user to reserve
        let cpi_transfer_accounts = Transfer {
            from: user_account.to_account_info(),
            to: self.reserve_token_account.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        let cpi_transfer_ctx = CpiContext::new(cpi_program, cpi_transfer_accounts);
        token::transfer(cpi_transfer_ctx, amount)?;

        // Update market liquidity and total borrows
        market.liquidity = market
            .liquidity
            .checked_add(amount)
            .ok_or(LentumError::Overflow)?;
        market.total_borrows = market
            .total_borrows
            .checked_sub(amount)
            .ok_or(LentumError::Underflow)?;

        Ok(())
    }
}
