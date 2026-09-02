import type { Transition, Variants } from "motion/react";

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 420,
  damping: 32,
};

export const springPanel: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const springList: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { ...springPanel } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: "easeIn" } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.035, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: springList },
  exit: { opacity: 0, x: -8, transition: { duration: 0.15 } },
};

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.18 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  show: { opacity: 1, scale: 1, y: 0, transition: springPanel },
  exit: { opacity: 0, scale: 0.98, y: 6, transition: { duration: 0.15 } },
};

export const drawerPanel: Variants = {
  hidden: { x: "100%" },
  show: { x: 0, transition: springPanel },
  exit: { x: "100%", transition: { duration: 0.2, ease: "easeIn" } },
};

/** Dirección del wizard: 1 = avanzar, -1 = retroceder */
export const wizardStepVariants: Variants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 32 : -32,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: springPanel,
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -32 : 32,
    transition: { duration: 0.15, ease: "easeIn" },
  }),
};
