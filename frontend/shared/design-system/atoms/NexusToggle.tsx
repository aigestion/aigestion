import React from 'react';

export interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  className?: string;
}

export const NexusToggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <label className={`relative inline-flex items-center cursor-pointer group ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={!disabled ? onChange : undefined}
        className="sr-only peer"
        disabled={disabled}
      />

      {/* Track */}
      <div className={`
        w-12 h-7
        bg-nexus-obsidian
        border border-white/10
        rounded-full
        peer
        peer-focus:outline-none

        transition-colors duration-300
        shadow-inner

        peer-checked:bg-nexus-violet/50
        peer-checked:border-nexus-cyan/50

        after:content-['']
        after:absolute
        after:top-[4px]
        after:left-[4px]
        after:bg-nexus-silver
        after:rounded-full
        after:h-5
        after:w-5
        after:transition-all

        peer-checked:after:translate-x-full
        peer-checked:after:border-white
        peer-checked:after:bg-white
        peer-checked:shadow-[0_0_10px_rgba(138,43,226,0.3)]
      `} />

      {/* Hover Glow Effect */}
      {!disabled && (
        <div className="absolute inset-0 rounded-full ring-2 ring-nexus-cyan/0 group-hover:ring-nexus-cyan/50 transition-all duration-500 opacity-0 group-hover:opacity-100" />
      )}
    </label>
  );
};
