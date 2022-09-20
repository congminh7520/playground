import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

const DemoCanvas = () => {
  const canvasRef = useRef();
  const initRectPos = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };
  const [rectPos, setRectPos] = useState(initRectPos);
  const [isDraw, setIsDraw] = useState(false);

  useEffect(() => {
    renderImage();
  }, []);

  const renderImage = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();
    image.onload = () => {
      context.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        canvas.width,
        canvas.height
      );
    };
    image.src =
      "https://image-map-city-planner-tool.s3.amazonaws.com/ThumbnailcurrentMap.png";
  };

  useEffect(() => {
    if (!isDraw) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.fillStyle = "#00be00";
      context.fillRect(rectPos.x, rectPos.y, rectPos.width, rectPos.height);
    }
  }, [isDraw, rectPos]);

  const startDraw = (e) => {
    setIsDraw(true);
    renderImage();
    setRectPos(initRectPos);
    const { offsetX, offsetY } = e.nativeEvent;
    // console.log(offsetX * 2 - 512, 512 - offsetY * 2);
    setRectPos({ ...rectPos, x: offsetX, y: offsetY });
  };

  const stopDraw = (e) => {
    setIsDraw(false);
    const { offsetX, offsetY } = e.nativeEvent;
    // console.log(offsetX * 2 - 512, 512 - offsetY * 2);
    setRectPos({
      ...rectPos,
      width: offsetX - rectPos.x, // calculate width of object
      height: offsetY - rectPos.y, // calculate height of object
    });
  };

  return (
    <canvas
      onMouseDown={startDraw}
      onMouseUp={stopDraw}
      ref={canvasRef}
      width={512}
      height={512}
    />
  );
};

export default DemoCanvas;
