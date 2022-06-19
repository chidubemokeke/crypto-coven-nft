import { BigInt, ipfs, json, JSONValue } from "@graphprotocol/graph-ts";
import { cryptocoven, Transfer } from "../generated/cryptocoven/cryptocoven";
import { Account, NFT, MetaData } from "../generated/schema";

// import functions from helper/utils.ts
import {
  getOrCreateAccount,
  getOrCreateNFT,
  getMetaData,
} from "./helper/utils";

// Declare IPFS hash of the JSON metadata
const ipfshash = "QmSr3vdMuP2fSxWD7S26KzzBWcAN1eNhm4hk1qaR3x3vmj";

export function handleTransfer(event: Transfer): void {
  let nft = getOrCreateNFT(event.params.tokenId);

  let account = getOrCreateAccount(event.params.from);

  let rAccount = getOrCreateAccount(event.params.to);

  nft.owner = event.params.to.toHexString();
  nft.tokenID = event.params.tokenId;
  nft.tokenURI =
    "/ipfs.io/ipfs/" +
    "QmSr3vdMuP2fSxWD7S26KzzBWcAN1eNhm4hk1qaR3x3vmj" +
    event.params.tokenId.toString() +
    ".json";
  nft.save();

  let metadata = getMetaData(event.params.tokenId);

  // combine ipfshash + tokenId  + .json --- why does it return bytes instead of string?
  let metaAttributes = ipfs.cat(
    metadata.ipfsHash + event.params.tokenId.toString() + ".json"
  );

  if (metaAttributes) {
    const value = json.fromBytes(metaAttributes).toObject();

    if (value) {
      const image = value.get("image");
      const name = value.get("name");
      const description = value.get("description");
      const externalURL = value.get("externalURL");
      const backgroundColor = value.get("backgroundColor");
      const attributes = value.get("attributes");

      if (
        name &&
        image &&
        description &&
        externalURL &&
        backgroundColor &&
        attributes
      ) {
        metadata.name = name.toString();
        metadata.image = image.toString();
        metadata.description = description.toString();
        metadata.backgroundColor = backgroundColor.toString();
        metadata.externalURL = externalURL.toString();
        metadata.attributes = [attributes.toString()];
      }

      const coven = value.get("coven");
      if (coven) {
        let covenData = coven.toObject();

        const type = covenData.get("type");

        if (type) {
          metadata.type = type.toString();
        }

        const birthChart = covenData.get("birthChart");
        if (birthChart) {
          const birthChartData = birthChart.toObject();
          const sun = birthChartData.get("sun");
          const moon = birthChartData.get("moon");
          const rising = birthChartData.get("rising");

          if (sun && moon && rising) {
            metadata.sun = sun.toString();
            metadata.moon = moon.toString();
            metadata.rising = rising.toString();
          }
        }
      }

      nft.metadata = metadata.id;
      metadata.save();
    }
  }
}
