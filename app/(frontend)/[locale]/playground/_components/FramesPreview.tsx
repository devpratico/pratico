import { TLFrameShape } from "tldraw";

export function FramesPreview({frames}: {frames: TLFrameShape[]}) {

    return (
        <div id="frames-container" style={{ padding: "20px", border: "1px solid #ccc" }}>
            {frames.map((frame) => (
                <div
                    key={frame.id}
                >
                    <span style={{ position: "absolute", top: 0, left: 0, fontSize: "12px" }}>
                        {frame.props.name || "Unnamed Frame"}
                    </span>
                </div>
            ))}
        </div>
    );
}
