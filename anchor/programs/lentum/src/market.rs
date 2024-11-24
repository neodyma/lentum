use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, Token, TokenAccount, Transfer};

pub mod market {
    use super::*;

    pub fn initialize_market(
        ctx: Context<InitializeMarket>,
        params: InitializeParams,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.owner = params.owner;
        market.reserve = params.reserve;
        market.interest_rate_model = params.interest_rate_model;
        market.liquidity = params.initial_liquidity;
        market.total_borrows = 0;
        market.fee_percentage = params.fee_percentage;
        Ok(())
    }

    pub fn deposit_tokens(ctx: Context<DepositTokens>, amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let market = &mut ctx.accounts.market;

        let cpi_accounts = Transfer {
            from: ctx.accounts.user_token_account.to_account_info(),
            to: ctx.accounts.reserve_token_account.to_account_info(),
            authority: ctx.accounts.authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        token::transfer(cpi_ctx, amount)?;

        let mut deposit_found = false;
        for deposit in user_account.deposits.iter_mut() {
            if deposit.mint == ctx.accounts.len_mint.key() {
                deposit.amount = deposit
                    .amount
                    .checked_add(amount)
                    .ok_or(ErrorCode::Overflow)?;
                deposit.available = deposit
                    .available
                    .checked_add(amount)
                    .ok_or(ErrorCode::Overflow)?;
                deposit_found = true;
                break;
            }
        }

        if !deposit_found {
            if user_account.deposits.len() >= MAX_DEPOSITS {
                return Err(ErrorCode::MaxDepositsExceeded.into());
            }
            user_account.deposits.push(Deposit {
                mint: ctx.accounts.len_mint.key(),
                amount,
                available: amount,
                timestamp: Clock::get()?.unix_timestamp,
            });
        }

        market.liquidity = market
            .liquidity
            .checked_add(amount)
            .ok_or(ErrorCode::Overflow)?;

        Ok(())
    }

    pub fn withdraw_tokens(ctx: Context<WithdrawTokens>, amount: u64) -> Result<()> {
        let user_account = &mut ctx.accounts.user_account;
        let market = &mut ctx.accounts.market;

        let deposit = user_account
            .deposits
            .iter_mut()
            .find(|d| d.mint == ctx.accounts.len_mint.key());
        if let Some(deposit) = deposit {
            if deposit.available < amount {
                return Err(ErrorCode::InsufficientAvailableDeposits.into());
            }
            
            // TODO collateral ratio checks

            deposit.amount = deposit
                .amount
                .checked_sub(amount)
                .ok_or(ErrorCode::Underflow)?;
            deposit.available = deposit
                .available
                .checked_sub(amount)
                .ok_or(ErrorCode::Underflow)?;

            let cpi_accounts = Transfer {
                from: ctx.accounts.reserve_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: market.to_account_info(),
            };
            let cpi_program = ctx.accounts.token_program.to_account_info();
            let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
            token::transfer(cpi_ctx, amount)?;

            market.liquidity = market
                .liquidity
                .checked_sub(amount)
                .ok_or(ErrorCode::Underflow)?;

            Ok(())
        } else {
            Err(ErrorCode::DepositNotFound.into())
        }
    }

    // TODO borrow_tokens, repay_borrow, liquidate_borrow, calculate_interest
}

const MAX_DEPOSITS: usize = 10;
const MAX_BORROWS: usize = 10;

const MARKETS: [&str; 7] = ["bonk", "jup", "link", "sol", "usdc", "usdt", "wif"];

// Errors
#[error_code]
pub enum ErrorCode {
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
}

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
    #[account(init, payer = user, space = Market::INIT_SPACE + 8 + 8, seeds = [b"lentumMarket".as_ref()], bump)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,

    pub token_program: Program<'info, Token>,

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

#[derive(Accounts)]
// the user borrows token X and receives a borX token as well
// the user must have enough lenX tokens to borrow
pub struct BorrowTokens<'info> {
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
    #[account(mut)]
    pub user_lenbonk_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_lenjup_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_lenlink_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_lensol_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_lenusdc_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_lenusdt_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_lenwif_account: Account<'info, TokenAccount>,

    pub authority: Signer<'info>,
    pub bor_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
}

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
    #[max_len(MAX_DEPOSITS)]
    pub deposits: Vec<Deposit>,
    #[max_len(MAX_BORROWS)]
    pub borrows: Vec<Borrow>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, InitSpace)]
pub struct Deposit {
    pub mint: Pubkey,
    pub amount: u64,
    pub available: u64,
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, InitSpace)]
pub struct Borrow {
    pub mint: Pubkey,
    pub amount: u64,
    pub interest: u64,
    pub timestamp: i64,
}
