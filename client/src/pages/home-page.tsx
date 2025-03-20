import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Brain, MessageCircle, Library, LogOut, Menu, Info, PersonStanding, Building2, Globe, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/language-selector";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <div className="max-w-6xl mx-auto p-4 space-y-6 w-full">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent text-center sm:text-left">
            {t('welcome')}, {user?.username}
          </h1>
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="text-left">Menú</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-2 mt-4">
                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/about">
                      <Info className="h-4 w-4" />
                      Quienes somos
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/services/personal">
                      <PersonStanding className="h-4 w-4" />
                      Servicios Personas
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/services/business">
                      <Building2 className="h-4 w-4" />
                      Servicios Empresas
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/language">
                      <Globe className="h-4 w-4" />
                      Idiomas
                    </Link>
                  </Button>

                  <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                    <Link href="/subscriptions">
                      <CreditCard className="h-4 w-4" />
                      Suscripciones
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <LanguageSelector />
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-6 w-6 text-primary" />
                {t('startChat')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t('startChatDesc')}
              </p>
              <Link href="/chat">
                <Button className="w-full">{t('startChat')}</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                {t('mentalHealthTips')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>{t('tips.mindfulness')}</li>
                <li>{t('tips.sleep')}</li>
                <li>{t('tips.exercise')}</li>
                <li>{t('tips.connect')}</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Library className="h-6 w-6 text-primary" />
                {t('resources')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li>{t('resourcesList.crisis')}</li>
                <li>{t('resourcesList.local')}</li>
                <li>{t('resourcesList.selfHelp')}</li>
                <li>{t('resourcesList.community')}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}