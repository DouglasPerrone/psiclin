"use client";

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Phone, Mail, ExternalLink, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Inline SVG for WhatsApp icon as it's not in Lucide
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M16.75 13.96c.25.13.41.2.52.39.11.19.11.41.08.68-.03.27-.21.5-.46.71-.25.21-.57.42-1.07.36-.5-.06-1.02-.2-1.68-.49-.66-.29-1.24-.69-1.77-1.18s-.93-1.04-1.25-1.65c-.32-.61-.46-1.22-.49-1.72-.03-.5.16-.8.35-1.01.19-.21.36-.29.52-.39s.29-.18.46-.18c.17,0,.33.04.46.18l.13.13.11.13c.06.07.1.18.11.31s-.01.29-.07.44l-.06.13-.25.63c-.06.13-.13.24-.21.33s-.13.15-.21.15c-.07,0-.15-.01-.21-.04l-.11-.04c-.07-.03-.16-.07-.25-.13s-.18-.11-.27-.18c-.09-.07-.2-.16-.33-.27s-.24-.24-.36-.39c-.12-.15-.25-.33-.39-.54s-.24-.46-.33-.71-.13-.5-.13-.75c0-.1.01-.2.04-.29s.06-.18.11-.27.1-.18.18-.25.15-.15.25-.21.2-.11.33-.15.27-.06.44-.06.33,0,.47.01c.14.01.29.04.44.07s.29.09.44.13.27.13.39.24c.12.11.22.24.29.39s.11.31.13.49-.01.36-.07.51l-.06.14-.69,1.61c-.18.44-.36.78-.54 1.04s-.37.46-.57.57-.44.18-.69.18c-.21,0-.41-.03-.6-.09s-.36-.14-.52-.24c-.16-.1-.32-.2-.47-.33s-.27-.27-.39-.41-.22-.29-.29-.44c-.07-.15-.11-.31-.13-.47s0-.33.04-.49.09-.29.16-.41.16-.24.25-.33.2-.18.31-.25.24-.13.39-.16.29-.06.46-.04.33.04.47.07c.14.03.27.07.39.11l.07.06c.26.17.44.29.54.36.1.07.24.09.41.06.17-.03.31-.1.44-.18.13-.09.25-.2.36-.33.1-.13.2-.29.27-.46s.11-.36.13-.54.01-.39-.04-.59-.13-.39-.24-.54c-.1-.15-.24-.29-.41-.41s-.33-.22-.52-.29-.39-.11-.6-.11-.41.01-.6.06-.36.11-.51.2-.27.18-.39.29c-.12.11-.22.22-.29.33s-.13.22-.16.33c-.03.11-.04.22-.04.33s0 .09.01.13.03.09.04.13.04.07.06.11a.92.92,0,0,0,.16.21c.06.06.13.11.21.15s.16.07.25.09.18.04.27.04c.09,0,.18,0,.27-.01.2-.03.39-.1.57-.21.18-.11.33-.24.47-.39.14-.15.25-.33.33-.52s.13-.39.13-.6c0-.1-.01-.2-.04-.29s-.06-.18-.11-.25-.1-.13-.16-.18-.13-.09-.2-.11-.15-.03-.21-.03c-.07,0-.13,0-.2.01s-.13.03-.18.04-.11.04-.15.06-.07.04-.09.06c-.02.02-.03.04-.04.06s-.01.06,0,.09.01.06.03.09.03.06.06.09l.09.11c.04.04.09.07.15.09s.13.04.21.04.16-.01.24-.03.16-.04.24-.07.15-.06.21-.09c.03-.01.04-.02.04-.02z"/>
  </svg>
);

const availableTimeSlots = [
  "Manhã (09:00 - 10:00)",
  "Manhã (10:00 - 11:00)",
  "Manhã (11:00 - 12:00)",
  "Tarde (14:00 - 15:00)",
  "Tarde (15:00 - 16:00)",
  "Tarde (16:00 - 17:00)",
];

export default function ContatoPage() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlot, setTimeSlot] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
          subject,
        }),
      });
      if (!res.ok) throw new Error('Erro ao enviar mensagem');
      toast({
        title: "Mensagem Enviada!",
        description: "Sua mensagem foi enviada com sucesso. Responderemos em breve.",
      });
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setDate(undefined);
      setTimeSlot('');
      setPhone('');
    } catch {
      toast({ title: 'Erro', description: 'Não foi possível enviar sua mensagem.', variant: 'destructive' });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12 md:mb-16">
          <h1 className="font-headline text-4xl font-bold text-foreground sm:text-5xl">Entre em Contato</h1>
          <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
            Tem alguma dúvida, precisa de mais informações ou deseja solicitar um horário? Fale conosco!
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-foreground flex items-center">
                <MessageSquare className="mr-3 h-7 w-7 text-primary" /> Envie uma Mensagem
              </CardTitle>
              <CardDescription className="text-foreground/80">
                Preencha o formulário e nossa equipe responderá o mais rápido possível. Se desejar, indique sua preferência de data e horário para agendamento.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="contact-name" className="font-semibold">Nome</Label>
                  <Input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Seu nome"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email" className="font-semibold">E-mail</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="seuemail@exemplo.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone" className="font-semibold">Telefone</Label>
                  <Input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(99) 99999-9999"
                    className="mt-1"
                  />
                  <span className="text-xs text-muted-foreground">Opcional</span>
                </div>
                <div>
                  <Label htmlFor="contact-subject" className="font-semibold">Assunto</Label>
                  <Input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    placeholder="Assunto da mensagem"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-message" className="font-semibold">Mensagem</Label>
                  <Textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    placeholder="Digite sua mensagem aqui..."
                    rows={5}
                    className="mt-1"
                  />
                </div>
                <Button type="submit" className="w-full text-lg py-3" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-xl text-foreground flex items-center">
                  <Phone className="mr-3 h-6 w-6 text-primary" /> Fale Conosco Diretamente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground">Telefone:</h4>
                  <a href="tel:+5571996919038" className="text-foreground/80 hover:text-primary font-semibold">(71) 99691-9038</a>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">E-mail:</h4>
                  <a href="mailto:contato@psicllin.com" className="text-foreground/80 hover:text-primary">contato@psicllin.com</a>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Agendamento:</h4>
                  <p className="text-foreground/80">Agende sua consulta pelo formulário ou WhatsApp.</p>
                </div>
              </CardContent>
            </Card>
            
            <Button asChild className="w-full text-lg py-3 bg-[#25D366] hover:bg-[#1DAE51] text-foreground" size="lg">
              <Link href="https://wa.me/5571996919038" target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon className="mr-2 h-6 w-6" /> Chamar no WhatsApp
                <ExternalLink className="ml-2 h-4 w-4 opacity-70" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
