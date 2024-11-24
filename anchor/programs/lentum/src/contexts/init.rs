use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token};

use crate::Market;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct InitializeParams {
    pub owner: Pubkey,
    pub reserve: Pubkey,
    pub interest_rate_model: Pubkey,
    pub initial_liquidity: u64,
    pub fee_percentage: u8,
}

#[derive(Accounts)]
pub struct InitializeMarket<'info> {
    #[account(
        init, 
        payer = user, 
        space = Market::INIT_SPACE + 8 + 8, 
        seeds = [b"lentumMarket".as_ref()], 
        bump
    )]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

    pub token_program: Program<'info, Token>,

    // lenX mints
    #[account(seeds = [b"lenbonk_mint".as_ref()], bump)]
    pub lenbonk_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"lenjup_mint".as_ref()], bump)]
    pub lenjup_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"lenlink_mint".as_ref()], bump)]
    pub lenlink_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"lensol_mint".as_ref()], bump)]
    pub lensol_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"lenusdc_mint".as_ref()], bump)]
    pub lenusdc_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"lenusdt_mint".as_ref()], bump)]
    pub lenusdt_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"lenwif_mint".as_ref()], bump)]
    pub lenwif_mint: Box<Account<'info, Mint>>,

    // borX mints
    #[account(seeds = [b"borbonk_mint".as_ref()], bump)]
    pub borbonk_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"borjup_mint".as_ref()], bump)]
    pub borjup_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"borlink_mint".as_ref()], bump)]
    pub borlink_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"borsol_mint".as_ref()], bump)]
    pub borsol_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"borusdc_mint".as_ref()], bump)]
    pub borusdc_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"borusdt_mint".as_ref()], bump)]
    pub borusdt_mint: Box<Account<'info, Mint>>,
    #[account(seeds = [b"borwif_mint".as_ref()], bump)]
    pub borwif_mint: Box<Account<'info, Mint>>,
}

#[derive(Accounts)]
// A mint for lenX / borX tokens
// this is unused, we create the mint outside of the program
pub struct InitializeLentumMint<'info> {
    #[account(mut, address = pubkey!("J5XPo6ip7GvPYWyBzKJPKZWwU9u6poaJN4x5Bh1hSLdL"))]
    pub admin: Signer<'info>,
    #[account(init, payer = admin, mint::decimals = 9, mint::authority = mint, seeds = [b"_mint"], bump)]
    pub mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> InitializeMarket<'info> {
    pub fn initialize_market(
        &mut self,
        params: InitializeParams,
    ) -> Result<()> {
        let market = &mut self.market;
        market.owner = params.owner;
        market.reserve = params.reserve;
        market.interest_rate_model = params.interest_rate_model;
        market.liquidity = params.initial_liquidity;
        market.total_borrows = 0;
        market.fee_percentage = params.fee_percentage;
        market.last_interest_update = Clock::get()?.unix_timestamp;

        // Initialize mints with authority set to market account

        // init
        // then create mints with pda as authority
        // then do other things
        // statically compute key with findProgramAddressSync

        Ok(())
    }
}
