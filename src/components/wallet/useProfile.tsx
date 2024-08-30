import { useEffect, useState } from "react";
import { message, createDataItemSigner, result, dryrun } from "@permaweb/aoconnect";
import { useAppStore } from "@/store/useAppStore";

export default function useProfile() {
  const walletAddressID = useAppStore((state) => state.walletAddressID);
  const { setProfile, setAssets, setProfileId, profileId } = useAppStore();

  const getProfileInfo = async (profileId: string) => {
    const result = await dryrun({
      process: profileId,
      data: JSON.stringify({ ProfileId: profileId }),
      tags: [{ name: "Action", value: "Info" }],
      anchor: "1234",
    });

    const data = JSON.parse(result.Messages[0].Data);
    console.log(result, data);
    const profile = {
      ...data.Profile,
      DateUpdated: new Date(data.Profile.DateUpdated),
      DateCreated: new Date(data.Profile.DateCreated),
      CoverImage: data.Profile.CoverImage === "None" ? null : `https://arweave.net/$${data.Profile.CoverImage}`,
      ProfileImage: data.Profile.ProfileImage === "None" ? null : `https://arweave.net/${data.Profile.ProfileImage}`,
    };
    setProfile(profile);
    setAssets(data.Assets);
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await dryrun({
        process: "SNy4m-DrqxWl01YqGM4sxI8qCni-58re8uuJLvZPypY",
        data: JSON.stringify({ Address: walletAddressID }),
        tags: [{ name: "Action", value: "Get-Profiles-By-Delegate" }],
        anchor: "1234",
      });

      console.log(result);
      const data = JSON.parse(result.Messages[0].Data);
      if (data.length != 0) {
        setProfileId(data[0].ProfileId);
        getProfileInfo(data[0].ProfileId);
      }
    };
    console.log("WALLET ADDRESS", walletAddressID);
    if (walletAddressID) {
      fetchData();
    }
  }, [walletAddressID]);

  return profileId;
}
