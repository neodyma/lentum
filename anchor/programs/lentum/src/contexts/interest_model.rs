use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateCorrelationMatrix<'info> {
    #[account(mut)]
    pub correlation_matrix: Account<'info, CorrelationMatrix>,
    pub authority: Signer<'info>,
}

impl<'info> UpdateCorrelationMatrix<'info> {
    pub fn update_correlation_matrix(&mut self, row: u8, col: u8, value: i64) -> Result<()> {
        let matrix = &mut self.correlation_matrix;

        if matrix.owner != self.authority.key() {
            return Err(LentumError::Unauthorized.into());
        }

        matrix.set(row as usize, col as usize, value)
    }
}
