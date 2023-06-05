use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod solana_twitter {
    use super::*;

    pub fn send_tweet(
        send_tweet_ctx: Context<SendATweet>,
        topic: String,
        tweet_content: String,
    ) -> Result<()> {
        let my_tweet = send_tweet_ctx.accounts.my_tweet;
        Ok(())
    }

    /*
        pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
            let dd = "hello";
            Ok(())
        }
    */
}

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct SendATweet<'info> {
    #[account(init, payer=sender_of_tweet, space=TweetOnSolana::LEN)]
    pub my_tweet: Account<'info, TweetOnSolana>,

    #[account(mut)]
    pub sender_of_tweet: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct TweetOnSolana {
    pub author: Pubkey,
    pub timestamp: i64,
    pub topic: String,
    pub content: String,
}

const DICRIMINATOR_LENGTH: usize = 8;
const PUBLIC_KEY_LENGTH: usize = 32;
const TIMESTAMP_LENGTH: usize = 8;
const STRING_LENGTH_PREFIX: usize = 4;
const MAX_TOPIC_LENGTH: usize = 50 * 4;
const MAX_CONTENT_LENGTH: usize = 200 * 4;

impl TweetOnSolana {
    const LEN: usize = DICRIMINATOR_LENGTH
        + PUBLIC_KEY_LENGTH
        + TIMESTAMP_LENGTH
        + STRING_LENGTH_PREFIX
        + MAX_TOPIC_LENGTH
        + STRING_LENGTH_PREFIX
        + MAX_CONTENT_LENGTH;
}
