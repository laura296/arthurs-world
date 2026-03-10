import { Component } from 'react';
import { useNavigate } from 'react-router-dom';
import ArthurBear from './ArthurBear';

function FallbackUI() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-night gap-6 p-8">
      <ArthurBear expression="sleepy" size={120} className="animate-float" />
      <h2 className="text-2xl font-heading text-sun text-center">
        Oops! Something went wrong
      </h2>
      <p className="text-base font-body text-white/60 text-center max-w-xs">
        Don't worry — let's go back and try again!
      </p>
      <button
        onClick={() => navigate(-1)}
        className="px-8 py-3 bg-sun text-night text-lg font-heading rounded-full
                   shadow-xl active:scale-95 transition-transform"
      >
        Go Back
      </button>
    </div>
  );
}

export default class GameErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Game error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
