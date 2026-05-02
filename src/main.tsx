import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import 'react-loading-skeleton/dist/skeleton.css';
import './index.css';

import { init } from '@viewcontrol/runtime';

init({
  projectId: 'vc_f0d4a5a08be75e60c30d072c',
  apiUrl: 'https://view-control-production.up.railway.app',
  debug: false
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);