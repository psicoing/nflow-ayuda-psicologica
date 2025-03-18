import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Chat, UserRoles } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Redirect } from "wouter";

export default function AdminPanel() {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Verificar si el usuario tiene permisos de profesional o admin
  if (!user || (user.role !== UserRoles.PROFESSIONAL && user.role !== UserRoles.ADMIN)) {
    return <Redirect to="/" />;
  }

  const { data: chats, isLoading } = useQuery<Chat[]>({
    queryKey: ["/api/chats/unreviewed"],
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ chatId, isApproved, notes }: { chatId: number; isApproved: boolean; notes: string }) => {
      await apiRequest("POST", `/api/chats/${chatId}/review`, {
        isApproved,
        notes,
        reviewedBy: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats/unreviewed"] });
    },
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {t('adminPanel.title')}
          </h1>
        </header>

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">{t('adminPanel.pendingReviews')}</TabsTrigger>
            <TabsTrigger value="reviewed">{t('adminPanel.reviewedChats')}</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : chats?.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  {t('adminPanel.noChatsToReview')}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {chats?.map((chat) => (
                  <Card key={chat.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">
                        {t('adminPanel.chatSession')} #{chat.id}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {chat.messages.map((msg, idx) => (
                          <div key={idx} className="border-l-2 pl-4 py-2">
                            <p className="text-sm font-medium">
                              {msg.role === 'user' ? t('adminPanel.user') : t('adminPanel.assistant')}
                            </p>
                            <p className="mt-1">{msg.content}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(new Date(msg.timestamp), 'PPpp')}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex gap-2">
                        <Button
                          onClick={() => reviewMutation.mutate({
                            chatId: chat.id,
                            isApproved: true,
                            notes: "Revisado y aprobado"
                          })}
                          variant="outline"
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          {t('adminPanel.approve')}
                        </Button>
                        <Button
                          onClick={() => reviewMutation.mutate({
                            chatId: chat.id,
                            isApproved: false,
                            notes: "Requiere atención"
                          })}
                          variant="outline"
                          className="w-full"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          {t('adminPanel.flag')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
