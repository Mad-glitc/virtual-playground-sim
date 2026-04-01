import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, LayoutGrid } from 'lucide-react';
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
  const [lookupResult, setLookupResult] = useState<string | null>(null);

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
      setLookupResult('❌ Segment not found');
      return;
    }
    if (offset >= seg.limit) {
      setLookupResult(`❌ Segmentation fault: offset ${offset} exceeds limit ${seg.limit}`);
      return;
    }
    const physical = seg.base + offset;
    setLookupResult(`✅ Physical Address: ${physical} (Base ${seg.base} + Offset ${offset})`);
  };

  const usedMemory = segmentDefs.reduce((sum, s) => sum + s.size, 0);

  return (
    <div className="space-y-6">
      <motion.div
        className="bg-card border border-border rounded-xl p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-primary" />
            Define Segments
          </h2>
          <span className="text-xs font-mono text-muted-foreground">
            {usedMemory} / {TOTAL_MEMORY} bytes used
          </span>
        </div>

        <div className="space-y-2">
          {segmentDefs.map((seg, idx) => (
            <motion.div
              key={idx}
              className="flex gap-3 items-center"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <span className="text-xs font-mono text-muted-foreground w-6">{idx}</span>
              <Input
                value={seg.name}
                onChange={(e) => updateSegment(idx, 'name', e.target.value)}
                className="bg-muted border-border font-mono text-sm flex-1"
                placeholder="Name"
              />
              <Input
                type="number"
                value={seg.size}
                onChange={(e) => updateSegment(idx, 'size', e.target.value)}
                className="bg-muted border-border font-mono text-sm w-24"
                placeholder="Size"
              />
              <span className="text-xs font-mono text-muted-foreground">bytes</span>
              <Button size="icon" variant="ghost" onClick={() => removeSegment(idx)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button onClick={addSegment} variant="outline" size="sm" className="gap-1">
            <Plus className="w-3 h-3" /> Add Segment
          </Button>
          <Button onClick={buildSegments} size="sm" className="gap-1">
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
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider mb-4">
                Memory Map
              </h3>
              <div className="relative rounded-lg overflow-hidden border border-border h-16">
                {segments.map((seg, i) => {
                  const widthPct = (seg.limit / TOTAL_MEMORY) * 100;
                  const leftPct = (seg.base / TOTAL_MEMORY) * 100;
                  return (
                    <motion.div
                      key={seg.id}
                      className="absolute top-0 h-full flex items-center justify-center text-xs font-mono font-medium"
                      style={{
                        left: `${leftPct}%`,
                        width: `${widthPct}%`,
                        backgroundColor: seg.color,
                        color: 'hsl(220, 20%, 7%)',
                      }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: i * 0.1, type: 'spring' }}
                    >
                      {widthPct > 8 && seg.name}
                    </motion.div>
                  );
                })}
                {/* Free space */}
                {(() => {
                  const lastSeg = segments[segments.length - 1];
                  const usedEnd = lastSeg ? lastSeg.base + lastSeg.limit : 0;
                  const freePct = ((TOTAL_MEMORY - usedEnd) / TOTAL_MEMORY) * 100;
                  if (freePct <= 0) return null;
                  return (
                    <div
                      className="absolute top-0 h-full flex items-center justify-center text-xs font-mono text-muted-foreground border-l border-border"
                      style={{ left: `${(usedEnd / TOTAL_MEMORY) * 100}%`, width: `${freePct}%` }}
                    >
                      Free
                    </div>
                  );
                })()}
              </div>

              {/* Segment Table */}
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm font-mono">
                  <thead>
                    <tr className="text-muted-foreground text-xs uppercase tracking-wider">
                      <th className="text-left py-2 px-3">#</th>
                      <th className="text-left py-2 px-3">Name</th>
                      <th className="text-left py-2 px-3">Base</th>
                      <th className="text-left py-2 px-3">Limit</th>
                      <th className="text-left py-2 px-3">Range</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segments.map((seg, i) => (
                      <tr key={seg.id} className="border-t border-border">
                        <td className="py-2 px-3 text-muted-foreground">{i}</td>
                        <td className="py-2 px-3">
                          <span className="inline-flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: seg.color }} />
                            {seg.name}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-primary">{seg.base}</td>
                        <td className="py-2 px-3 text-accent">{seg.limit}</td>
                        <td className="py-2 px-3 text-muted-foreground">{seg.base}–{seg.base + seg.limit - 1}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Address Translation */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-mono text-muted-foreground uppercase tracking-wider">
                Address Translation
              </h3>
              <div className="flex gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs font-mono text-muted-foreground">Segment #</Label>
                  <Input
                    type="number"
                    value={lookupSegment}
                    onChange={(e) => setLookupSegment(e.target.value)}
                    className="bg-muted border-border font-mono text-sm w-24"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-mono text-muted-foreground">Offset</Label>
                  <Input
                    type="number"
                    value={lookupOffset}
                    onChange={(e) => setLookupOffset(e.target.value)}
                    className="bg-muted border-border font-mono text-sm w-32"
                  />
                </div>
                <Button onClick={translateAddress} size="sm">
                  Translate
                </Button>
              </div>
              {lookupResult && (
                <motion.p
                  className="text-sm font-mono p-3 rounded-lg bg-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {lookupResult}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SegmentationSim;
