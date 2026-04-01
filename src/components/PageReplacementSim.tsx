import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Zap, XCircle, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  const playStep = () => {
    if (!result) return;
    if (currentStep < result.steps.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const reset = () => {
    setResult(null);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const step = result?.steps[currentStep];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <motion.div
        className="bg-card border border-border rounded-xl p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Zap className="w-4 h-4 text-primary" />
          Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
              Reference String
            </Label>
            <Input
              value={refString}
              onChange={(e) => setRefString(e.target.value)}
              placeholder="e.g. 7 0 1 2 0 3 0 4"
              className="bg-muted border-border font-mono text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
                Frames
              </Label>
              <Input
                type="number"
                min={1}
                max={10}
                value={frameCount}
                onChange={(e) => setFrameCount(Number(e.target.value))}
                className="bg-muted border-border font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
                Algorithm
              </Label>
              <div className="flex gap-2">
                {(['FIFO', 'LRU'] as Algorithm[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAlgorithm(a)}
                    className={`flex-1 py-2 rounded-md text-sm font-mono font-medium transition-all ${
                      algorithm === a
                        ? 'bg-primary text-primary-foreground glow-primary'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={runSimulation} className="gap-2">
            <Play className="w-4 h-4" /> Run Simulation
          </Button>
          <Button onClick={reset} variant="outline" className="gap-2">
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
                { label: 'Total Requests', value: result.steps.length, color: 'text-foreground' },
                { label: 'Page Faults', value: result.totalFaults, color: 'text-destructive' },
                { label: 'Hits', value: result.totalHits, color: 'text-success' },
                { label: 'Hit Rate', value: `${(result.hitRate * 100).toFixed(1)}%`, color: 'text-primary' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="bg-card border border-border rounded-xl p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className={`text-2xl font-bold font-mono mt-1 ${stat.color}`}>{stat.value}</p>
                </motion.div>
              ))}
            </div>

            {/* Step Navigator */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                  Step {currentStep + 1} / {result.steps.length}
                </h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={playStep} disabled={currentStep >= result.steps.length - 1}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {step && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-muted-foreground">Requesting page:</span>
                    <span className="text-lg font-bold font-mono text-accent">{step.requestedPage}</span>
                    {step.isFault ? (
                      <span className="flex items-center gap-1 text-xs font-mono text-destructive bg-destructive/10 px-2 py-1 rounded-md">
                        <XCircle className="w-3 h-3" /> FAULT
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-mono text-success bg-success/10 px-2 py-1 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> HIT
                      </span>
                    )}
                    {step.replacedPage !== null && (
                      <span className="text-xs font-mono text-muted-foreground">
                        Replaced page {step.replacedPage}
                      </span>
                    )}
                  </div>

                  {/* Frame Visualization */}
                  <div className="flex gap-3">
                    {step.frames.map((page, idx) => (
                      <motion.div
                        key={idx}
                        className={`w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center font-mono ${
                          page === step.requestedPage && step.isFault
                            ? 'border-accent bg-accent/10 glow-accent'
                            : page === step.requestedPage
                            ? 'border-success bg-success/10'
                            : page !== null
                            ? 'border-border bg-muted'
                            : 'border-border border-dashed bg-muted/50'
                        }`}
                        layout
                        transition={{ type: 'spring', bounce: 0.3 }}
                      >
                        <span className="text-[10px] text-muted-foreground">F{idx}</span>
                        <span className="text-xl font-bold">
                          {page !== null ? page : '—'}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div className="bg-card border border-border rounded-xl p-6 overflow-x-auto">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">
                Timeline
              </h3>
              <div className="flex gap-1 min-w-max">
                {result.steps.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentStep(i)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-md transition-all min-w-[40px] ${
                      i === currentStep
                        ? 'bg-primary/20 ring-1 ring-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <span className="text-xs font-mono text-muted-foreground">{s.requestedPage}</span>
                    <div
                      className={`w-3 h-3 rounded-full ${
                        s.isFault ? 'bg-destructive' : 'bg-success'
                      }`}
                    />
                  </button>
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
