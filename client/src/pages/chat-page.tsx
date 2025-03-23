import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Message } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { Link, Redirect } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { ChatInterface } from "@/components/chat-interface";

export default function ChatPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentHistory, setCurrentHistory] = useState<Message[]>([]);

  if (!user) {
    return <Redirect to="/auth" />;
  }

  const { data: chats, isLoading: isLoadingChats } = useQuery({
    queryKey: ["/api/chats"],
  });

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/chat", {
        message,
        history: currentHistory,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentHistory(data.messages);
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
    },
    onError: (error: Error) => {
      console.error("Error en el chat:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (message: string) => {
    if (!message.trim() || chatMutation.isPending) return;
    try {
      await chatMutation.mutateAsync(message);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };

  if (isLoadingChats) {
    return <div>Cargando chats...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto p-4">
        <header className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Chat de Apoyo</h1>
        </header>

        <Card className="flex flex-col h-[calc(100vh-8rem)]">
          <ChatInterface
            messages={currentHistory}
            onSendMessage={handleSubmit}
            isLoading={chatMutation.isPending}
            user={user}
          />
        </Card>
      </div>
    </div>
  );
}