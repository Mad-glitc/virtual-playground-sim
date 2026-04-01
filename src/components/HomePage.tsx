import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Cpu, MemoryStick, HardDrive, Layers, BarChart3, Zap, Terminal, BookOpen, ChevronDown, Binary, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleField from '@/components/ParticleField';
import GridBackground from '@/components/GridBackground';
import heroBg from '@/assets/hero-bg.jpg';
import { useRef } from 'react';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

const features = [
  {
    icon: Layers,
    title: 'Page Replacement',
    description: 'Simulate FIFO & LRU algorithms with step-by-step frame visualization and fault tracking.',
    tab: 'paging',
    gradient: 'from-primary/20 to-primary/5',
    iconBg: 'bg-primary/10',
    borderHover: 'hover:border-primary/50',
    number: '01',
  },
  {
    icon: HardDrive,
    title: 'Segmentation',
    description: 'Define memory segments, visualize the memory map, and translate virtual addresses in real time.',
    tab: 'segmentation',
    gradient: 'from-accent/20 to-accent/5',
    iconBg: 'bg-accent/10',
    borderHover: 'hover:border-accent/50',
    number: '02',
  },
  {
    icon: MemoryStick,
    title: 'Virtual Memory',
    description: 'Interactive page access with virtual-to-physical mapping, swap tracking, and access logging.',
    tab: 'virtual',
    gradient: 'from-info/20 to-info/5',
    iconBg: 'bg-info/10',
    borderHover: 'hover:border-info/50',
    number: '03',
  },
];

const concepts = [
  { icon: Terminal, label: 'FIFO', desc: 'First-In First-Out replacement', color: 'text-primary' },
  { icon: BarChart3, label: 'LRU', desc: 'Least Recently Used eviction', color: 'text-accent' },
  { icon: Cpu, label: 'Page Faults', desc: 'Memory miss analysis', color: 'text-destructive' },
  { icon: Binary, label: 'Address Maps', desc: 'Virtual to physical', color: 'text-info' },
  { icon: Gauge, label: 'Hit Rate', desc: 'Performance metrics', color: 'text-success' },
  { icon: BookOpen, label: 'Concepts', desc: 'Deep OS theory', color: 'text-accent' },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const HomePage = ({ onNavigate }: HomePageProps) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  return (
    <div className="min-h-screen bg-background overflow-hidden noise">
      {/* ───── HERO ───── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center">
        {/* Layered backgrounds */}
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
          <div className="absolute inset-0 gradient-mesh" />
        </div>

        <ParticleField />
        <GridBackground />

        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        >
          <motion.div variants={stagger} initial="hidden" animate="visible">
            {/* Badge */}
            <motion.div variants={fadeUp} className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass border-glow">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
                </span>
                <span className="text-xs font-mono text-primary/90 tracking-[0.2em] uppercase font-medium">
                  Interactive OS Simulator
                </span>
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl font-bold text-foreground leading-[0.95] tracking-tight font-display"
            >
              Memory
              <br />
              <span className="text-primary text-glow">Management</span>
              <br />
              <span className="text-muted-foreground/60">Visualized</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              className="text-base md:text-lg text-muted-foreground mt-8 max-w-xl mx-auto leading-relaxed"
            >
              Explore paging, segmentation & virtual memory through
              real-time simulations. Watch FIFO and LRU in action.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 justify-center mt-10">
              <Button
                variant="hero"
                size="lg"
                onClick={() => onNavigate('paging')}
                className="gap-3 px-8 h-13 text-base relative overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80 group-hover:from-primary/90 group-hover:to-primary transition-all" />
                <span className="relative flex items-center gap-2">
                  Start Simulating
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    <ArrowRight className="w-5 h-5" />
                  </motion.span>
                </span>
              </Button>
              <Button
                variant="heroOutline"
                size="lg"
                onClick={() => onNavigate('learn')}
                className="gap-2 px-8 h-13 text-base glass"
              >
                <BookOpen className="w-5 h-5" /> Learn Concepts
              </Button>
            </motion.div>

            {/* Animated memory blocks */}
            <motion.div variants={fadeUp} className="mt-20 flex justify-center gap-2 md:gap-3">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.div
                  key={i}
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-xl font-mono text-xs md:text-sm flex items-center justify-center font-bold transition-all duration-500 ${
                    i < 5
                      ? 'border border-primary/30 bg-primary/5 text-primary shimmer'
                      : 'border border-border/50 bg-muted/20 text-muted-foreground border-dashed'
                  }`}
                  initial={{ opacity: 0, y: 20, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 1.2 + i * 0.08, type: 'spring', stiffness: 200 }}
                  whileHover={{ scale: 1.15, y: -6, borderColor: 'hsl(174 80% 46% / 0.6)' }}
                >
                  {i < 5 ? `P${i}` : '—'}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">Scroll</span>
              <ChevronDown className="w-4 h-4 text-muted-foreground/40" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ───── FEATURES ───── */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 gradient-mesh opacity-50" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-xs font-mono text-primary tracking-[0.3em] uppercase mb-4">
              Simulators
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-foreground font-display">
              Three Engines.{' '}
              <span className="text-primary text-glow">One Platform.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground mt-4 max-w-lg mx-auto">
              Dive deep into OS memory management with interactive, real-time visualizations.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={stagger}
          >
            {features.map((feature) => (
              <motion.div
                key={feature.tab}
                variants={fadeUp}
                className={`group relative glass rounded-2xl p-8 ${feature.borderHover} transition-all duration-500 cursor-pointer overflow-hidden border-glow`}
                onClick={() => onNavigate(feature.tab)}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Number */}
                <span className="absolute top-6 right-6 text-6xl font-bold text-foreground/[0.03] font-mono group-hover:text-foreground/[0.06] transition-colors">
                  {feature.number}
                </span>

                <div className="relative z-10">
                  <motion.div
                    className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-6`}
                    whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
                  >
                    <feature.icon className="w-7 h-7 text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 font-display">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  <motion.div
                    className="mt-8 flex items-center gap-2 text-sm font-medium text-primary"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                  >
                    <span className="group-hover:underline underline-offset-4">Launch Simulator</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── CONCEPTS ───── */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-xs font-mono text-accent tracking-[0.3em] uppercase mb-4">
              Learn
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground font-display">
              What You'll <span className="text-accent text-glow-accent">Explore</span>
            </motion.h2>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {concepts.map((concept) => (
              <motion.div
                key={concept.label}
                variants={scaleIn}
                className="glass rounded-xl p-5 text-center group cursor-default border-glow"
                whileHover={{ y: -4, scale: 1.03 }}
              >
                <concept.icon className={`w-6 h-6 ${concept.color} mx-auto mb-3 group-hover:scale-110 transition-transform`} />
                <h4 className="text-xs font-semibold text-foreground mb-1 font-mono">{concept.label}</h4>
                <p className="text-[10px] text-muted-foreground leading-tight">{concept.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-14 border-glow relative overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 gradient-mesh opacity-60" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          <div className="relative z-10">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 glow-primary"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Zap className="w-8 h-8 text-primary" />
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 font-display">
              Ready to simulate?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-md mx-auto">
              No installations. No setup. Just pick a simulator and start learning — interactively.
            </p>
            <Button
              variant="hero"
              size="lg"
              onClick={() => onNavigate('paging')}
              className="gap-3 px-10 h-13 text-base relative overflow-hidden group"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/80" />
              <span className="relative flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="border-t border-border/50 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground font-display">MemSim</span>
            <span className="text-[10px] text-muted-foreground font-mono px-2 py-0.5 rounded-full border border-border">v1.0</span>
          </div>
          <p className="text-xs text-muted-foreground/60 font-mono">
            Interactive Memory Management Simulator • Built for OS Enthusiasts
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
