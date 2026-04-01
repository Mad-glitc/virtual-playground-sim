import { motion } from 'framer-motion';
import { ArrowRight, Cpu, MemoryStick, HardDrive, Layers, BarChart3, Zap, Terminal, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBg from '@/assets/hero-bg.jpg';

interface HomePageProps {
  onNavigate: (tab: string) => void;
}

const features = [
  {
    icon: Layers,
    title: 'Page Replacement',
    description: 'Simulate FIFO & LRU algorithms with step-by-step frame visualization and fault tracking.',
    tab: 'paging',
    accent: 'primary',
  },
  {
    icon: HardDrive,
    title: 'Segmentation',
    description: 'Define memory segments, visualize the memory map, and translate virtual addresses in real time.',
    tab: 'segmentation',
    accent: 'accent',
  },
  {
    icon: MemoryStick,
    title: 'Virtual Memory',
    description: 'Interactive page access with virtual-to-physical mapping, swap tracking, and access logging.',
    tab: 'virtual',
    accent: 'info',
  },
];

const concepts = [
  { icon: Terminal, label: 'FIFO Algorithm', desc: 'First-In First-Out page replacement' },
  { icon: BarChart3, label: 'LRU Algorithm', desc: 'Least Recently Used page eviction' },
  { icon: Cpu, label: 'Page Faults', desc: 'Track and analyze memory misses' },
  { icon: BookOpen, label: 'Address Translation', desc: 'Virtual to physical mapping' },
];

const floatingVariants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

const HomePage = ({ onNavigate }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt="Operating system kernel visualization"
            className="w-full h-full object-cover opacity-30"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        </div>

        {/* Floating particles */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{ left: `${15 + i * 18}%`, top: `${20 + i * 12}%` }}
            animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
          />
        ))}

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono text-primary tracking-wider uppercase">
                Interactive OS Simulator
              </span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight tracking-tight">
              Memory
              <span className="text-primary text-glow"> Management</span>
              <br />
              Visualized
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto leading-relaxed">
              Explore paging, segmentation, and virtual memory through
              hands-on simulations. Watch algorithms like FIFO and LRU
              in action — step by step.
            </p>

            <motion.div
              className="flex flex-wrap gap-4 justify-center mt-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button variant="hero" size="lg" onClick={() => onNavigate('paging')} className="gap-2 px-8">
                Start Simulating <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="lg" onClick={() => onNavigate('learn')} className="gap-2 px-8">
                <BookOpen className="w-5 h-5" /> Learn Concepts
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated memory blocks decoration */}
          <motion.div
            className="mt-16 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <motion.div
                key={i}
                className={`w-12 h-12 md:w-16 md:h-16 rounded-lg border font-mono text-xs md:text-sm flex items-center justify-center font-bold ${
                  i < 5
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-border bg-muted/30 text-muted-foreground border-dashed'
                }`}
                variants={floatingVariants}
                animate="animate"
                style={{ animationDelay: `${i * 0.2}s` }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + i * 0.08, type: 'spring' }}
              >
                {i < 5 ? `P${i}` : '—'}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Three Simulators. <span className="text-primary">One Platform.</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Dive deep into core OS memory management concepts with interactive, real-time visualizations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.tab}
                className="group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => onNavigate(feature.tab)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -4 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:glow-primary transition-shadow">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Launch Simulator <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Concepts Section */}
      <section className="py-20 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-foreground">
              What You'll <span className="text-accent">Explore</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {concepts.map((concept, i) => (
              <motion.div
                key={concept.label}
                className="bg-card border border-border rounded-xl p-5 text-center hover:border-primary/30 transition-colors"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <concept.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-foreground mb-1 font-mono">{concept.label}</h4>
                <p className="text-xs text-muted-foreground">{concept.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center bg-card border border-primary/20 rounded-2xl p-12 glow-primary relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative z-10">
            <Zap className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Ready to understand memory management?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              No installations. No setup. Just pick a simulator and start learning — interactively.
            </p>
            <Button variant="hero" size="lg" onClick={() => onNavigate('paging')} className="gap-2 px-10">
              Get Started <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">MemSim</span>
            <span className="text-xs text-muted-foreground font-mono">v1.0</span>
          </div>
          <p className="text-xs text-muted-foreground font-mono">
            Interactive Memory Management Simulator • Built for OS Enthusiasts
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
