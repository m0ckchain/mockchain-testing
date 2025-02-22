import { Connection, Keypair, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  createMint,
} from "@solana/spl-token";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

test("getAccountInfo", async () => {
  let res = await fetch("http://localhost:8080/blockchains", {
    method: "POST",
    headers: {
      api_key: process.env.API_KEY!,
    },
  });

  expect(res.status).toBe(200);
  let json = (await res.json()) as any;
  let url = json.url;
  const connection = new Connection(url, "confirmed");

  const programAccountInfo = await connection.getAccountInfo(
    SystemProgram.programId
  );
  fetch(url, {
    method: "DELETE",
    headers: {
      api_key: process.env.API_KEY!,
    },
  });

  expect(programAccountInfo).not.toBeNull();
  expect(programAccountInfo?.owner).toEqual(
    new PublicKey("NativeLoader1111111111111111111111111111111")
  );
});

test("mint", async () => {
  let res = await fetch("http://localhost:8080/blockchains", {
    method: "POST",
    headers: {
      api_key: process.env.API_KEY!,
    },
  });

  expect(res.status).toBe(200);
  let json = (await res.json()) as any;
  let url = json.url;
  const connection = new Connection(url, "confirmed");

  let keypair = Keypair.generate();

  let signature = await connection.requestAirdrop(
    keypair.publicKey,
    1000000000
  );
  await connection.confirmTransaction(signature);

  let accountInfo = await connection.getAccountInfo(keypair.publicKey);
  expect(accountInfo).not.toBeNull();
  expect(accountInfo?.lamports).toBe(1000000000);

  let mintAuthority = Keypair.generate();

  const tokenMint = await createMint(
    connection,
    keypair,
    mintAuthority.publicKey,
    keypair.publicKey,
    6
  );

  let mintAccountInfo = await connection.getAccountInfo(tokenMint);
  expect(mintAccountInfo).not.toBeNull();

  fetch(url, {
    method: "DELETE",
    headers: {
      api_key: process.env.API_KEY!,
    },
  });
}, 100000);
