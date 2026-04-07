import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Diagnosis } from './components/Diagnosis';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ViewState } from './types';
import { storage } from './lib/storage';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    const settings = storage.get().settings;
    if (!settings.apiKey) {
      setHasApiKey(false);
    }
    setIsInitialized(true);
  }, []);

  if (!isInitialized) return null;

  return (
    <>
      {!hasApiKey && <ApiKeyModal onSuccess={() => setHasApiKey(true)} />}
      <Layout currentView={currentView} onViewChange={setCurrentView}>
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'diagnosis' && <Diagnosis />}
        {currentView === 'history' && <History />}
        {currentView === 'settings' && <Settings />}
      </Layout>
    </>
  );
}
