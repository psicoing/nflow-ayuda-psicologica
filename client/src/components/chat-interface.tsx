import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Message } from "@shared/schema";
import { format } from "date-fns";
import { Send, Loader2, Bot, User, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  user: any;
}

export function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  user,
}: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
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

  // Calcular mensajes restantes solo para usuarios normales
  const remainingMessages = user?.role === "user" ? 5 - (user?.questionCount || 0) : null;

  return (
    <div className="flex flex-col h-full">
      {user?.role === "user" && (
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Plan gratuito: {remainingMessages} mensajes restantes
            </span>
            <Button variant="outline" size="sm" asChild>
              <a href="/subscriptions">Actualizar plan</a>
            </Button>
          </div>
          {remainingMessages && remainingMessages <= 2 && (
            <Alert className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Te quedan {remainingMessages} mensajes gratuitos. 
                Considera actualizar a un plan premium para continuar la conversación.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <ScrollArea
        ref={scrollAreaRef}
        className="flex-1 p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 text-center text-muted-foreground">
            <Bot className="h-12 w-12" />
            <div className="max-w-sm space-y-2">
              <h3 className="font-semibold">Bienvenido a NFlow Mental Health Support</h3>
              <p>
                Estoy aquí para escucharte y apoyarte. Siéntete libre de compartir lo que tienes en mente.
                Recuerda que soy un asistente de IA y no un reemplazo para ayuda profesional.
              </p>
              {user?.role === "user" && (
                <p className="text-sm text-muted-foreground mt-2">
                  Plan gratuito: Tienes 5 mensajes incluidos
                </p>
              )}
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
      </ScrollArea>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-border flex gap-2 items-center"
      >
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={!input.trim() || isLoading}
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