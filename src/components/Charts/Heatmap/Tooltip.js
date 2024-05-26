import styles from "./tooltip.module.css";

export const Tooltip = ({ interactionData, width, height, colorScale }) => {
  if (!interactionData) {
    return null;
  }

  return (
    // Wrapper div: a rect on top of the viz area
    <div
      style={{
        width,
        height,
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    >
      {/* The actual box with white background */}
      <div
        className={styles.tooltip}
        style={{
          position: "absolute",
          left: interactionData.xPos,
          top: interactionData.yPos,
        }}
      >
        <b>Pipe Section ID: </b><span>{interactionData.xLabel}</span>
        <br />
        <b>Circumference ID: </b><span>{interactionData.yLabel}</span>
        <br />
        <b>Pipe Thickness: </b><span style={interactionData.dist && { color: colorScale(interactionData.dist), fontWeight: 'bolder', textShadow: `-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000,0.5px 0.5px 0 #000` }}>{interactionData.value} mm</span>
        <br />
        {interactionData.dist && <><b>Distance Measure: </b><span>{interactionData.dist} mm</span></>}

      </div>
    </div>
  );
};
