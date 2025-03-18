import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Message } from "@shared/schema";
import { format } from "date-fns";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function ChatPage() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [currentHistory, setCurrentHistory] = useState<Message[]>([]);

  const { data: chats, isLoading: isLoadingChats } = useQuery({
    queryKey: ["/api/chats"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest("POST", "/api/chat", {
        message,
        history: currentHistory,
      });
      return res.json();
    },
    onSuccess: (data) => {
      setCurrentHistory(data.messages);
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || chatMutation.isPending) return;

    const currentMessage = message;
    setMessage("");
    await chatMutation.mutateAsync(currentMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto p-4">
        <header className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Chat with AI Support</h1>
        </header>

        <Card className="flex flex-col h-[calc(100vh-8rem)]">
          <ScrollArea className="flex-1 p-4">
            {currentHistory.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Start a conversation for mental health support
              </div>
            ) : (
              <div className="space-y-4">
                {currentHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {format(new Date(msg.timestamp), "HH:mm")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={chatMutation.isPending}
              />
              <Button
                type="submit"
                disabled={!message.trim() || chatMutation.isPending}
              >
                {chatMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
