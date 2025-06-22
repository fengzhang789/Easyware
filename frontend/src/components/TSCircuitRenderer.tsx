import { useEffect, useRef } from 'react'

export default function TSCircuitRenderer({
  board
}: {
  board: string
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isIframeReady = useRef(false); // To track if the iframe is ready to receive messages

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.runframe_type === "runframe_ready_to_receive") {
        isIframeReady.current = true;
        // When ready, immediately send the current board configuration
        iframe.contentWindow?.postMessage(
          {
            runframe_type: "runframe_props_changed",
            runframe_props: {
              fsMap: {
                "main.tsx": `circuit.add(${board})`,
              },
              entrypoint: "main.tsx",
            },
          },
          "*"
        );
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [board]) // board is in dependency array to re-run effect when board changes

  // New useEffect to handle board changes after the iframe is ready
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !isIframeReady.current) return; // Only send if iframe exists and is ready

    // Send circuit configuration whenever 'board' changes and iframe is ready
    iframe.contentWindow?.postMessage(
      {
        runframe_type: "runframe_props_changed",
        runframe_props: {
          fsMap: {
            "main.tsx": `circuit.add(${board})`,
          },
          entrypoint: "main.tsx",
        },
      },
      "*"
    );
  }, [board, isIframeReady.current]); // Also depend on isIframeReady.current to re-trigger when it becomes true

  return (
    <iframe
      ref={iframeRef}
      id="runframe"
      src="https://runframe.tscircuit.com/iframe.html"
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  )
}