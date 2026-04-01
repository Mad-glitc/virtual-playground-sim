export type Algorithm = 'FIFO' | 'LRU';

export interface PageFrame {
  pageNumber: number | null;
  loadedAt: number;
  lastUsedAt: number;
}

export interface PageFaultStep {
  step: number;
  requestedPage: number;
  frames: (number | null)[];
  isFault: boolean;
  replacedPage: number | null;
}

export interface SimulationResult {
  steps: PageFaultStep[];
  totalFaults: number;
  totalHits: number;
  faultRate: number;
  hitRate: number;
}

export interface Segment {
  id: string;
  name: string;
  base: number;
  limit: number;
  color: string;
}

export interface MemoryBlock {
  id: string;
  start: number;
  size: number;
  processName: string | null;
  isFree: boolean;
  color: string;
}

const SEGMENT_COLORS = [
  'hsl(174, 72%, 52%)',
  'hsl(36, 90%, 58%)',
  'hsl(210, 80%, 58%)',
  'hsl(152, 60%, 48%)',
  'hsl(330, 65%, 55%)',
  'hsl(270, 60%, 58%)',
];

export function simulatePageReplacement(
  referenceString: number[],
  frameCount: number,
  algorithm: Algorithm
): SimulationResult {
  const frames: PageFrame[] = Array.from({ length: frameCount }, () => ({
    pageNumber: null,
    loadedAt: 0,
    lastUsedAt: 0,
  }));

  const steps: PageFaultStep[] = [];
  let totalFaults = 0;
  let time = 0;

  for (const page of referenceString) {
    time++;
    const existingIdx = frames.findIndex((f) => f.pageNumber === page);

    if (existingIdx !== -1) {
      frames[existingIdx].lastUsedAt = time;
      steps.push({
        step: time,
        requestedPage: page,
        frames: frames.map((f) => f.pageNumber),
        isFault: false,
        replacedPage: null,
      });
    } else {
      totalFaults++;
      const emptyIdx = frames.findIndex((f) => f.pageNumber === null);
      let replacedPage: number | null = null;

      if (emptyIdx !== -1) {
        frames[emptyIdx] = { pageNumber: page, loadedAt: time, lastUsedAt: time };
      } else {
        let victimIdx: number;
        if (algorithm === 'FIFO') {
          victimIdx = frames.reduce((minIdx, frame, idx) =>
            frame.loadedAt < frames[minIdx].loadedAt ? idx : minIdx, 0);
        } else {
          victimIdx = frames.reduce((minIdx, frame, idx) =>
            frame.lastUsedAt < frames[minIdx].lastUsedAt ? idx : minIdx, 0);
        }
        replacedPage = frames[victimIdx].pageNumber;
        frames[victimIdx] = { pageNumber: page, loadedAt: time, lastUsedAt: time };
      }

      steps.push({
        step: time,
        requestedPage: page,
        frames: frames.map((f) => f.pageNumber),
        isFault: true,
        replacedPage,
      });
    }
  }

  const totalHits = referenceString.length - totalFaults;
  return {
    steps,
    totalFaults,
    totalHits,
    faultRate: referenceString.length > 0 ? totalFaults / referenceString.length : 0,
    hitRate: referenceString.length > 0 ? totalHits / referenceString.length : 0,
  };
}

export function createSegments(
  segmentDefs: { name: string; size: number }[],
  totalMemory: number
): Segment[] {
  const segments: Segment[] = [];
  let currentBase = 0;

  segmentDefs.forEach((def, i) => {
    if (currentBase + def.size <= totalMemory) {
      segments.push({
        id: `seg-${i}`,
        name: def.name,
        base: currentBase,
        limit: def.size,
        color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
      });
      currentBase += def.size;
    }
  });

  return segments;
}

export function createMemoryBlocks(
  allocations: { name: string; size: number }[],
  totalMemory: number
): MemoryBlock[] {
  const blocks: MemoryBlock[] = [];
  let currentAddr = 0;

  allocations.forEach((alloc, i) => {
    if (currentAddr + alloc.size <= totalMemory) {
      blocks.push({
        id: `block-${i}`,
        start: currentAddr,
        size: alloc.size,
        processName: alloc.name,
        isFree: false,
        color: SEGMENT_COLORS[i % SEGMENT_COLORS.length],
      });
      currentAddr += alloc.size;
    }
  });

  if (currentAddr < totalMemory) {
    blocks.push({
      id: 'free',
      start: currentAddr,
      size: totalMemory - currentAddr,
      processName: null,
      isFree: true,
      color: 'hsl(220, 14%, 14%)',
    });
  }

  return blocks;
}
