import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
}

export function PromptInput({ onSubmit, isLoading }: PromptInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return;
    onSubmit(value.trim());
    setValue('');
  };

  return (
    <div className="surface-elevated surface-glow p-1.5 flex items-center gap-2">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder='Describe your automation... e.g., "When I get a Gmail, summarize it and send to Slack"'
        className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        disabled={isLoading}
      />
      <Button
        size="icon"
        onClick={handleSubmit}
        disabled={!value.trim() || isLoading}
        className="gradient-primary h-10 w-10 rounded-lg btn-press"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" /> : <Send className="h-4 w-4 text-primary-foreground" />}
      </Button>
    </div>
  );
}
