"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Trash2, CheckSquare, MailOpen, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'Não Lido' | 'Lido' | 'Respondido';
  receivedAt: Date;
}

// Busca contatos reais da API
async function fetchContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch('/api/admin/contact');
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((c: any) => ({
    id: c.id.toString(),
    name: c.name,
    email: c.email,
    phone: c.phone,
    message: c.message,
    status: c.status === 'respondido' ? 'Respondido' : c.status === 'lido' ? 'Lido' : 'Não Lido',
    receivedAt: new Date(c.createdAt),
  }));
}

// Atualiza status via API
async function updateMessageStatus(messageId: string, status: ContactMessage['status']): Promise<void> {
  let apiStatus = status === 'Respondido' ? 'respondido' : status === 'Lido' ? 'lido' : 'novo';
  await fetch(`/api/admin/contact/${messageId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: apiStatus }),
  });
}

// Remove contato via API
async function deleteMessageAction(messageId: string): Promise<void> {
  await fetch(`/api/admin/contact/${messageId}`, { method: 'DELETE' });
}

export default function AdminContatosPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadMessages() {
      setIsLoading(true);
      const fetchedMessages = await fetchContactMessages();
      setMessages(fetchedMessages);
      setIsLoading(false);
    }
    loadMessages();
  }, []);

  const handleViewDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowDetailDialog(true);
    if (message.status === 'Não Lido') {
      handleChangeStatus(message.id, 'Lido');
    }
  };

  const handleDeleteClick = (message: ContactMessage) => {
    setMessageToDelete(message);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;
    setIsProcessing(true);
    try {
      await deleteMessageAction(messageToDelete.id);
      setMessages(messages.filter(msg => msg.id !== messageToDelete.id));
      toast({ title: "Mensagem excluída", description: `A mensagem de "${messageToDelete.name}" foi excluída.` });
    } catch (error) {
      toast({ title: "Erro ao excluir", description: "Não foi possível excluir a mensagem.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
      setShowDeleteDialog(false);
      setMessageToDelete(null);
    }
  };

  const handleChangeStatus = async (messageId: string, newStatus: ContactMessage['status']) => {
    setIsProcessing(true);
    try {
      await updateMessageStatus(messageId, newStatus);
      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? { ...msg, status: newStatus } : msg)
      );
      toast({ title: "Status Atualizado", description: `A mensagem foi marcada como ${newStatus.toLowerCase()}.` });
    } catch (error) {
      toast({ title: "Erro ao atualizar", description: "Não foi possível atualizar o status.", variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  function formatDate(date: Date): string {
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }

  const getStatusBadgeVariant = (status: ContactMessage['status']): "default" | "secondary" | "outline" => {
    switch (status) {
      case 'Respondido': return 'default';
      case 'Lido': return 'secondary';
      case 'Não Lido': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-headline text-3xl font-bold text-foreground">Mensagens de Contato</h1>
      <p className="text-muted-foreground">Gerencie as mensagens recebidas através do formulário de contato.</p>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : messages.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Recebido em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell className="font-medium">{msg.name}</TableCell>
                  <TableCell>{msg.email}</TableCell>
                  <TableCell>{msg.phone || '-'}</TableCell>
                  <TableCell>{formatDate(msg.receivedAt)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(msg.status)}>{msg.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isProcessing}>
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(msg)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                        </DropdownMenuItem>
                        {msg.status === 'Não Lido' && (
                           <DropdownMenuItem onClick={() => handleChangeStatus(msg.id, 'Lido')} disabled={isProcessing}>
                             <MailOpen className="mr-2 h-4 w-4" /> Marcar como Lida
                           </DropdownMenuItem>
                        )}
                        {msg.status !== 'Respondido' && (
                           <DropdownMenuItem onClick={() => handleChangeStatus(msg.id, 'Respondido')} disabled={isProcessing}>
                             <CheckSquare className="mr-2 h-4 w-4" /> Marcar como Respondida
                           </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleDeleteClick(msg)} className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled={isProcessing}>
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-lg bg-card">
          <p className="text-xl text-muted-foreground">Nenhuma mensagem encontrada.</p>
        </div>
      )}

      <AlertDialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <AlertDialogContent className="max-w-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Detalhes da Mensagem</AlertDialogTitle>
            {selectedMessage && (
              <AlertDialogDescription className="space-y-2 text-left pt-2 text-sm text-foreground">
                <p><strong>De:</strong> {selectedMessage.name} ({selectedMessage.email})</p>
                <p><strong>Telefone:</strong> {selectedMessage.phone || '-'}</p>
                <p><strong>Recebido em:</strong> {formatDate(selectedMessage.receivedAt)}</p>
                <p><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(selectedMessage.status)}>{selectedMessage.status}</Badge></p>
                <div className="mt-2 pt-2 border-t">
                  <strong>Mensagem:</strong>
                  <p className="whitespace-pre-wrap bg-muted p-3 rounded-md mt-1">{selectedMessage.message}</p>
                </div>
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedMessage(null)}>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a mensagem de "{messageToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isProcessing} className="bg-destructive hover:bg-destructive/90">
              {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
