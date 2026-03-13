import { motion } from 'framer-motion';

const VARIANTS = {
  default: {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  },
  magical: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 1.03, y: -10 },
  },
  slide: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  },
};

/**
 * Wraps a page in framer-motion for route transitions.
 * variant: 'default' | 'magical' | 'slide'
 */
export default function PageTransition({ children, variant = 'default' }) {
  const v = VARIANTS[variant] || VARIANTS.default;

  return (
    <motion.div
      className="w-full h-full"
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{
        duration: 0.3,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
