import Canvas from '@/features/canvas/components/canvas';

export default function App() {
  const drawRect = (ctx: CanvasRenderingContext2D) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.fillRect(100, 50, 200, 150);
  };

  return (
    <>
      <Canvas draw={drawRect}></Canvas>
    </>
  );
}
