#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("DD7jceKYxfaRpd5QiLVWjSPjeQZpDH5fq5nn5smwDwM7");

#[program]
pub mod promopay {
    use super::*;

  pub fn close(_ctx: Context<ClosePromopay>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.promopay.count = ctx.accounts.promopay.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.promopay.count = ctx.accounts.promopay.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializePromopay>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.promopay.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializePromopay<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Promopay::INIT_SPACE,
  payer = payer
  )]
  pub promopay: Account<'info, Promopay>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct ClosePromopay<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub promopay: Account<'info, Promopay>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub promopay: Account<'info, Promopay>,
}

#[account]
#[derive(InitSpace)]
pub struct Promopay {
  count: u8,
}
