use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, Token, TokenAccount, Transfer};

use crate::{LentumError, Market, UserAccount};

#[derive(Accounts)]
// the user burns lenX tokens and withdraws X in return
pub struct WithdrawTokens<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut, seeds = [b"lentumMarket".as_ref()], bump)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub reserve_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_len_account: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,
    pub len_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}

impl<'info> WithdrawTokens<'info> {
    pub fn withdraw_tokens(&mut self, amount: u64) -> Result<()> {
        let market = &mut self.market;

        todo!("collateral ratio checks");

        // Burn lenX tokens from the user's lenX account
        let cpi_accounts_burn = Burn {
            mint: self.len_mint.to_account_info(),
            from: self.user_len_account.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        let cpi_ctx_burn = CpiContext::new(self.token_program.to_account_info(), cpi_accounts_burn);
        token::burn(cpi_ctx_burn, amount)?;

        // Transfer tokens from reserve to user
        let cpi_accounts_transfer = Transfer {
            from: self.reserve_token_account.to_account_info(),
            to: self.user_token_account.to_account_info(),
            authority: market.to_account_info(),
        };
        let cpi_ctx_transfer =
            CpiContext::new(self.token_program.to_account_info(), cpi_accounts_transfer);
        token::transfer(cpi_ctx_transfer, amount)?;

        // Update market liquidity
        market.liquidity = market
            .liquidity
            .checked_sub(amount)
            .ok_or(LentumError::Underflow)?;

        Ok(())
    }
}
