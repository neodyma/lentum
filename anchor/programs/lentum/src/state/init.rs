use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Market {
    pub owner: Pubkey,
    pub reserve: Pubkey,
    pub interest_rate_model: Pubkey,
    pub last_interest_update: i64,
    pub liquidity: u64,
    pub total_borrows: u64,
    pub fee_percentage: u8,
    pub bump: u8,

    pub lenbonk_mint: Pubkey,
    pub lenjup_mint: Pubkey,
    pub lenlink_mint: Pubkey,
    pub lensol_mint: Pubkey,
    pub lenusdc_mint: Pubkey,
    pub lenusdt_mint: Pubkey,
    pub lenwif_mint: Pubkey,

    pub borbonk_mint: Pubkey,
    pub borjup_mint: Pubkey,
    pub borlink_mint: Pubkey,
    pub borsol_mint: Pubkey,
    pub borusdc_mint: Pubkey,
    pub borusdt_mint: Pubkey,
    pub borwif_mint: Pubkey,
}

#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    pub owner: Pubkey,

    pub lenbonk_account: Pubkey,
    pub lenjup_account: Pubkey,
    pub lenlink_account: Pubkey,
    pub lensol_account: Pubkey,
    pub lenusdc_account: Pubkey,
    pub lenusdt_account: Pubkey,
    pub lenwif_account: Pubkey,
    pub borbonk_account: Pubkey,
    pub borjup_account: Pubkey,
    pub borlink_account: Pubkey,
    pub borsol_account: Pubkey,
    pub borusdc_account: Pubkey,
    pub borusdt_account: Pubkey,
    pub borwif_account: Pubkey,
}
