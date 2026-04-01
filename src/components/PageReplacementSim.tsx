import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Zap, XCircle, CheckCircle2, ChevronRight, ChevronLeft, SkipForward, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AnimatedCounter from '@/components/AnimatedCounter';
import { simulatePageReplacement, type Algorithm, type SimulationResult } from '@/lib/memorySimulator';

const PageReplacementSim = () => {
  const [refString, setRefString] = useState('7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1');
  const [frameCount, setFrameCount] = useState(3);
  const [algorithm, setAlgorithm] = useState<Algorithm>('FIFO');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const runSimulation = () => {
    const pages = refString.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    if (pages.length === 0) return;
    const res = simulatePageReplacement(pages, frameCount, algorithm);
    setResult(res);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const nextStep = useCallback(() => {
    if (!result) return;
    if (currentStep < result.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setIsPlaying(false);
    }
  }, [result, currentStep]);

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const reset = () => {
    setResult(null);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Auto-play
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(nextStep, 600);
    return () => clearInterval(timer);
  }, [isPlaying, nextStep]);

  const step = result?.steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <motion.div
        className="glass rounded-2xl p-6 space-y-5 border-glow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-display">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em]">
              Reference String
            </Label>
            <Input
              value={refString}
              onChange={(e) => setRefString(e.target.value)}
              placeholder="e.g. 7 0 1 2 0 3 0 4"
              className="glass border-border/50 font-mono text-sm h-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em]">
                Frames
              </Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={frameCount}
                onChange={(e) => setFrameCount(Number(e.target.value))}
                className="glass border-border/50 font-mono text-sm h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em]">
                Algorithm
              </Label>
              <div className="flex gap-2">
                {(['FIFO', 'LRU'] as Algorithm[]).map((a) => (
                  <motion.button
                    key={a}
                    onClick={() => setAlgorithm(a)}
                    className={`flex-1 h-11 rounded-lg text-sm font-mono font-semibold transition-all ${
                      algorithm === a
                        ? 'bg-primary text-primary-foreground glow-primary'
                        : 'glass text-muted-foreground hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {a}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Button onClick={runSimulation} className="gap-2 glow-primary">
            <Play className="w-4 h-4" /> Run Simulation
          </Button>
          <Button onClick={reset} variant="outline" className="gap-2 glass">
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>
      </motion.div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Requests', value: result.steps.length, color: 'text-foreground', bg: 'from-foreground/5' },
                { label: 'Page Faults', value: result.totalFaults, color: 'text-destructive', bg: 'from-destructive/10' },
                { label: 'Hits', value: result.totalHits, color: 'text-success', bg: 'from-success/10' },
                { label: 'Hit Rate', value: result.hitRate * 100, color: 'text-primary', bg: 'from-primary/10', suffix: '%' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className={`glass rounded-2xl p-5 border-glow relative overflow-hidden`}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.08, type: 'spring' }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} to-transparent`} />
                  <div className="relative">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                    <p className={`text-3xl font-bold font-mono mt-2 ${stat.color}`}>
                      <AnimatedCounter value={Math.round(stat.value)} suffix={stat.suffix || ''} />
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Step Navigator */}
            <div className="glass rounded-2xl p-6 border-glow">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-[0.2em]">
                    Step Navigator
                  </h3>
                  <p className="text-lg font-bold font-mono text-foreground mt-1">
                    {currentStep + 1} <span className="text-muted-foreground font-normal">/ {result.steps.length}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={prevStep} disabled={currentStep === 0} className="glass w-9 h-9 p-0">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="glass w-9 h-9 p-0"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <SkipForward className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={nextStep} disabled={currentStep >= result.steps.length - 1} className="glass w-9 h-9 p-0">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 rounded-full bg-muted mb-6 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  animate={{ width: `${((currentStep + 1) / result.steps.length) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              </div>

              {step && (
                <div className="space-y-5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-mono text-muted-foreground">Requesting:</span>
                    <motion.span
                      key={step.requestedPage + '-' + currentStep}
                      className="text-2xl font-bold font-mono text-accent"
                      initial={{ scale: 1.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      {step.requestedPage}
                    </motion.span>
                    <motion.span
                      key={`badge-${currentStep}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg font-semibold ${
                        step.isFault
                          ? 'text-destructive bg-destructive/10 glow-destructive'
                          : 'text-success bg-success/10'
                      }`}
                    >
                      {step.isFault ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {step.isFault ? 'PAGE FAULT' : 'HIT'}
                    </motion.span>
                    {step.replacedPage !== null && (
                      <motion.span
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xs font-mono text-muted-foreground glass px-2 py-1 rounded-md"
                      >
                        Evicted P{step.replacedPage}
                      </motion.span>
                    )}
                  </div>

                  {/* Frame Visualization */}
                  <div className="flex gap-3 flex-wrap">
                    {step.frames.map((page, idx) => (
                      <motion.div
                        key={idx}
                        className={`w-20 h-24 rounded-xl border-2 flex flex-col items-center justify-center font-mono relative overflow-hidden ${
                          page === step.requestedPage && step.isFault
                            ? 'border-accent/60 bg-accent/5 glow-accent'
                            : page === step.requestedPage
                            ? 'border-success/60 bg-success/5'
                            : page !== null
                            ? 'border-border/60 bg-muted/30'
                            : 'border-border/30 border-dashed bg-muted/10'
                        }`}
                        layout
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                      >
                        {page === step.requestedPage && (
                          <motion.div
                            className="absolute inset-0 shimmer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          />
                        )}
                        <span className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">Frame</span>
                        <span className="text-[10px] text-muted-foreground font-semibold">{idx}</span>
                        <motion.span
                          key={`${page}-${currentStep}`}
                          className="text-2xl font-bold mt-1"
                          initial={{ rotateX: -90, opacity: 0 }}
                          animate={{ rotateX: 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        >
                          {page !== null ? page : '—'}
                        </motion.span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="glass rounded-2xl p-6 border-glow overflow-x-auto">
              <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">
                Timeline
              </h3>
              <div className="flex gap-1.5 min-w-max">
                {result.steps.map((s, i) => (
                  <motion.button
                    key={i}
                    onClick={() => { setCurrentStep(i); setIsPlaying(false); }}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all min-w-[38px] ${
                      i === currentStep
                        ? 'bg-primary/15 ring-1 ring-primary/50'
                        : i < currentStep
                        ? 'opacity-60 hover:opacity-100'
                        : 'hover:bg-muted/50'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-xs font-mono text-muted-foreground">{s.requestedPage}</span>
                    <motion.div
                      className={`w-2.5 h-2.5 rounded-full ${s.isFault ? 'bg-destructive' : 'bg-success'}`}
                      initial={i === currentStep ? { scale: 0 } : {}}
                      animate={i === currentStep ? { scale: [0, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PageReplacementSim;
