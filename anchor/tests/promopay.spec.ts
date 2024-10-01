import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Keypair } from '@solana/web3.js';
import { Promopay } from '../target/types/promopay';

describe('promopay', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Promopay as Program<Promopay>;

  const promopayKeypair = Keypair.generate();

  it('Initialize Promopay', async () => {
    await program.methods
      .initialize()
      .accounts({
        promopay: promopayKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([promopayKeypair])
      .rpc();

    const currentCount = await program.account.promopay.fetch(
      promopayKeypair.publicKey
    );

    expect(currentCount.count).toEqual(0);
  });

  it('Increment Promopay', async () => {
    await program.methods
      .increment()
      .accounts({ promopay: promopayKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.promopay.fetch(
      promopayKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Increment Promopay Again', async () => {
    await program.methods
      .increment()
      .accounts({ promopay: promopayKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.promopay.fetch(
      promopayKeypair.publicKey
    );

    expect(currentCount.count).toEqual(2);
  });

  it('Decrement Promopay', async () => {
    await program.methods
      .decrement()
      .accounts({ promopay: promopayKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.promopay.fetch(
      promopayKeypair.publicKey
    );

    expect(currentCount.count).toEqual(1);
  });

  it('Set promopay value', async () => {
    await program.methods
      .set(42)
      .accounts({ promopay: promopayKeypair.publicKey })
      .rpc();

    const currentCount = await program.account.promopay.fetch(
      promopayKeypair.publicKey
    );

    expect(currentCount.count).toEqual(42);
  });

  it('Set close the promopay account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        promopay: promopayKeypair.publicKey,
      })
      .rpc();

    // The account should no longer exist, returning null.
    const userAccount = await program.account.promopay.fetchNullable(
      promopayKeypair.publicKey
    );
    expect(userAccount).toBeNull();
  });
});
