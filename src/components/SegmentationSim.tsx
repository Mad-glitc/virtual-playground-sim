import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, LayoutGrid, Search, ArrowRightLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSegments, type Segment } from '@/lib/memorySimulator';

const TOTAL_MEMORY = 1024;

const SegmentationSim = () => {
  const [segmentDefs, setSegmentDefs] = useState<{ name: string; size: number }[]>([
    { name: 'Code', size: 256 },
    { name: 'Data', size: 128 },
    { name: 'Stack', size: 192 },
    { name: 'Heap', size: 64 },
  ]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [lookupSegment, setLookupSegment] = useState('');
  const [lookupOffset, setLookupOffset] = useState('');
  const [lookupResult, setLookupResult] = useState<{ success: boolean; message: string } | null>(null);

  const addSegment = () => {
    setSegmentDefs([...segmentDefs, { name: `Seg${segmentDefs.length}`, size: 64 }]);
  };

  const removeSegment = (idx: number) => {
    setSegmentDefs(segmentDefs.filter((_, i) => i !== idx));
  };

  const updateSegment = (idx: number, field: 'name' | 'size', value: string) => {
    const updated = [...segmentDefs];
    if (field === 'size') updated[idx].size = Number(value) || 0;
    else updated[idx].name = value;
    setSegmentDefs(updated);
  };

  const buildSegments = () => {
    setSegments(createSegments(segmentDefs, TOTAL_MEMORY));
    setLookupResult(null);
  };

  const translateAddress = () => {
    const segIdx = parseInt(lookupSegment);
    const offset = parseInt(lookupOffset);
    if (isNaN(segIdx) || isNaN(offset)) return;
    const seg = segments[segIdx];
    if (!seg) {
      setLookupResult({ success: false, message: 'Segment not found' });
      return;
    }
    if (offset >= seg.limit) {
      setLookupResult({ success: false, message: `Segmentation fault: offset ${offset} exceeds limit ${seg.limit}` });
      return;
    }
    const physical = seg.base + offset;
    setLookupResult({ success: true, message: `Physical Address: ${physical} (Base ${seg.base} + Offset ${offset})` });
  };

  const usedMemory = segmentDefs.reduce((sum, s) => sum + s.size, 0);
  const usagePct = (usedMemory / TOTAL_MEMORY) * 100;

  return (
    <div className="space-y-6">
      <motion.div
        className="glass rounded-2xl p-6 space-y-5 border-glow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2 font-display">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-accent" />
            </div>
            Define Segments
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${usagePct > 90 ? 'bg-destructive' : usagePct > 70 ? 'bg-accent' : 'bg-primary'}`}
                animate={{ width: `${usagePct}%` }}
                transition={{ type: 'spring' }}
              />
            </div>
            <span className="text-xs font-mono text-muted-foreground">
              {usedMemory}/{TOTAL_MEMORY}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {segmentDefs.map((seg, idx) => (
            <motion.div
              key={idx}
              className="flex gap-3 items-center glass rounded-lg p-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              layout
            >
              <span className="text-xs font-mono text-primary w-6 text-center font-bold">{idx}</span>
              <Input
                value={seg.name}
                onChange={(e) => updateSegment(idx, 'name', e.target.value)}
                className="glass border-border/30 font-mono text-sm flex-1 h-9"
                placeholder="Name"
              />
              <Input
                type="number"
                value={seg.size}
                onChange={(e) => updateSegment(idx, 'size', e.target.value)}
                className="glass border-border/30 font-mono text-sm w-24 h-9"
                placeholder="Size"
              />
              <span className="text-[10px] font-mono text-muted-foreground">B</span>
              <motion.button
                onClick={() => removeSegment(idx)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={addSegment} variant="outline" size="sm" className="gap-1.5 glass">
            <Plus className="w-3 h-3" /> Add
          </Button>
          <Button onClick={buildSegments} size="sm" className="gap-1.5 glow-primary">
            Build Memory Map
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {segments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Memory Map */}
            <div className="glass rounded-2xl p-6 border-glow">
              <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] mb-4">
                Memory Map
              </h3>
              <div className="relative rounded-xl overflow-hidden border border-border/50 h-20">
                {segments.map((seg, i) => {
                  const widthPct = (seg.limit / TOTAL_MEMORY) * 100;
                  const leftPct = (seg.base / TOTAL_MEMORY) * 100;
                  return (
                    <motion.div
                      key={seg.id}
                      className="absolute top-0 h-full flex flex-col items-center justify-center text-xs font-mono font-semibold group cursor-default"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        backgroundColor: seg.color,
                        color: 'hsl(228, 22%, 5%)',
                      }}
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ delay: i * 0.12, type: 'spring', stiffness: 200 }}
                      whileHover={{ filter: 'brightness(1.2)' }}
                    >
                      {widthPct > 8 && (
                        <>
                          <span className="text-[11px] font-bold">{seg.name}</span>
                          <span className="text-[9px] opacity-70">{seg.limit}B</span>
                        </>
                      )}
                    </motion.div>
                  );
                })}
                {(() => {
                  const lastSeg = segments[segments.length - 1];
                  const usedEnd = lastSeg ? lastSeg.base + lastSeg.limit : 0;
                  const freePct = ((TOTAL_MEMORY - usedEnd) / TOTAL_MEMORY) * 100;
                  if (freePct <= 0) return null;
                  return (
                    <div
                      className="absolute top-0 h-full flex items-center justify-center text-xs font-mono text-muted-foreground/50 border-l border-border/30"
                      style={{ left: `${(usedEnd / TOTAL_MEMORY) * 100}%`, width: `${freePct}%` }}
                    >
                      Free
                    </div>
                  );
                })()}
              </div>

              {/* Segment Table */}
              <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="text-muted-foreground text-[10px] uppercase tracking-[0.15em]">
                      <th className="text-left py-2 px-3">#</th>
                      <th className="text-left py-2 px-3">Name</th>
                      <th className="text-left py-2 px-3">Base</th>
                      <th className="text-left py-2 px-3">Limit</th>
                      <th className="text-left py-2 px-3">Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segments.map((seg, i) => (
                      <motion.tr
                        key={seg.id}
                        className="border-t border-border/30 hover:bg-muted/20 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <td className="py-2.5 px-3 text-muted-foreground">{i}</td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
                            {seg.name}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-primary">{seg.base}</td>
                        <td className="py-2.5 px-3 text-accent">{seg.limit}</td>
                        <td className="py-2.5 px-3 text-muted-foreground">{seg.base}–{seg.base + seg.limit - 1}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Address Translation */}
            <div className="glass rounded-2xl p-6 space-y-4 border-glow">
              <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <ArrowRightLeft className="w-3.5 h-3.5" /> Address Translation
              </h3>
              <div className="flex gap-3 items-end flex-wrap">
                <div className="space-y-1">
                  <Label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Segment #</Label>
                  <Input
                    type="number"
                    value={lookupSegment}
                    onChange={(e) => setLookupSegment(e.target.value)}
                    className="glass border-border/30 font-mono text-sm w-24 h-10"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Offset</Label>
                  <Input
                    type="number"
                    value={lookupOffset}
                    onChange={(e) => setLookupOffset(e.target.value)}
                    className="glass border-border/30 font-mono text-sm w-32 h-10"
                  />
                </div>
                <Button onClick={translateAddress} size="sm" className="gap-1.5 h-10 glow-primary">
                  <Search className="w-3.5 h-3.5" /> Translate
                </Button>
              </div>
              <AnimatePresence>
                {lookupResult && (
                  <motion.div
                    className={`text-sm font-mono p-4 rounded-xl ${
                      lookupResult.success
                        ? 'glass text-success border border-success/20'
                        : 'glass text-destructive border border-destructive/20 glow-destructive'
                    }`}
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {lookupResult.success ? '✅ ' : '❌ '}{lookupResult.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SegmentationSim;
