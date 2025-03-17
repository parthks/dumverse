import { dryrun } from "@/lib/aoConnection";
import { useAppStore } from "@/store/useAppStore";
import { useCallback, useEffect, useMemo, useRef } from "react";

export const useProfile = () => {
  const { walletAddressID, setProfile, setAssets, setProfileId, profileId, setProfileLoading, resetProfileData } = useAppStore();

  const getProfileInfo = useCallback(
    async (profileId: string) => {
      try {
        const result = await dryrun({
          process: profileId,
          data: JSON.stringify({ ProfileId: profileId }),
          tags: [{ name: "Action", value: "Info" }],
          anchor: "1234",
        });

        const data = JSON.parse(result.Messages[0].Data);
        console.log("Ashu : data: " + JSON.stringify(data));

        // console.log("Ashu : profileId: " + profileId);
        // console.log("Ashu : getProfileInfo: " + JSON.stringify(data));
        const profile = {
          ...data.Profile,
          DateUpdated: new Date(data.Profile.DateUpdated),
          DateCreated: new Date(data.Profile.DateCreated),
          CoverImage: data.Profile.CoverImage === "None" ? null : `https://arweave.net/$${data.Profile.CoverImage}`,
          ProfileImage: data.Profile.ProfileImage === "None" ? null : `https://arweave.net/${data.Profile.ProfileImage}`,
        };
        // console.log("Ashu : getProfileInfo: Profile: " + JSON.stringify(profile));

        setProfile(profile);
        setAssets(data.Assets);
      } catch (error) {
        console.error("Error fetching profile info:", error);
        resetProfileData();
      } finally {
        setProfileLoading(false);
      }
    },
    [setProfile, setAssets, setProfileLoading, resetProfileData]
  );

  const fetchDataRef = useRef(async (walletAddress: string) => {
    console.log("Fetching data for wallet:", walletAddress);
    setProfileLoading(true);
    try {
      const result = await dryrun({
        process: "SNy4m-DrqxWl01YqGM4sxI8qCni-58re8uuJLvZPypY",
        data: JSON.stringify({ Address: walletAddress }),
        tags: [{ name: "Action", value: "Get-Profiles-By-Delegate" }],
        anchor: "1234",
      });

      if (!result.Messages[0].Data) {
        resetProfileData();
        return;
      }
      const data = JSON.parse(result.Messages[0].Data);
      if (data.length !== 0) {
        setProfileId(data[0].ProfileId);
        await getProfileInfo(data[0].ProfileId);
      } else {
        resetProfileData();
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      resetProfileData();
    }
  });

  useEffect(() => {
    if (walletAddressID) {
      fetchDataRef.current(walletAddressID);
      console.log("FETCHING DATA FROM walletAddressID", walletAddressID);
    }
  }, [walletAddressID]);

  return profileId;
};
