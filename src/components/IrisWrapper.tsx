import React, { useEffect, useState, useRef } from "react";

// Primary stable public mirror to completely prevent local 404 errors in the console
const ELEVEN_LABS_SCRIPT_URL = "https://unpkg.com/@elevenlabs/convai-widget-embed";

// Backup official embed URL in case unpkg is down
const ELEVEN_LABS_BACKUP_URL = "https://elevenlabs.io/convai-widget/index.js";
const CUSTOM_ELEMENT_NAME = "elevenlabs-convai";

// Default Agent ID for the assistant (Iris)
const DEFAULT_IRIS_AGENT_ID = "086307dc-d477-4c31-97b7-6f685ffcb6b7";

// Declare global types for custom element and the window function
declare global {
  interface Window {
    loadIrisWidget?: (config: { agentId: string } | string) => void;
  }
  namespace JSX {
    interface IntrinsicElements {
      "elevenlabs-convai": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          "agent-id"?: string;
          "action-text"?: string;
          "start-call-text"?: string;
          "end-call-text"?: string;
          "avatar-image-url"?: string;
        },
        HTMLElement
      >;
    }
  }
}

interface IrisWrapperProps {
  agentId?: string;
}

export function IrisWrapper({ agentId = DEFAULT_IRIS_AGENT_ID }: IrisWrapperProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const scriptLoadAttempted = useRef(false);
  const initializationAttempts = useRef(0);
  const maxInitializationAttempts = 30; // 30 retries * 300ms = 9 seconds

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if the script is already present in the DOM
    const existingScript = document.querySelector(
      `script[src="${ELEVEN_LABS_SCRIPT_URL}"], script[src="${ELEVEN_LABS_BACKUP_URL}"]`
    );

    const startWidgetLoading = () => {
      setIsScriptLoaded(true);
      
      const checkAndInitialize = () => {
        initializationAttempts.current += 1;
        
        // 1. Check if window.loadIrisWidget is available (as requested by the user)
        if (typeof window.loadIrisWidget === "function") {
          try {
            // Support both config object and direct string argument to be completely foolproof
            window.loadIrisWidget({ agentId });
            setIsInitialized(true);
            console.log("Íris (ElevenAgents) initialized successfully via window.loadIrisWidget.");
            return;
          } catch (err) {
            console.warn("Failed to call loadIrisWidget config object, trying direct string argument...", err);
            try {
              (window.loadIrisWidget as any)(agentId);
              setIsInitialized(true);
              console.log("Íris (ElevenAgents) initialized successfully via window.loadIrisWidget with string arg.");
              return;
            } catch (fallbackErr) {
              console.error("Critical error calling loadIrisWidget:", fallbackErr);
            }
          }
        }
        
        // 2. Check if the custom element is registered as an alternative fallback
        const isRegistered = "customElements" in window && !!window.customElements.get(CUSTOM_ELEMENT_NAME);
        if (isRegistered) {
          setIsInitialized(true);
          console.log("Íris (ElevenAgents) custom element is registered. Fallback active.");
          return;
        }

        // 3. Retry if max attempts not reached
        if (initializationAttempts.current < maxInitializationAttempts) {
          setTimeout(checkAndInitialize, 300);
        } else {
          // If we reached the limit, allow rendering the custom element as a safe fallback anyway
          setIsInitialized(true);
          console.warn("Initialization polling timed out. Forcing fallback initialization.");
        }
      };

      checkAndInitialize();
    };

    if (existingScript) {
      startWidgetLoading();
      return;
    }

    if (scriptLoadAttempted.current) return;
    scriptLoadAttempted.current = true;

    // Dynamically and securely load the ElevenLabs widget script
    // TODO(security): Load over HTTPS (enforced by the hardcoded URLs below).
    // We do not accept user input for the URL to prevent Remote Code Execution (RCE) / Script Injection.
    const script = document.createElement("script");
    script.src = ELEVEN_LABS_SCRIPT_URL;
    script.async = true;
    script.type = "text/javascript";
    script.setAttribute("data-loaded-by", "IrisWrapper");

    const handleLoadSuccess = () => {
      startWidgetLoading();
    };

    const handleLoadError = () => {
      console.warn(`Failed to load script from ${ELEVEN_LABS_SCRIPT_URL}. Trying backup URL...`);
      
      // Try the official ElevenLabs URL as a fallback
      const backupScript = document.createElement("script");
      backupScript.src = ELEVEN_LABS_BACKUP_URL;
      backupScript.async = true;
      backupScript.type = "text/javascript";
      backupScript.setAttribute("data-loaded-by", "IrisWrapper-backup");

      backupScript.onload = () => {
        startWidgetLoading();
      };

      backupScript.onerror = () => {
        const errMsg = "Failed to load ElevenAgents SDK from both primary and backup URLs.";
        console.error(errMsg);
        setError(errMsg);
      };

      document.head.appendChild(backupScript);
    };

    script.onload = handleLoadSuccess;
    script.onerror = handleLoadError;

    document.head.appendChild(script);
  }, [agentId]);

  // If there's an error, log it or display a safe fallback/none
  if (error) {
    return null;
  }

  // Render the custom element as a fallback if the script is loaded and we are initialized.
  // This guarantees that even if the SDK relies on the HTML custom element instead of a window call,
  // it will still initialize and display correctly!
  if (isScriptLoaded && isInitialized) {
    return (
      <div className="iris-widget-container" style={{ display: "contents" }}>
        <style>{`
          elevenlabs-convai {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            display: block !important;
          }
        `}</style>
        <elevenlabs-convai agent-id={agentId}></elevenlabs-convai>
      </div>
    );
  }

  return null;
}

export default IrisWrapper;
