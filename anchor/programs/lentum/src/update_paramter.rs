pub fn update_correlation_matrix(
    ctx: Context<UpdateCorrelationMatrix>,
    row: u8,
    col: u8,
    value: i64,
) -> Result<()> {
    let matrix = &mut ctx.accounts.correlation_matrix;

    // Only the owner can update the matrix
    if matrix.owner != ctx.accounts.authority.key() {
        return Err(ErrorCode::Unauthorized.into());
    }

    matrix.set(row as usize, col as usize, value)?;

    Ok(())
}

#[derive(Accounts)]
pub struct UpdateCorrelationMatrix<'info> {
    #[account(mut)]
    pub correlation_matrix: Account<'info, CorrelationMatrix>,
    pub authority: Signer<'info>,
}
