import { useEffect, useRef } from 'react'

export default function TSCircuitRenderer({
  board
}: {
  board: string
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.runframe_type === "runframe_ready_to_receive") {
        // Send circuit configuration
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
        )
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [board])

  return (
    <iframe
      ref={iframeRef}
      id="runframe"
      src="https://runframe.tscircuit.com/iframe.html"
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  )
}
