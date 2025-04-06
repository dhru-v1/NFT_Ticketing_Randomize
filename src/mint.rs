use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::ProgramError,
    msg,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
pub struct TicketData {
    pub event_name: String,
    pub ticket_id: u64,
    pub owner: Pubkey,
}

entrypoint!(process_instruction);

fn process_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let ticket_account = next_account_info(accounts_iter)?; // The NFT metadata account
    let user_account = next_account_info(accounts_iter)?;   // The ticket buyer (wallet)

    let mut ticket_data = TicketData::try_from_slice(&ticket_account.data.borrow())?;
    ticket_data.owner = *user_account.key;

    ticket_data.serialize(&mut &mut ticket_account.data.borrow_mut()[..])?;

    msg!("Ticket minted for: {:?}", ticket_data);

    Ok(())
}
