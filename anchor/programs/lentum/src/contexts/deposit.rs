use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount, Transfer};

use crate::{LentumError, Market, UserAccount};

#[derive(Accounts)]
// the user deposits token X into the market and gets a lenX token in return
pub struct DepositTokens<'info> {
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

impl<'info> DepositTokens<'info> {
    pub fn deposit_tokens(&mut self, amount: u64) -> Result<()> {
        let market = &mut self.market;

        // Transfer tokens from user to reserve
        let cpi_accounts = Transfer {
            from: self.user_token_account.to_account_info(),
            to: self.reserve_token_account.to_account_info(),
            authority: self.authority.to_account_info(),
        };
        let cpi_program = self.token_program.to_account_info();
        let cpi_ctx_transfer = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx_transfer, amount)?;

        // Mint lenX tokens to the user's lenX account
        let cpi_accounts_mint = MintTo {
            mint: self.len_mint.to_account_info(),
            to: self.user_len_account.to_account_info(),
            authority: market.to_account_info(),
        };
        let cpi_ctx_mint = CpiContext::new(self.token_program.to_account_info(), cpi_accounts_mint);
        token::mint_to(cpi_ctx_mint, amount)?;

        // Update market liquidity
        market.liquidity = market
            .liquidity
            .checked_add(amount)
            .ok_or(LentumError::Overflow)?;

        Ok(())
    }
}
