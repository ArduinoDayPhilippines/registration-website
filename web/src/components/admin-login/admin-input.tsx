interface AdminInputProps {
  id: string;
  name: string;
  type: 'email' | 'password' | 'text';
  label: string;
  value: string;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  shake?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

export default function AdminInput({
  id,
  name,
  type,
  label,
  value,
  error,
  placeholder,
  disabled,
  shake,
  onChange,
  onBlur,
}: AdminInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-teal-200/80 mb-2">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border ${
          error 
            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
            : 'border-white/10 focus:border-teal-500 focus:ring-teal-500/20'
        } text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all duration-200 ${
          shake ? 'animate-shake' : ''
        }`}
        placeholder={placeholder}
        disabled={disabled}
      />
      {error && (
        <p className="mt-2 text-xs text-red-400/90 animate-slideDown">{error}</p>
      )}
    </div>
  );
}
