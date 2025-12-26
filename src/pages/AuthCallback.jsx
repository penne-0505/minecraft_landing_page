import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { captureError } from "../analytics";
import { consumeDiscordOAuthState } from "../utils/discordAuth";

const AuthCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");

    if (!code) {
      window.location.replace("/membership");
      return;
    }

    const parsedState = consumeDiscordOAuthState(state);
    if (!parsedState?.returnTo || !parsedState.returnTo.startsWith("/")) {
      captureError(new Error("Invalid OAuth state"), { stateValue: state });
      window.location.replace("/membership?auth=invalid");
      return;
    }

    const targetPath = parsedState.returnTo;

    const targetUrl = new URL(targetPath, window.location.origin);
    targetUrl.searchParams.set("code", code);

    const checkout = url.searchParams.get("checkout");
    if (checkout) targetUrl.searchParams.set("checkout", checkout);

    window.location.replace(targetUrl.toString());
  }, [location.key]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f9ff] text-[#1e293b]">
      <div className="text-center space-y-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5fbb4e] mx-auto mb-4"></div>
        <p className="font-bold">Discord 認証から戻っています...</p>
        <p className="text-sm text-slate-500">数秒お待ちください。</p>
      </div>
    </div>
  );
};

export default AuthCallback;
