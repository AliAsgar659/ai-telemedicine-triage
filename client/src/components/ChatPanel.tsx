import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "cn";
import type { ChatMessage } from "@/lib/types";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (body: string) => void;
  currentRole: "patient" | "clinician";
}

export function ChatPanel({ messages, onSend, currentRole }: ChatPanelProps) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-border/70 bg-card">
      <div className="border-b border-border/70 px-4 py-3 text-sm font-medium">Consultation chat</div>
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="flex flex-col gap-3">
          {messages.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No messages yet.</p>
          )}
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("max-w-[85%] rounded-lg px-3 py-2 text-sm", {
                "self-end bg-primary text-primary-foreground": message.senderRole === currentRole,
                "self-start bg-muted": message.senderRole !== currentRole,
              })}
            >
              <p className="text-[11px] font-medium opacity-70">{message.senderName}</p>
              <p>{message.body}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border/70 p-3">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Type a message…"
          className="flex-1"
        />
        <Button type="submit" size="icon" aria-label="Send message">
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}
