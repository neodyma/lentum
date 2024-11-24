use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

use crate::{Market, TokenAccount, UserAccount};

#[derive(Accounts)]
pub struct LiquidateBorrow<'info> {
    #[account(mut)]
    pub user_account: Account<'info, UserAccount>,
    #[account(mut)]
    pub liquidator_account: Account<'info, UserAccount>,
    #[account(mut, seeds = [b"lentumMarket".as_ref()], bump)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub reserve_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_bor_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub liquidator_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub liquidator_bor_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub liquidator_collateral_account: Account<'info, TokenAccount>,

    pub liquidator: Signer<'info>,
    pub bor_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}
