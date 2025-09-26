import { useEffect } from 'react';

export default function useMain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  useEffect(() => {
    if (!ctx) return;

    // Set up the initial state for the bouncing ball.
    const ball = {
      x: width / 2,
      y: height / 2,
      radius: 15,
      dx: 3, // velocity on the x-axis
      dy: 3, // velocity on the y-axis
    };

    // The animation frame ID, used to cancel the loop.
    let animationFrameId: number;

    // The main animation loop.
    const animate = () => {
      // Clear the entire canvas on each frame.
      ctx.clearRect(0, 0, width, height);

      // Draw the ball.
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.closePath();

      // Update the ball's position.
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Check for wall collisions and reverse direction.
      if (ball.x + ball.radius > width || ball.x - ball.radius < 0) {
        ball.dx = -ball.dx;
      }
      if (ball.y + ball.radius > height || ball.y - ball.radius < 0) {
        ball.dy = -ball.dy;
      }

      // Schedule the next frame.
      animationFrameId = requestAnimationFrame(animate);
    };

    // Start the animation loop.
    animate();

    // Cleanup function to cancel the animation frame when the component unmounts.
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [ctx, height, width]);
}
