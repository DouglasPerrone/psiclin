"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export default function PerfilPage() {
  // Simulação de dados do usuário
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@psiclin.com');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Buscar dados do perfil ao carregar a página
    fetch('/api/admin/perfil')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setName(data.name || '');
          setEmail(data.email || '');
          setAvatar(data.avatarUrl || null);
        }
      });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (file) formData.append('avatar', file);
    // Enviar dados para API
    const res = await fetch('/api/admin/perfil', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      const updated = await res.json();
      setAvatar(updated.avatarUrl || avatar);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Meu Perfil</CardTitle>
          <CardDescription>Altere sua foto, nome e e-mail.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatar || '/imagem/psi1.png'} alt="Avatar" />
              </Avatar>
              <input type="file" accept="image/*" onChange={handleFileChange} className="block" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Nome</label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block mb-1 font-medium">E-mail</label>
              <Input value={email} onChange={e => setEmail(e.target.value)} required type="email" />
            </div>
            <Button type="submit" className="w-full">Salvar Alterações</Button>
            {success && <div className="text-green-600 text-center mt-2">Alterações salvas!</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
