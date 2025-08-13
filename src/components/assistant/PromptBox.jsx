import React, { useState } from 'react';

export default function PromptBox({ onSend, disabled }) {
  const [value, setValue] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onSend(value.trim());
    setValue('');
  };

  return (
    <form onSubmit={submit} className="border-t p-3">
      <textarea
        className="h-20 w-full resize-none rounded border px-2 py-1 text-sm"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Preguntá algo..."
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="mt-2 w-full rounded bg-blue-600 py-1 text-sm text-white disabled:opacity-50"
      >
        Enviar
      </button>
    </form>
  );
}
