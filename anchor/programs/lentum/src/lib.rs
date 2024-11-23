#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Hc6k9QpHwpvG7jndx9EEE42M28DZ6EHEedogVCyjt7mL");

pub mod market;

#[program]
pub mod lentum {
    use super::*;

    pub fn close(_ctx: Context<CloseLentum>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.lentum.count = ctx.accounts.lentum.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.lentum.count = ctx.accounts.lentum.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeLentum>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.lentum.count = value.clone();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeLentum<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Lentum::INIT_SPACE,
  payer = payer
  )]
    pub lentum: Account<'info, Lentum>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseLentum<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
    pub lentum: Account<'info, Lentum>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub lentum: Account<'info, Lentum>,
}

#[account]
#[derive(InitSpace)]
pub struct Lentum {
    count: u8,
}
