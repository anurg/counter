import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Counter } from "../target/types/counter";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import {PublicKey} from "@solana/web3.js"

describe("counter", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Counter as Program<Counter>;

  // const counterAccount = anchor.web3.Keypair.generate();
  const [counterPDA] = PublicKey.findProgramAddressSync(
    [Buffer.from("counter")],
    program.programId
  )

  it("Is initialized!", async () => {
    // Add your test here.
    try {
      const tx = await program.methods.initialize().accounts({
        counter: counterPDA
      }).rpc();
  
      // Fetch the counter account data
      const accountData = await program.account.counter.fetch(
        counterPDA,
      );
      
      console.log("Your transaction signature", tx);
      console.log(`Count: ${accountData.count}`);
    } catch (error) {
      console.log(error);
    }
  });

  it("Increment", async ()=>{
    const txSig = await program.methods.increment().accounts({
      counter: counterPDA
    }).rpc();
    const accountData = await program.account.counter.fetch(
      counterPDA
    );
    console.log("Your transaction signature", txSig);
      console.log(`Count: ${accountData.count}`);
  });
});
