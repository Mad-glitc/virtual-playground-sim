import { motion } from 'framer-motion';

const GridBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(hsl(174 80% 46% / 0.03) 1px, transparent 1px),
            linear-gradient(90deg, hsl(174 80% 46% / 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'grid-pulse 4s ease-in-out infinite',
        }}
      />
      {/* Radial fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(228_22%_5%)_70%)]" />

      {/* Orbiting element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px]">
        <motion.div
          className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-primary/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '0px 150px' }}
        />
        <motion.div
          className="absolute top-0 left-1/2 w-1.5 h-1.5 rounded-full bg-accent/30"
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '0px 100px' }}
        />
      </div>

      {/* Scan lines */}
      <div className="absolute inset-0 scan-line opacity-30" />
    </div>
  );
};

export default GridBackground;
