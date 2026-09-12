import { useEffect, useRef, useState } from "react";

/**
 * Two-tap confirm for destructive actions that would otherwise fire on a
 * single mis-tap (clearing a drawing, wiping a coloring page, restarting a
 * game in progress). The first tap arms the control; a second tap within
 * `ms` runs the action. Arming clears itself after `ms` if untouched.
 */
export function useConfirmArm(action: () => void, ms = 2200) {
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function trigger() {
    if (armed) {
      if (timer.current) clearTimeout(timer.current);
      setArmed(false);
      action();
      return;
    }
    setArmed(true);
    timer.current = setTimeout(() => setArmed(false), ms);
  }

  return { armed, trigger };
}
