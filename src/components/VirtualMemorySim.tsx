import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, MemoryStick, Plus, Play, RotateCcw, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VPage {
  id: number;
  inMemory: boolean;
  frameIndex: number | null;
  dirty: boolean;
  referenced: boolean;
}

interface AccessLog {
  step: number;
  pageId: number;
  type: 'hit' | 'fault';
  swappedOut: number | null;
  message: string;
}

const VirtualMemorySim = () => {
  const [totalPages, setTotalPages] = useState(8);
  const [physicalFrames, setPhysicalFrames] = useState(4);
  const [pages, setPages] = useState<VPage[]>([]);
  const [logs, setLogs] = useState<AccessLog[]>([]);
  const [accessInput, setAccessInput] = useState('');
  const [initialized, setInitialized] = useState(false);
  const [stepCount, setStepCount] = useState(0);

  const initialize = () => {
    const p: VPage[] = Array.from({ length: totalPages }, (_, i) => ({
      id: i,
      inMemory: false,
      frameIndex: null,
      dirty: false,
      referenced: false,
    }));
    setPages(p);
    setLogs([]);
    setInitialized(true);
    setStepCount(0);
  };

  const accessPage = (pageId: number) => {
    if (pageId < 0 || pageId >= totalPages) return;
    const newPages = [...pages];
    const step = stepCount + 1;
    setStepCount(step);

    const page = newPages[pageId];
    if (page.inMemory) {
      page.referenced = true;
      setPages(newPages);
      setLogs((prev) => [...prev, { step, pageId, type: 'hit', swappedOut: null, message: `Page ${pageId} → HIT (Frame ${page.frameIndex})` }]);
      return;
    }

    const inMemoryPages = newPages.filter((p) => p.inMemory);
    let swappedOut: number | null = null;

    if (inMemoryPages.length >= physicalFrames) {
      const victim = inMemoryPages[0];
      swappedOut = victim.id;
      const freedFrame = victim.frameIndex;
      victim.inMemory = false;
      victim.frameIndex = null;
      victim.referenced = false;
      page.frameIndex = freedFrame;
    } else {
      page.frameIndex = inMemoryPages.length;
    }

    page.inMemory = true;
    page.referenced = true;
    setPages(newPages);
    setLogs((prev) => [
      ...prev,
      {
        step,
        pageId,
        type: 'fault',
        swappedOut,
        message: swappedOut !== null
          ? `Page ${pageId} → FAULT (swapped out P${swappedOut} → Frame ${page.frameIndex})`
          : `Page ${pageId} → FAULT (loaded → Frame ${page.frameIndex})`,
      },
    ]);
  };

  const handleAccessSubmit = () => {
    const ids = accessInput.split(/[\s,]+/).map(Number).filter((n) => !isNaN(n));
    ids.forEach((id) => accessPage(id));
    setAccessInput('');
  };

  const reset = () => {
    setInitialized(false);
    setPages([]);
    setLogs([]);
    setStepCount(0);
  };

  const faults = logs.filter((l) => l.type === 'fault').length;
  const hits = logs.filter((l) => l.type === 'hit').length;

  return (
    <div className="space-y-6">
      <motion.div
        className="glass rounded-2xl p-6 space-y-5 border-glow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-display">
          <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center">
            <MemoryStick className="w-4 h-4 text-info" />
          </div>
          Virtual Memory Setup
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em]">Virtual Pages</Label>
            <Input type="number" min={1} max={16} value={totalPages} onChange={(e) => setTotalPages(Number(e.target.value))} className="glass border-border/30 font-mono text-sm h-11" disabled={initialized} />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-[10px] font-mono uppercase tracking-[0.2em]">Physical Frames</Label>
            <Input type="number" min={1} max={8} value={physicalFrames} onChange={(e) => setPhysicalFrames(Number(e.target.value))} className="glass border-border/30 font-mono text-sm h-11" disabled={initialized} />
          </div>
        </div>

        <div className="flex gap-2">
          {!initialized ? (
            <Button onClick={initialize} className="gap-2 glow-primary">
              <Play className="w-4 h-4" /> Initialize
            </Button>
          ) : (
            <Button onClick={reset} variant="outline" className="gap-2 glass">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {initialized && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Stats bar */}
            {logs.length > 0 && (
              <motion.div
                className="grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {[
                  { label: 'Accesses', value: logs.length, color: 'text-foreground' },
                  { label: 'Faults', value: faults, color: 'text-destructive' },
                  { label: 'Hits', value: hits, color: 'text-success' },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-xl p-4 border-glow text-center">
                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{s.label}</p>
                    <p className={`text-2xl font-bold font-mono mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Access Input */}
            <div className="glass rounded-2xl p-6 space-y-4 border-glow">
              <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em]">
                Access Pages
              </h3>
              <div className="flex gap-3">
                <Input
                  value={accessInput}
                  onChange={(e) => setAccessInput(e.target.value)}
                  placeholder="e.g. 0 2 4 1 3"
                  className="glass border-border/30 font-mono text-sm flex-1 h-11"
                  onKeyDown={(e) => e.key === 'Enter' && handleAccessSubmit()}
                />
                <Button onClick={handleAccessSubmit} className="gap-2 h-11 glow-primary">
                  <Plus className="w-4 h-4" /> Access
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => accessPage(i)}
                    className={`w-11 h-11 rounded-xl font-mono text-sm font-semibold transition-all ${
                      pages[i]?.inMemory
                        ? 'bg-primary/15 text-primary border border-primary/30 glow-primary'
                        : 'glass text-muted-foreground border border-border/30 hover:border-primary/30 hover:text-foreground'
                    }`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {i}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Virtual Memory */}
              <div className="glass rounded-2xl p-6 border-glow">
                <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <HardDrive className="w-3.5 h-3.5" /> Virtual Pages (Disk)
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {pages.map((p) => (
                    <motion.div
                      key={p.id}
                      className={`relative rounded-xl p-3 text-center font-mono text-sm border transition-all ${
                        p.inMemory
                          ? 'bg-primary/8 border-primary/30 text-primary'
                          : 'bg-muted/20 border-border/30 text-muted-foreground'
                      }`}
                      layout
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="font-bold text-base">P{p.id}</div>
                      <div className="text-[10px] mt-1 opacity-70">
                        {p.inMemory ? (
                          <motion.span
                            key={`mem-${p.frameIndex}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-primary"
                          >
                            F{p.frameIndex}
                          </motion.span>
                        ) : 'Disk'}
                      </div>
                      {p.inMemory && (
                        <motion.div
                          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          layoutId={`indicator-${p.id}`}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Physical Memory */}
              <div className="glass rounded-2xl p-6 border-glow">
                <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <MemoryStick className="w-3.5 h-3.5" /> Physical Frames (RAM)
                </h3>
                <div className="space-y-2">
                  {Array.from({ length: physicalFrames }, (_, fIdx) => {
                    const page = pages.find((p) => p.inMemory && p.frameIndex === fIdx);
                    return (
                      <motion.div
                        key={fIdx}
                        className={`rounded-xl p-3.5 font-mono text-sm border flex items-center justify-between ${
                          page
                            ? 'bg-primary/8 border-primary/30'
                            : 'bg-muted/10 border-border/20 border-dashed'
                        }`}
                        layout
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      >
                        <span className="text-muted-foreground text-xs">Frame {fIdx}</span>
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={page ? page.id : 'empty'}
                            className={page ? 'text-primary font-bold' : 'text-muted-foreground/40'}
                            initial={{ opacity: 0, y: -10, rotateX: -90 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            exit={{ opacity: 0, y: 10, rotateX: 90 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            {page ? `Page ${page.id}` : 'Empty'}
                          </motion.span>
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Access Log */}
            {logs.length > 0 && (
              <div className="glass rounded-2xl p-6 border-glow">
                <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">
                  Access Log
                </h3>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-2">
                  {[...logs].reverse().map((log, i) => (
                    <motion.div
                      key={logs.length - 1 - i}
                      className={`text-xs font-mono px-4 py-2.5 rounded-lg flex items-center gap-2 ${
                        log.type === 'fault'
                          ? 'bg-destructive/5 text-destructive border border-destructive/10'
                          : 'bg-success/5 text-success border border-success/10'
                      }`}
                      initial={{ opacity: 0, x: -20, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-muted-foreground/50 w-8">[{log.step}]</span>
                      <span className={`w-12 font-bold ${log.type === 'fault' ? 'text-destructive' : 'text-success'}`}>
                        {log.type === 'fault' ? 'FAULT' : 'HIT'}
                      </span>
                      <span className="text-muted-foreground">{log.message}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VirtualMemorySim;
