import { useState } from 'react';

export default function ToggleSwitch({ enabled, onChange }) {
  // We use internal state to make the toggle feel instant
  const [isEnabled, setIsEnabled] = useState(enabled);

  const handleClick = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onChange(newState); // Call the parent function with the new state
  };

  return (
    <button
      type="button"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
        isEnabled ? 'bg-blue-600' : 'bg-gray-600'
      }`}
      onClick={handleClick}
    >
      <span className="sr-only">Toggle job</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isEnabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}