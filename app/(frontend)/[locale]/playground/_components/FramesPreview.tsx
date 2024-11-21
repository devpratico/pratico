import { TLFrameShape } from "tldraw";

export function FramesPreview({frames}: {frames: TLFrameShape[]}) {

   

    return (
        <div id="frames-container" style={{ padding: "20px", border: "1px solid #ccc" }}>
            {frames.map((frame) => (
                <div
                    key={frame.id}
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "1px solid black",
                        marginBottom: "10px",
                        position: "relative",
                    }}
                >
                    <span style={{ position: "absolute", top: 0, left: 0, fontSize: "12px" }}>
                        {frame.props.name || "Unnamed Frame"}
                    </span>
                </div>
            ))}
        </div>
    );
}
