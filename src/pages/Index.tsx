import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Header from '@/components/Header';
import PageReplacementSim from '@/components/PageReplacementSim';
import SegmentationSim from '@/components/SegmentationSim';
import VirtualMemorySim from '@/components/VirtualMemorySim';

const Index = () => {
  const [activeTab, setActiveTab] = useState('paging');

  return (
    <div className="min-h-screen bg-background">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'paging' && <PageReplacementSim />}
            {activeTab === 'segmentation' && <SegmentationSim />}
            {activeTab === 'virtual' && <VirtualMemorySim />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Index;
