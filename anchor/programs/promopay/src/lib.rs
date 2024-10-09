use anchor_lang::prelude::*;

declare_id!("4LfbU3ApxLM8eADVNyCYZ4c9sLjnd1dS2y8H4FJVYbPE");

#[program]
pub mod promopay {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        // TTODO : add necessary initialization logic here
        Ok(())
    }

    pub fn create_customer(ctx: Context<CreateCustomer>, name: String, interests: String) -> Result<()> {
        require!(!name.is_empty(), CustomError::EmptyName);
        require!(!interests.is_empty(), CustomError::EmptyInterests);
        require!(name.len() <= 100, CustomError::NameTooLong);
        require!(interests.len() <= 200, CustomError::InterestsTooLong);

        let customer = &mut ctx.accounts.customer;
        customer.wallet = ctx.accounts.payer.key();
        customer.name = name;
        customer.interests = interests;
        Ok(())
    }

    pub fn create_service_provider(
        ctx: Context<CreateServiceProvider>,
        name: String,
        service_type: String,
        location: String,
        provider_code: String,
    ) -> Result<()> {
        require!(!name.is_empty(), CustomError::EmptyName);
        require!(!service_type.is_empty(), CustomError::EmptyServiceType);
        require!(!location.is_empty(), CustomError::EmptyLocation);
        require!(!provider_code.is_empty(), CustomError::EmptyProviderCode);
        require!(name.len() <= 100, CustomError::NameTooLong);
        require!(service_type.len() <= 100, CustomError::ServiceTypeTooLong);
        require!(location.len() <= 100, CustomError::LocationTooLong);
        require!(provider_code.len() <= 20, CustomError::ProviderCodeTooLong);

        let service_provider = &mut ctx.accounts.service_provider;
        service_provider.wallet = ctx.accounts.payer.key();
        service_provider.name = name;
        service_provider.service_type = service_type;
        service_provider.location = location;
        service_provider.provider_code = provider_code.clone();

        ctx.accounts.code_to_provider.code = provider_code;
        ctx.accounts.code_to_provider.provider_wallet = ctx.accounts.payer.key();

        Ok(())
    }

    pub fn create_web3_project(
        ctx: Context<CreateWeb3Project>,
        project_name: String,
        promotional_video: String,
        project_link: String,
        total_budget: u64,
        reward_per_user: u64,
        promo_duration: i64,
        make_users_eligible_for_airdrops: bool,
        promo_type: String,
    ) -> Result<()> {
        require!(!project_name.is_empty(), CustomError::EmptyProjectName);
        require!(!promotional_video.is_empty(), CustomError::EmptyPromotionalVideo);
        require!(!project_link.is_empty(), CustomError::EmptyProjectLink);
        require!(project_name.len() <= 100, CustomError::ProjectNameTooLong);
        require!(promotional_video.len() <= 200, CustomError::PromotionalVideoTooLong);
        require!(project_link.len() <= 200, CustomError::ProjectLinkTooLong);
        require!(total_budget > 0, CustomError::InvalidTotalBudget);
        require!(reward_per_user > 0, CustomError::InvalidRewardPerUser);
        require!(promo_duration > 0, CustomError::InvalidPromoDuration);
        require!(!promo_type.is_empty(), CustomError::EmptyPromoType);
        require!(promo_type.len() <= 50, CustomError::PromoTypeTooLong);

        require!(total_budget >= reward_per_user, CustomError::InsufficientBudget);

        let web3_project = &mut ctx.accounts.web3_project;
        web3_project.project_wallet = ctx.accounts.payer.key();
        web3_project.project_name = project_name;
        web3_project.promotional_video = promotional_video;
        web3_project.project_link = project_link;
        web3_project.total_budget = total_budget;
        web3_project.reward_per_user = reward_per_user;
        web3_project.promo_duration = promo_duration;
        web3_project.make_users_eligible_for_airdrops = make_users_eligible_for_airdrops;
        web3_project.promo_type = promo_type;
        web3_project.remaining_balance = total_budget;

        Ok(())
    }

    pub fn pay_to_provider(ctx: Context<PayToProvider>, amount_paid_by_customer: u64) -> Result<()> {
        let amount_paid_by_web3_project = ctx.accounts.web3_project.reward_per_user;

        require!(
            ctx.accounts.web3_project.remaining_balance >= amount_paid_by_web3_project,
            CustomError::InsufficientProjectFunds
        );

      
        let transfer_to_provider = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.customer.key(),
            &ctx.accounts.service_provider.key(),
            amount_paid_by_customer,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_to_provider,
            &[
                ctx.accounts.customer.to_account_info(),
                ctx.accounts.service_provider.to_account_info(),
            ],
        )?;

   
        let transfer_from_project = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.web3_project.to_account_info().key,
            &ctx.accounts.service_provider.key(),
            amount_paid_by_web3_project,
        );
        anchor_lang::solana_program::program::invoke(
            &transfer_from_project,
            &[
                ctx.accounts.web3_project.to_account_info(),
                ctx.accounts.service_provider.to_account_info(),
            ],
        )?;

      
        ctx.accounts.web3_project.remaining_balance = ctx.accounts.web3_project.remaining_balance
            .checked_sub(amount_paid_by_web3_project)
            .ok_or(CustomError::ArithmeticOverflow)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct CreateCustomer<'info> {
    #[account(init, payer = payer, space = 8 + 32 + 256 + 256)]
    pub customer: Account<'info, Customer>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateServiceProvider<'info> {
    #[account(init, payer = payer, space = 8 + 32 + 256 + 256 + 256 + 64)]
    pub service_provider: Account<'info, ServiceProvider>,
    #[account(init, payer = payer, space = 8 + 64 + 32)]
    pub code_to_provider: Account<'info, CodeToProvider>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateWeb3Project<'info> {
    #[account(init, payer = payer, space = 8 + 32 + 256 + 256 + 256 + 8 + 8 + 8 + 1 + 256 + 8)]
    pub web3_project: Account<'info, Web3Project>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PayToProvider<'info> {
    #[account(mut)]
    pub customer: Signer<'info>,
    /// CHECK: This account is not read or written in this instruction, it's just used as a fund recipient
    #[account(mut)]
    pub service_provider: AccountInfo<'info>,
    #[account(mut)]
    pub web3_project: Account<'info, Web3Project>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Customer {
    pub wallet: Pubkey,
    pub name: String,
    pub interests: String,
}

#[account]
pub struct ServiceProvider {
    pub wallet: Pubkey,
    pub name: String,
    pub service_type: String,
    pub location: String,
    pub provider_code: String,
}

#[account]
pub struct Web3Project {
    pub project_wallet: Pubkey,
    pub project_name: String,
    pub promotional_video: String,
    pub project_link: String,
    pub total_budget: u64,
    pub reward_per_user: u64,
    pub promo_duration: i64,
    pub make_users_eligible_for_airdrops: bool,
    pub promo_type: String,
    pub remaining_balance: u64,
}

#[account]
pub struct CodeToProvider {
    pub code: String,
    pub provider_wallet: Pubkey,
}

#[error_code]
pub enum CustomError {
    #[msg("Name cannot be empty")]
    EmptyName,
    #[msg("Interests cannot be empty")]
    EmptyInterests,
    #[msg("Name is too long")]
    NameTooLong,
    #[msg("Interests are too long")]
    InterestsTooLong,
    #[msg("Service type cannot be empty")]
    EmptyServiceType,
    #[msg("Location cannot be empty")]
    EmptyLocation,
    #[msg("Provider code cannot be empty")]
    EmptyProviderCode,
    #[msg("Service type is too long")]
    ServiceTypeTooLong,
    #[msg("Location is too long")]
    LocationTooLong,
    #[msg("Provider code is too long")]
    ProviderCodeTooLong,
    #[msg("Project name cannot be empty")]
    EmptyProjectName,
    #[msg("Promotional video cannot be empty")]
    EmptyPromotionalVideo,
    #[msg("Project link cannot be empty")]
    EmptyProjectLink,
    #[msg("Project name is too long")]
    ProjectNameTooLong,
    #[msg("Promotional video is too long")]
    PromotionalVideoTooLong,
    #[msg("Project link is too long")]
    ProjectLinkTooLong,
    #[msg("Total budget must be greater than zero")]
    InvalidTotalBudget,
    #[msg("Reward per user must be greater than zero")]
    InvalidRewardPerUser,
    #[msg("Promotion duration must be greater than zero")]
    InvalidPromoDuration,
    #[msg("Promotion type cannot be empty")]
    EmptyPromoType,
    #[msg("Promotion type is too long")]
    PromoTypeTooLong,
    #[msg("Insufficient budget for rewards")]
    InsufficientBudget,
    #[msg("Insufficient funds in the project")]
    InsufficientProjectFunds,
    #[msg("Arithmetic overflow occurred")]
    ArithmeticOverflow,
}