import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HardDrive, MemoryStick, ArrowRight, Plus, Play, RotateCcw } from 'lucide-react';
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

    // Page fault
    const inMemoryPages = newPages.filter((p) => p.inMemory);
    let swappedOut: number | null = null;

    if (inMemoryPages.length >= physicalFrames) {
      // FIFO-like: swap out first loaded
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
          ? `Page ${pageId} → FAULT (swapped out Page ${swappedOut}, loaded to Frame ${page.frameIndex})`
          : `Page ${pageId} → FAULT (loaded to Frame ${page.frameIndex})`,
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

  return (
    <div className="space-y-6">
      <motion.div
        className="bg-card border border-border rounded-xl p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
          <MemoryStick className="w-4 h-4 text-primary" />
          Virtual Memory Setup
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
              Virtual Pages
            </Label>
            <Input
              type="number"
              min={1}
              max={16}
              value={totalPages}
              onChange={(e) => setTotalPages(Number(e.target.value))}
              className="bg-muted border-border font-mono text-sm"
              disabled={initialized}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs font-mono uppercase tracking-wider">
              Physical Frames
            </Label>
            <Input
              type="number"
              min={1}
              max={8}
              value={physicalFrames}
              onChange={(e) => setPhysicalFrames(Number(e.target.value))}
              className="bg-muted border-border font-mono text-sm"
              disabled={initialized}
            />
          </div>
        </div>

        <div className="flex gap-2">
          {!initialized ? (
            <Button onClick={initialize} className="gap-2">
              <Play className="w-4 h-4" /> Initialize
            </Button>
          ) : (
            <Button onClick={reset} variant="outline" className="gap-2">
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
            {/* Access Input */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                Access Pages
              </h3>
              <div className="flex gap-3">
                <Input
                  value={accessInput}
                  onChange={(e) => setAccessInput(e.target.value)}
                  placeholder="e.g. 0 2 4 1 3"
                  className="bg-muted border-border font-mono text-sm flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleAccessSubmit()}
                />
                <Button onClick={handleAccessSubmit} className="gap-2">
                  <Plus className="w-4 h-4" /> Access
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => accessPage(i)}
                    className={`w-10 h-10 rounded-lg font-mono text-sm font-medium transition-all ${
                      pages[i]?.inMemory
                        ? 'bg-primary/20 text-primary border border-primary/40'
                        : 'bg-muted text-muted-foreground border border-border hover:border-primary/30'
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
            </div>

            {/* Visualization */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Virtual Memory */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <HardDrive className="w-4 h-4" /> Virtual Pages
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {pages.map((p) => (
                    <motion.div
                      key={p.id}
                      className={`relative rounded-lg p-3 text-center font-mono text-sm border transition-colors ${
                        p.inMemory
                          ? 'bg-primary/10 border-primary/40 text-primary'
                          : 'bg-muted/50 border-border text-muted-foreground'
                      }`}
                      layout
                    >
                      <div className="font-bold">P{p.id}</div>
                      <div className="text-[10px] mt-1">
                        {p.inMemory ? `F${p.frameIndex}` : 'Disk'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Physical Memory */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MemoryStick className="w-4 h-4" /> Physical Frames
                </h3>
                <div className="space-y-2">
                  {Array.from({ length: physicalFrames }, (_, fIdx) => {
                    const page = pages.find((p) => p.inMemory && p.frameIndex === fIdx);
                    return (
                      <motion.div
                        key={fIdx}
                        className={`rounded-lg p-3 font-mono text-sm border flex items-center justify-between ${
                          page
                            ? 'bg-primary/10 border-primary/40'
                            : 'bg-muted/30 border-border border-dashed'
                        }`}
                        layout
                      >
                        <span className="text-muted-foreground">Frame {fIdx}</span>
                        <span className={page ? 'text-primary font-bold' : 'text-muted-foreground'}>
                          {page ? `Page ${page.id}` : 'Empty'}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Access Log */}
            {logs.length > 0 && (
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">
                  Access Log
                </h3>
                <div className="space-y-1 max-h-60 overflow-y-auto">
                  {logs.map((log, i) => (
                    <motion.div
                      key={i}
                      className={`text-xs font-mono px-3 py-2 rounded-md ${
                        log.type === 'fault' ? 'bg-destructive/10 text-destructive' : 'bg-success/10 text-success'
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <span className="text-muted-foreground mr-2">[{log.step}]</span>
                      {log.message}
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
