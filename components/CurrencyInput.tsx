"use client";

import { useEffect, useState } from "react";
import { formatCurrency, parseCurrencyInput } from "@/lib/format";

export function CurrencyInput({
  value,
  onChange,
  className,
  exportMode,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  exportMode?: boolean;
}) {
  const [text, setText] = useState(value === 0 ? "" : formatCurrency(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(value === 0 ? "" : formatCurrency(value));
  }, [value, focused]);

  if (exportMode) {
    return <div className={className}>{formatCurrency(value)}</div>;
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={text}
      onFocus={() => setFocused(true)}
      onChange={(e) => setText(e.target.value)}
      onBlur={() => {
        setFocused(false);
        const parsed = parseCurrencyInput(text);
        onChange(parsed);
        setText(parsed === 0 ? "" : formatCurrency(parsed));
      }}
      placeholder="0.00"
      className={className}
    />
  );
}
