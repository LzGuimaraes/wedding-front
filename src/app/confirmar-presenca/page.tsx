// your-wedding-frontend/src/app/confirmar-presenca/page.tsx

"use client";

import { useState, FormEvent, useEffect } from 'react';

// Interfaces para os dados
interface FormData {
  fullName: string;
  email: string;
  numCompanions: number;
  message: string;
}

interface ConfirmedGuest {
  full_name: string;
}

export default function ConfirmarPresencaPage() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    numCompanions: 0,
    message: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null); // 'success', 'error', 'loading'
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedGuests, setConfirmedGuests] = useState<ConfirmedGuest[]>([]);
  const [isLoadingGuests, setIsLoadingGuests] = useState(true);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api'; 

  const fetchConfirmedGuests = async () => {
    setIsLoadingGuests(true);
    try {
      const response = await fetch(`${API_BASE_URL}/guests/confirmed`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ConfirmedGuest[] = await response.json();
      setConfirmedGuests(data);
    } catch (error: any) {
      console.error("Erro ao buscar convidados confirmados:", error);
      setErrorMessage("Não foi possível carregar a lista de convidados."); // Mensagem para o usuário
    } finally {
      setIsLoadingGuests(false);
    }
  };

  useEffect(() => {
    fetchConfirmedGuests();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('loading');
    setErrorMessage(null);

    if (!formData.fullName.trim()) {
      setErrorMessage("Por favor, preencha o nome completo.");
      setSubmissionStatus('error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/guests/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP! Status: ${response.status}`);
      }

      setSubmissionStatus('success');
      setFormData({ fullName: '', email: '', numCompanions: 0, message: '' }); 
      fetchConfirmedGuests(); 
      alert("Sua presença foi confirmada com sucesso!"); 
    } catch (error: any) {
      console.error("Erro ao confirmar presença:", error);
      setErrorMessage(`Falha na confirmação: ${error.message}`);
      setSubmissionStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', backgroundColor: 'var(--color-white)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', fontFamily: 'inherit', color: 'var(--color-dark-gray)' }}>
      <h1 style={{ color: 'var(--color-deep-rose)', fontSize: '2em', marginBottom: '20px', textAlign: 'center' }}>Confirmar Presença</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px' }}>Por favor, preencha o formulário abaixo para confirmar sua presença no nosso casamento.</p>

      {submissionStatus === 'loading' && <p style={{ color: 'blue', textAlign: 'center' }}>Enviando confirmação...</p>}
      {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
      {submissionStatus === 'success' && !errorMessage && <p style={{ color: 'green', textAlign: 'center' }}>Presença confirmada com sucesso!</p>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="fullName" style={{ display: 'block', marginBottom: '5px' }}>Nome Completo: <span style={{ color: 'red' }}>*</span></label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--color-light-gray)' }} />
        </div>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>E-mail:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--color-light-gray)' }} />
        </div>
        <div>
          <label htmlFor="numCompanions" style={{ display: 'block', marginBottom: '5px' }}>Número de Acompanhantes:</label>
          <input type="number" id="numCompanions" name="numCompanions" value={formData.numCompanions} onChange={handleChange} min="0" style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--color-light-gray)' }} />
        </div>
        <div>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>Sua Mensagem (opcional):</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--color-light-gray)', resize: 'vertical' }} />
        </div>
        <button type="submit" disabled={submissionStatus === 'loading'} style={{ padding: '12px 20px', backgroundColor: 'var(--color-pink-soft)', color: 'var(--color-white)', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold' }}>
          {submissionStatus === 'loading' ? 'Enviando...' : 'Confirmar Presença'}
        </button>
      </form>

      <h2 style={{ marginTop: '40px', color: 'var(--color-deep-rose)', textAlign: 'center' }}>Convidados Confirmados</h2>
      {isLoadingGuests ? (
        <p style={{ textAlign: 'center' }}>Carregando lista...</p>
      ) : confirmedGuests.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Nenhum convidado confirmado ainda.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
          {confirmedGuests.map((guest, index) => (
            <li key={index} style={{ padding: '10px 0', borderBottom: '1px dashed var(--color-light-gray)', fontSize: '1.1em' }}>
              {guest.full_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}