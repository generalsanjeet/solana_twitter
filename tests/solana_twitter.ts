import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {program} from "@coral-xyz/anchor/dist/cjs/native/system";
import { SolanaTwitter } from "../target/types/solana_twitter";

describe("solana_twitter", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>

  it("can send a new tweet", async () => {
    const tweetKeyPair  =  anchor.web3.Keypair.generate();

    await program.methods.sendTweet("sanjeet's first tweet", "My first tweet")
    .accounts({
      myTweet: tweetKeyPair.publicKey,
      senderOfTweet: program.provider.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([tweetKeyPair])
    .rpc();

    const tweetAccount = await program.account.tweetOnSolana.fetch(
      tweetKeyPair.publicKey
    );

    console.log(tweetAccount);

  });

});
