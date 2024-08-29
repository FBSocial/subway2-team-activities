import { RewardModalSheetProvider } from '@/contexts/reward-modal-sheet';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './routes';

(async () => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <RewardModalSheetProvider>
        <RouterProvider router={router} fallbackElement={<></>} />
      </RewardModalSheetProvider>
    </React.StrictMode>,
  );
})();
