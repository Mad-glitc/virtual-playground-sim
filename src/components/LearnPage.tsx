import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Cpu, HardDrive, MemoryStick, Layers, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LearnPageProps {
  onBack: () => void;
}

const topics = [
  {
    icon: Layers,
    title: 'Paging',
    color: 'text-primary',
    content: [
      'Paging divides physical memory into fixed-size blocks called frames, and logical memory into same-sized blocks called pages.',
      'When a process needs memory, the OS maps its virtual pages to physical frames using a page table.',
      'This eliminates external fragmentation and allows non-contiguous memory allocation.',
    ],
  },
  {
    icon: HardDrive,
    title: 'Segmentation',
    color: 'text-accent',
    content: [
      'Segmentation divides memory into variable-sized segments based on logical divisions like code, data, stack, and heap.',
      'Each segment has a base address and a limit. Addresses are translated as: Physical = Base + Offset.',
      'If the offset exceeds the segment limit, a segmentation fault occurs — protecting memory boundaries.',
    ],
  },
  {
    icon: MemoryStick,
    title: 'Virtual Memory',
    color: 'text-info',
    content: [
      'Virtual memory creates an illusion of a much larger memory space by using disk as an extension of RAM.',
      'Pages not currently needed are stored on disk. When accessed, a page fault triggers the OS to load them into physical memory.',
      'This allows running programs larger than physical memory and improves multitasking.',
    ],
  },
  {
    icon: RefreshCw,
    title: 'FIFO Algorithm',
    color: 'text-success',
    content: [
      'First-In First-Out replaces the page that has been in memory the longest.',
      'Simple to implement using a queue, but can suffer from Belady\'s anomaly — more frames can lead to more faults.',
      'Best for understanding basic replacement but rarely optimal in practice.',
    ],
  },
  {
    icon: Cpu,
    title: 'LRU Algorithm',
    color: 'text-primary',
    content: [
      'Least Recently Used replaces the page that hasn\'t been accessed for the longest time.',
      'Based on temporal locality — recently used pages are likely to be used again soon.',
      'More effective than FIFO but requires tracking access times, adding overhead.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Page Faults',
    color: 'text-destructive',
    content: [
      'A page fault occurs when a program accesses a page not currently in physical memory.',
      'The OS must: find the page on disk → find a free frame (or evict one) → load the page → update the page table.',
      'Minimizing page faults is the primary goal of page replacement algorithms.',
    ],
  },
];

const LearnPage = ({ onBack }: LearnPageProps) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button variant="ghost" onClick={onBack} className="gap-2 mb-6 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">OS Memory Concepts</h1>
              <p className="text-muted-foreground text-sm">Everything you need to know before simulating</p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-6">
          {topics.map((topic, i) => (
            <motion.div
              key={topic.title}
              className="bg-card border border-border rounded-2xl p-8 hover:border-primary/20 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <topic.icon className={`w-6 h-6 ${topic.color}`} />
                <h2 className="text-xl font-bold text-foreground">{topic.title}</h2>
              </div>
              <div className="space-y-3">
                {topic.content.map((paragraph, j) => (
                  <p key={j} className="text-sm text-muted-foreground leading-relaxed pl-9">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
