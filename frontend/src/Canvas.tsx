import { useEffect, useRef, useState } from "react";
import Todo from "./Todo";

type Props = {
  todos: Todo[]
}

export default function Canvas({ todos }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

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

  return (
    <canvas ref={canvasRef} width="400" height="320" style={{ border: "2px solid black", display: "inline-flex", width:"400", height:"320" }} onDoubleClick={handleMouseDblClick} />
  );
}
