import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {program} from "@coral-xyz/anchor/dist/cjs/native/system";
import { SolanaTwitter } from "../target/types/solana_twitter";
import * as assert from "assert";

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

      assert.equal(tweetAccount.author.toBase58(), program.provider.publicKey.toBase58());
      assert.equal(tweetAccount.topic, "sanjeet's first tweet");
      assert.equal(tweetAccount.content, "My first tweet");
      assert.ok(tweetAccount.timestamp)

      //console.log(tweetAccount);
    });

  it("can send a new tweet withoud a topic", async () => {
    const tweetKeyPair  =  anchor.web3.Keypair.generate();

    await program.methods.sendTweet("", "I will like this video")
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

    assert.equal(tweetAccount.author.toBase58(), program.provider.publicKey.toBase58());
    assert.equal(tweetAccount.topic, "");
    assert.equal(tweetAccount.content, "I will like this video");
    assert.ok(tweetAccount.timestamp)
  });

  it("can send a new tweet with topic more than 50 characters", async () => {
    const topicTooLong = "I am loving it".repeat(51);

    try {
      const tweetKeyPair  =  anchor.web3.Keypair.generate();
      await program.methods.sendTweet(topicTooLong, "I will like this video")
        .accounts({
          myTweet: tweetKeyPair.publicKey,
          senderOfTweet: program.provider.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([tweetKeyPair])
        .rpc();

    } catch(error) {
      assert.ok("it failed hence test passed");
      return;
    }

    assert.fail("this test should have failed because topic is too long");
  });

  it("can fetch all tweets", async () => {
    const tweetAccounts = await program.account.tweetOnSolana.all();
    console.log(tweetAccounts);
  });


  it("can filter by author", async () => {
    const authorPublicKey = program.provider.publicKey;
    const tweetAccounts = await program.account.tweetOnSolana.all([
      {
        memcmp: {
          offset: 8,
          bytes: authorPublicKey.toBase58(),
        },
      },

    ]);
    
    assert.equal(tweetAccounts.length, 2);
  });


});
