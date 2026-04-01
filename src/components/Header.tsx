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
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center glow-primary">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">MemSim</h1>
              <p className="text-xs text-muted-foreground font-mono">Memory Management Visualizer</p>
            </div>
          </motion.div>

          <nav className="flex gap-1 bg-muted rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id ? 'text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
