import React, { useState, useCallback, useRef } from "react";

const ELEVEN_LABS_SCRIPT_URL = "https://elevenlabs.io/convai-widget/index.js";
const CUSTOM_ELEMENT_NAME = "elevenlabs-convai";

// Declare the custom element for TypeScript JSX context to prevent compilation errors
declare global {
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

export function useIris() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Track unresolved promises to avoid duplicating state updates and duplicate loading listeners
  const resolveQueueRef = useRef<(() => void)[]>([]);

  // Checks if the custom element 'elevenlabs-convai' has already been registered in the browser
  const isElementRegistered = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      "customElements" in window &&
      !!window.customElements.get(CUSTOM_ELEMENT_NAME)
    );
  }, []);

  /**
   * Dynamically loads the ElevenLabs widget script and ensures the Custom Element is ready.
   * Resolves immediately if the custom element is already registered.
   */
  const initIris = useCallback((): Promise<void> => {
    if (typeof window === "undefined") {
      return Promise.resolve();
    }

    // If already registered and ready, resolve immediately
    if (isElementRegistered()) {
      setIsReady(true);
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      resolveQueueRef.current.push(resolve);

      const triggerResolve = () => {
        setIsReady(true);
        const queue = resolveQueueRef.current;
        resolveQueueRef.current = [];
        queue.forEach((r) => r());
      };

      // Check if the script element already exists in the document (head or body)
      let script = document.querySelector(
        `script[src="${ELEVEN_LABS_SCRIPT_URL}"]`
      ) as HTMLScriptElement | null;

      if (!script) {
        // Create script with proper configuration
        script = document.createElement("script");
        script.src = ELEVEN_LABS_SCRIPT_URL;
        script.async = true;
        script.type = "text/javascript";
        
        // TODO(security): Load over HTTPS (enforced by ELEVEN_LABS_SCRIPT_URL).
        // Since we load this remote script from the trusted provider (ElevenLabs), 
        // we ensure we load it securely without user-influenced parameters.
        
        script.setAttribute("data-loaded-by", "useIris");

        const handleScriptLoad = () => {
          if (isElementRegistered()) {
            triggerResolve();
          } else if ("customElements" in window) {
            window.customElements
              .whenDefined(CUSTOM_ELEMENT_NAME)
              .then(triggerResolve)
              .catch((err) => {
                const errorObj = err instanceof Error ? err : new Error(String(err));
                setError(errorObj);
                reject(errorObj);
              });
          } else {
            // Fallback if customElements API is not fully supported
            triggerResolve();
          }
        };

        const handleScriptError = (event: Event) => {
          const loadError = new Error("Failed to load ElevenLabs Convai Widget script");
          setError(loadError);
          reject(loadError);
        };

        script.addEventListener("load", handleScriptLoad);
        script.addEventListener("error", handleScriptError);

        document.head.appendChild(script);
      } else {
        // Script already exists in DOM, but maybe it hasn't completed loading yet
        const handleScriptReady = () => {
          if (isElementRegistered()) {
            triggerResolve();
          } else if ("customElements" in window) {
            window.customElements
              .whenDefined(CUSTOM_ELEMENT_NAME)
              .then(triggerResolve)
              .catch((err) => {
                const errorObj = err instanceof Error ? err : new Error(String(err));
                setError(errorObj);
                reject(errorObj);
              });
          } else {
            triggerResolve();
          }
        };

        // If the custom elements registry is available, we wait for definition
        if ("customElements" in window) {
          window.customElements
            .whenDefined(CUSTOM_ELEMENT_NAME)
            .then(triggerResolve)
            .catch(() => {
              // Fallback to load event listener if whenDefined fails/rejects
              script?.addEventListener("load", handleScriptReady);
            });
        } else {
          script.addEventListener("load", handleScriptReady);
        }
      }
    });
  }, [isElementRegistered]);

  return {
    initIris,
    isReady,
    error,
  };
}
