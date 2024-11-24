use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount, Transfer};

use crate::{LentumError, Market, UserAccount};

#[derive(Accounts)]
// the user borrows token X and receives a borX token as well
// the user must have enough lenX tokens to borrow
pub struct BorrowTokens<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut, seeds = [b"lentumMarket".as_ref()], bump)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub reserve_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub user_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub user_bor_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub user_lenbonk_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub user_lenjup_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub user_lenlink_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub user_lensol_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub user_lenusdc_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub user_lenusdt_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub user_lenwif_account: Box<Account<'info, TokenAccount>>,

    pub authority: Signer<'info>,
    pub bor_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}

impl<'info> BorrowTokens<'info> {
    pub fn borrow_tokens(&mut self, amount: u64) -> Result<()> {
        let _user_account = &mut self.user_account;
        let market = &mut self.market;

        fn calculate_required_collateral(amount: u64, fee_percentage: u8) -> Result<u64> {
            // Example: Require 150% collateral
            let collateral_factor: u64 = 150;
            let collateral = amount
                .checked_mul(collateral_factor)
                .ok_or(LentumError::Overflow)?;
            Ok(collateral / 100)
        }

        todo!("collateral calculation");
        // calculate_interest(market)?;

        // Ensure the market has enough liquidity
        if market.liquidity < amount {
            return Err(LentumError::InsufficientLiquidity.into());
        }

        // Check collateral ratio
        let required_collateral = calculate_required_collateral(amount, market.fee_percentage)?;
        // if !has_sufficient_collateral(user_account, required_collateral) {
        // return Err(LentumError::InsufficientCollateral.into());
        // }

        // Transfer borrowed tokens to the user
        let cpi_accounts = Transfer {
            from: self.reserve_token_account.to_account_info(),
            to: self.user_token_account.to_account_info(),
            authority: market.to_account_info(),
        };
        let cpi_program = self.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        // Mint borX tokens to the user
        let mint_to_ctx = CpiContext::new(
            self.token_program.to_account_info(),
            MintTo {
                mint: self.bor_mint.to_account_info(),
                to: self.user_bor_account.to_account_info(),
                authority: market.to_account_info(),
            },
        );
        token::mint_to(mint_to_ctx, amount)?;

        // Update market liquidity and total borrows
        market.liquidity = market
            .liquidity
            .checked_sub(amount)
            .ok_or(LentumError::Underflow)?;
        market.total_borrows = market
            .total_borrows
            .checked_add(amount)
            .ok_or(LentumError::Overflow)?;

        Ok(())
    }
}
