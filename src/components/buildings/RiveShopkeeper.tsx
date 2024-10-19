import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas";

export const RiveShopKeeper = ({ url }: { url: string }) => {
  const { RiveComponent } = useRive({
    // Load a local riv `clean_the_car.riv` or upload your own!
    src: url,
    // Be sure to specify the correct state machine (or animation) name
    // This is optional.Provides additional layout control.
    layout: new Layout({
      fit: Fit.FitWidth, // Change to: rive.Fit.Contain, or Cover
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  return <RiveComponent />;
};
