import { cn } from '@/lib/utils';

interface SpotlightProps {
  ellipseClassName?: string;
  className?: string;
}

export function Spotlight({ ellipseClassName, className }: SpotlightProps) {
  return (
    <svg
      className={cn(
        'pointer-events-none absolute z-[1] h-[169%] w-[138%] -translate-x-1/2 -translate-y-[40%] blur-lg lg:w-[84%]',
        className
      )}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3787 2842"
      fill="none"
    >
      <g filter="url(#filter)">
        <ellipse
          cx="1924.71"
          cy="273.501"
          rx="1924.71"
          ry="273.501"
          transform="matrix(-0.822377 -0.568943 -0.568943 0.822377 3631.88 2291.09)"
          className={ellipseClassName}
          fillOpacity="0.21"
        />
      </g>
      <defs>
        <filter
          id="filter"
          x="0.860352"
          y="0.838989"
          width="3785.16"
          height="2840.26"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          {/* <feGaussianBlur
            stdDeviation="5"
            result="effect1_foregroundBlur_1065_8"
          /> */}
        </filter>
      </defs>
    </svg>
  );
}
