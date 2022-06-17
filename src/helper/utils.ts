import {
  Address,
  BigInt,
  ipfs,
  json,
  JSONValue,
} from "@graphprotocol/graph-ts";
import { Account, MetaData, NFT } from "../../generated/schema";

export function getOrCreateAccount(userAddress: Address): Account {
  let account = Account.load(userAddress.toHexString());
  if (!account) {
    account = new Account(userAddress.toHexString());
  }
  return account;
}

export function getOrCreateNFT(tokenId: BigInt): NFT {
  let nft = NFT.load(tokenId.toString());
  if (!nft) {
    nft = new NFT(tokenId.toString());
  }
  return nft;
}

export function getMetaData(tokenId: BigInt): MetaData {
  let metadata = MetaData.load(tokenId.toString());
  if (!metadata) {
    metadata = new MetaData(tokenId.toString());
    metadata.ipfsHash = "QmSr3vdMuP2fSxWD7S26KzzBWcAN1eNhm4hk1qaR3x3vmj";
  }
  return metadata;
}
