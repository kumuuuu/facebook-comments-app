import { useEffect } from "react";

declare global {
  interface Window {
    FB: any;
  }
}

export default function FacebookSDKLoader() {
  useEffect(() => {
    // Load the SDK script dynamically
    const loadFacebookSDK = () => {
      (window as any).fbAsyncInit = function () {
        window.FB.init({
          appId: "1515517895768900",
          xfbml: true,
          version: "v22.0",
        });
      };

      const script = document.createElement("script");
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      document.body.appendChild(script);
    };

    if (!window.FB) {
      loadFacebookSDK();
    }
  }, []);

  return <div>Facebook SDK Loaded</div>;
}
