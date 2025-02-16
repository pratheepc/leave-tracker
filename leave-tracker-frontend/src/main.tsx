import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router-dom'

let root: ReactDOM.Root | null = null;
let isDisposing = false;
let disposeTimeout: number | null = null;

// Create root only once
const container = document.getElementById('root')
if (!container) {
  throw new Error("Root container not found")
}

// Render function
const render = () => {
  if (isDisposing) {
    console.log('Skipping render during disposal');
    return;
  }

  console.log('Render called, root exists:', !!root);

  try {
    if (!root) {
      console.log('Creating new root');
      root = ReactDOM.createRoot(container)
    }

    const AppWithRouter = () => (
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    root.render(<AppWithRouter />)
  } catch (error) {
    console.error('Render error:', error);
  }
}

// Initial render
render()

// Handle HMR
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('HMR update received');
    if (disposeTimeout) {
      clearTimeout(disposeTimeout);
    }
    disposeTimeout = window.setTimeout(() => {
      console.log('HMR update executing');
      isDisposing = false;
      render();
    }, 100) as unknown as number;
  })

  import.meta.hot.dispose(() => {
    console.log('HMR dispose started');
    isDisposing = true;
    if (disposeTimeout) {
      clearTimeout(disposeTimeout);
    }
    try {
      if (root) {
        console.log('Unmounting root');
        root.unmount();
        root = null;
      }
    } catch (error) {
      console.error('Error during unmount:', error);
    }
  })
}

export const BASE_URL = import.meta.env.VITE_API_BASE_URL