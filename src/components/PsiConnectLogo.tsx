import type { SVGProps } from 'react';

export function PsiCllinLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 50"
      width="135"
      height="37.5"
      aria-labelledby="logoTitle"
      {...props}
    >
      <title id="logoTitle">PsiCllin Logo</title>
      <style>
        {`
          .logo-text {
            font-family: 'Belleza', sans-serif;
            font-size: 38px;
            fill: hsl(var(--foreground));
          }
          @media (prefers-color-scheme: dark) {
            .logo-text {
              fill: hsl(var(--foreground));
            }
          }
        `}
      </style>
      <text x="0" y="35" className="logo-text">
        PsiCllin
      </text>
    </svg>
  );
}
