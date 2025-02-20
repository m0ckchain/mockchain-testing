import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import fetch from "node-fetch";

test("getAccountInfo", async () => {
  let res = await fetch("https://rpc.mockchain.app/blockchains", {
    method: "POST",
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
  });

  expect(programAccountInfo).not.toBeNull();
  expect(programAccountInfo?.owner).toEqual(
    new PublicKey("NativeLoader1111111111111111111111111111111")
  );
});
