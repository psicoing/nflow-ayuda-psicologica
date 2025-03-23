import { useEffect, useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@shared/schema";
import { format } from "date-fns";
import { Send, Loader2, Bot, User, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  user: any;
  remainingMessages: number | null;
}

export function ChatInterface({
  messages = [],
  onSendMessage,
  isLoading,
  user,
  remainingMessages,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-full">
      {user?.role === "user" && remainingMessages !== null && (
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Plan gratuito: {remainingMessages} {remainingMessages === 1 ? 'mensaje restante' : 'mensajes restantes'}
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/subscriptions">Actualizar plan</Link>
            </Button>
          </div>
          {remainingMessages <= 1 && (
            <Alert className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Te {remainingMessages === 0 ? 'has quedado sin' : 'queda 1'} mensaje{remainingMessages === 1 ? '' : 's'} gratuito{remainingMessages === 1 ? '' : 's'}. 
                Considera actualizar a un plan premium para continuar la conversación.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div ref={scrollAreaRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center text-muted-foreground">
            <Bot className="h-12 w-12" />
            <div className="max-w-sm space-y-2">
              <h3 className="font-semibold">{t('chat.welcome')}</h3>
              <p>{t('chat.introduction')}</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8">
                {message.role === "user" ? (
                  <User className="h-5 w-5" />
                ) : (
                  <Bot className="h-5 w-5" />
                )}
              </Avatar>
              <div
                className={`flex flex-col max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                <span
                  className={`text-xs mt-1 ${
                    message.role === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {format(new Date(message.timestamp), "HH:mm")}
                </span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex items-start gap-3">
            <Avatar className="h-8 w-8">
              <Bot className="h-5 w-5" />
            </Avatar>
            <div className="bg-muted rounded-lg p-3">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <Alert variant="default" className="mx-4 mb-4">
        <Info className="h-4 w-4" />
        <AlertDescription>
          {t('chat.disclaimer')}
        </AlertDescription>
      </Alert>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-border flex gap-2 items-center"
      >
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat.typeMessage')}
          disabled={isLoading || (user?.role === "user" && remainingMessages === 0)}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!input.trim() || isLoading || (user?.role === "user" && remainingMessages === 0)}
          className="shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
}