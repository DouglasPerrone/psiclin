"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle, XCircle, Eye, Loader2, CalendarPlus } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AppointmentRequest {
  id: string;
  name: string;
  email: string;
  requestedDate?: Date | string;
  requestedTimeSlot?: string;
  subject: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado';
  submittedAt: Date;
  message?: string;
}

// Buscar contatos reais da API
async function fetchAppointments(): Promise<AppointmentRequest[]> {
  const res = await fetch('/api/admin/contact');
  if (!res.ok) throw new Error('Erro ao buscar contatos');
  const contacts = await res.json();
  // Adaptar para o formato esperado pela tabela de agendamentos
  return contacts.map((c: any) => ({
    id: c.id.toString(),
    name: c.name,
    email: c.email,
    requestedDate: undefined, // Não há campo correspondente
    requestedTimeSlot: undefined, // Não há campo correspondente
    subject: c.phone || '-', // Usar telefone como assunto, se desejar
    status: c.status === 'respondido' ? 'Confirmado' : c.status === 'lido' ? 'Pendente' : 'Pendente',
    submittedAt: c.createdAt,
    message: c.message,
  }));
}

// Placeholder for action
async function updateAppointmentStatus(appointmentId: string, status: AppointmentRequest['status']): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 700));
  console.log(`Appointment ${appointmentId} status updated to ${status} (placeholder)`);
}

export default function AdminAgendamentosPage() {
  const [appointments, setAppointments] = useState<AppointmentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentRequest | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadAppointments() {
      setIsLoading(true);
      const fetchedAppointments = await fetchAppointments();
      setAppointments(fetchedAppointments);
      setIsLoading(false);
    }
    loadAppointments();
  }, []);

  const handleViewDetails = (appointment: AppointmentRequest) => {
    setSelectedAppointment(appointment);
    setShowDetailDialog(true);
  };
  
  const handleChangeStatus = async (appointmentId: string, newStatus: AppointmentRequest['status']) => {
    setIsUpdatingStatus(true);
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(prev => 
        prev.map(apt => apt.id === appointmentId ? { ...apt, status: newStatus } : apt)
      );
      toast({ title: "Status Atualizado", description: `O agendamento foi marcado como ${newStatus.toLowerCase()}.` });
    } catch (error) {
      toast({ title: "Erro ao atualizar", description: "Não foi possível atualizar o status. Tente novamente.", variant: "destructive" });
      console.error("Failed to update status:", error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  function formatDate(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  }
  
  function formatRequestedDate(date: Date | string | undefined): string {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, "dd/MM/yyyy", { locale: ptBR });
  }

  const getStatusBadgeVariant = (status: AppointmentRequest['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Confirmado': return 'default'; // Primary color
      case 'Pendente': return 'secondary';
      case 'Cancelado': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold text-foreground">Gerenciar Agendamentos</h1>
          <p className="text-muted-foreground">Visualize e gerencie as solicitações de agendamento.</p>
        </div>
        {/* <Button asChild>
          <Link href="/admin/agendamentos/novo"> <CalendarPlus className="mr-2 h-5 w-5" /> Novo Agendamento </Link>
        </Button> */}
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : appointments.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border shadow-sm bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Data Solicitada</TableHead>
                <TableHead>Horário Solicitado</TableHead>
                <TableHead>Assunto/Serviço</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enviado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">{apt.name}</TableCell>
                  <TableCell>{apt.email}</TableCell>
                  <TableCell>{formatRequestedDate(apt.requestedDate)}</TableCell>
                  <TableCell>{apt.requestedTimeSlot || '-'}</TableCell>
                  <TableCell>{apt.subject}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(apt.status)}>{apt.status}</Badge>
                  </TableCell>
                  <TableCell>{formatDate(apt.submittedAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0" disabled={isUpdatingStatus}>
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(apt)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                        </DropdownMenuItem>
                        {apt.status !== 'Confirmado' && (
                          <DropdownMenuItem onClick={() => handleChangeStatus(apt.id, 'Confirmado')} disabled={isUpdatingStatus}>
                            <CheckCircle className="mr-2 h-4 w-4" /> Confirmar
                          </DropdownMenuItem>
                        )}
                        {apt.status !== 'Cancelado' && (
                          <DropdownMenuItem onClick={() => handleChangeStatus(apt.id, 'Cancelado')} className="text-destructive focus:text-destructive focus:bg-destructive/10" disabled={isUpdatingStatus}>
                            <XCircle className="mr-2 h-4 w-4" /> Cancelar
                          </DropdownMenuItem>
                        )}
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
            <p className="text-xl text-muted-foreground">Nenhum agendamento encontrado.</p>
        </div>
      )}

      <AlertDialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Detalhes do Agendamento</AlertDialogTitle>
            {selectedAppointment && (
              <AlertDialogDescription className="space-y-2 text-left pt-2">
                <p><strong>Cliente:</strong> {selectedAppointment.name}</p>
                <p><strong>E-mail:</strong> {selectedAppointment.email}</p>
                <p><strong>Data Solicitada:</strong> {formatRequestedDate(selectedAppointment.requestedDate)}</p>
                <p><strong>Horário Solicitado:</strong> {selectedAppointment.requestedTimeSlot || '-'}</p>
                <p><strong>Assunto/Serviço:</strong> {selectedAppointment.subject}</p>
                <p><strong>Status:</strong> <Badge variant={getStatusBadgeVariant(selectedAppointment.status)}>{selectedAppointment.status}</Badge></p>
                <p><strong>Enviado em:</strong> {formatDate(selectedAppointment.submittedAt)}</p>
                {selectedAppointment.message && <p><strong>Mensagem Adicional:</strong> {selectedAppointment.message}</p>}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAppointment(null)}>Fechar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
