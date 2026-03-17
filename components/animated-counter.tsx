"use client";

import * as React from "react";
import { animate, useMotionValue, useTransform } from "framer-motion";

type Props = {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
};

export function AnimatedCounter({ value, decimals = 0, suffix, className }: Props) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    const pow = Math.pow(10, decimals);
    const v = Math.round(latest * pow) / pow;
    return decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
  });
  const [display, setDisplay] = React.useState<string>("0");

  React.useEffect(() => {
    const controls = animate(motionValue, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1]
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, decimals]);

  return (
    <span className={className}>
      {display}
      {suffix ? <span className="text-muted-foreground">{suffix}</span> : null}
    </span>
  );
}

