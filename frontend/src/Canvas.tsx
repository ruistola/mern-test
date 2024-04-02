import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Todo from "./Todo";
import renderer  from "./renderer";

type Props = {
  todos: Todo[]
}

export default function Canvas({ todos }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [glctx, setGlctx] = useState<WebGL2RenderingContext | null>(null);

  const handleMouseMove = (e: MouseEvent ) => {
    if (!(e.target instanceof HTMLElement)) return;
    let rect = (e.target as HTMLElement).getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseDblClick = () => {
    if (!ctx) return;
    ctx.strokeRect(mousePos.x - 3, mousePos.y - 3, 6, 6);
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    setCtx(canvasRef.current.getContext("2d"));
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    setGlctx(canvasRef.current.getContext("webgl2"));
    if (!glctx) return;
    renderer(glctx);
  }, [canvasRef.current]);

  return (
    <canvas ref={canvasRef} width="640px" height="480px" style={{ border: "2px solid black", display: "inline-flex", width: "100%", height: "100%" }} onDoubleClick={handleMouseDblClick} />
  );
}
