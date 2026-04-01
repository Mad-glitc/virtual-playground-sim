import { motion } from 'framer-motion';
import { Cpu, Home } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'paging', label: 'Page Replacement' },
  { id: 'segmentation', label: 'Segmentation' },
  { id: 'virtual', label: 'Virtual Memory' },
];

const Header = ({ activeTab, onTabChange }: HeaderProps) => {
  return (
    <header className="border-b border-border/50 glass-strong sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3 cursor-pointer group"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => onTabChange('home')}
            whileHover={{ x: -2 }}
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center glow-primary group-hover:bg-primary/15 transition-colors">
              <Cpu className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-foreground font-display leading-none">MemSim</h1>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">Memory Visualizer</p>
            </div>
          </motion.div>

          <nav className="flex gap-1 glass rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
                  activeTab === tab.id ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-lg glow-primary"
                    transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10 font-mono">{tab.label}</span>
              </button>
            ))}
          </nav>

          <button
            onClick={() => onTabChange('home')}
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
