import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Cpu, HardDrive, MemoryStick, Layers, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GridBackground from '@/components/GridBackground';

interface LearnPageProps {
  onBack: () => void;
}

const topics = [
  {
    icon: Layers,
    title: 'Paging',
    color: 'text-primary',
    bg: 'bg-primary/10',
    borderColor: 'border-primary/20',
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
    bg: 'bg-accent/10',
    borderColor: 'border-accent/20',
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
    bg: 'bg-info/10',
    borderColor: 'border-info/20',
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
    bg: 'bg-success/10',
    borderColor: 'border-success/20',
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
    bg: 'bg-primary/10',
    borderColor: 'border-primary/20',
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
    bg: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
    content: [
      'A page fault occurs when a program accesses a page not currently in physical memory.',
      'The OS must: find the page on disk → find a free frame (or evict one) → load the page → update the page table.',
      'Minimizing page faults is the primary goal of page replacement algorithms.',
    ],
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LearnPage = ({ onBack }: LearnPageProps) => {
  return (
    <div className="min-h-screen bg-background relative noise">
      <GridBackground />
      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button variant="ghost" onClick={onBack} className="gap-2 mb-8 text-muted-foreground glass">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
          <div className="flex items-center gap-4 mb-2">
            <motion.div
              className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center glow-accent"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <BookOpen className="w-7 h-7 text-accent" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold text-foreground font-display">OS Memory Concepts</h1>
              <p className="text-sm text-muted-foreground mt-1">Everything you need to know before simulating</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-5"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {topics.map((topic) => (
            <motion.div
              key={topic.title}
              variants={fadeUp}
              className={`glass rounded-2xl p-8 border-glow hover:border-primary/20 transition-all group`}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-10 h-10 rounded-xl ${topic.bg} flex items-center justify-center`}>
                  <topic.icon className={`w-5 h-5 ${topic.color}`} />
                </div>
                <h2 className="text-xl font-bold text-foreground font-display">{topic.title}</h2>
              </div>
              <div className="space-y-3 pl-[52px]">
                {topic.content.map((paragraph, j) => (
                  <p key={j} className="text-sm text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LearnPage;
