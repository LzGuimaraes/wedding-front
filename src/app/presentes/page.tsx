// your-wedding-frontend/src/app/presentes/page.tsx

"use client"; // Marca como Client Component para interatividade

import { useState, FormEvent } from 'react';
import Image from 'next/image'; // Para exibir o QR Code

// Interfaces para os dados da doação
interface DonationFormData {
  guestId: number | null;
  donationType: string;
  amount: number;
  donorName: string;
  donorMessage: string;
}

export default function PresentesPage() {
  const [formData, setFormData] = useState<DonationFormData>({
    guestId: null,
    donationType: 'Presente', // Default para 'Presente'
    amount: 0,
    donorName: '',
    donorMessage: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null); // 'success', 'error', 'loading'
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3002/api'; 

  // CHAVE PIX E QR CODE (Exemplo: Substitua pelos seus dados reais!)
  // Você pode gerar um QR Code Pix estático (copia e cola em public/) ou usar uma API para gerar dinamicamente.
  const PIX_KEY = 'seu.email@exemplo.com'; // Exemplo de chave Pix (e-mail, CPF, CNPJ, telefone)
  const PIX_QR_CODE_URL = '/qrcode-pix.png'; // Exemplo: Imagem QR Code salva em public/

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleDonationSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmissionStatus('loading');
    setErrorMessage(null);

    // Validação frontend (além da validação do backend)
    if (!formData.donorName.trim()) {
      setErrorMessage("Por favor, preença seu nome como doador.");
      setSubmissionStatus('error');
      return;
    }
    if (formData.amount <= 0) {
      setErrorMessage("O valor da doação deve ser maior que zero.");
      setSubmissionStatus('error');
      return;
    }
    if (formData.donationType === 'Lua de Mel' && formData.amount < 100) {
      setErrorMessage("Para a Lua de Mel, o valor mínimo é de R$100.");
      setSubmissionStatus('error');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/donations/record`, {
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
      setFormData({ guestId: null, donationType: 'Presente', amount: 0, donorName: '', donorMessage: '' });
      alert("Sua doação foi registrada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao registrar doação:", error);
      setErrorMessage(`Falha ao registrar doação: ${error.message}`);
      setSubmissionStatus('error');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '30px', backgroundColor: 'var(--color-white)', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontFamily: 'inherit', color: 'var(--color-dark-gray)' }}>
      <h1 style={{ color: 'var(--color-deep-rose)', fontSize: '2.5em', marginBottom: '30px', textAlign: 'center' }}>Nossa Lista de Presentes</h1>
      <p style={{ textAlign: 'center', fontSize: '1.1em', marginBottom: '40px' }}>Sua presença é o maior presente! Mas se quiserem nos presentear, nos ajudem a realizar nossos sonhos:</p>

      {/* Seção de Doação Via Pix Geral */}
      <section style={{ marginBottom: '50px', border: '1px solid var(--color-light-gray)', borderRadius: '8px', padding: '30px' }}>
        <h2 style={{ color: 'var(--color-pink-soft)', fontSize: '1.8em', marginBottom: '20px', textAlign: 'center' }}>Presenteie Via Pix!</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>Qualquer valor será muito bem-vindo para nos ajudar a construir nosso lar.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Chave Pix: <span style={{ color: 'var(--color-deep-rose)' }}>{PIX_KEY}</span></p>
          <div style={{ border: '2px solid var(--color-gold-soft)', padding: '10px', borderRadius: '5px', backgroundColor: 'var(--color-white)' }}>
            <Image src={PIX_QR_CODE_URL} alt="QR Code Pix" width={150} height={150} style={{ display: 'block' }} />
          </div>
          <p style={{ fontSize: '0.9em', color: 'var(--color-dark-gray)' }}>Escaneie o QR Code acima ou copie a chave Pix.</p>
        </div>

        {/* Formulário para registrar a doação */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ color: 'var(--color-pink-soft)', fontSize: '1.5em', marginBottom: '20px', textAlign: 'center' }}>Registrar Sua Doação (Opcional)</h3>
          {submissionStatus === 'loading' && <p style={{ color: 'blue', textAlign: 'center' }}>Registrando doação...</p>}
          {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}
          {submissionStatus === 'success' && !errorMessage && <p style={{ color: 'green', textAlign: 'center' }}>Doação registrada com sucesso!</p>}

          <form onSubmit={handleDonationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label htmlFor="donorName" style={{ display: 'block', marginBottom: '5px' }}>Seu Nome:</label>
              <input type="text" id="donorName" name="donorName" value={formData.donorName} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--color-light-gray)' }} />
            </div>
            <div>
              <label htmlFor="amount" style={{ display: 'block', marginBottom: '5px' }}>Valor da Doação (R$):</label>
              <input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} min="0.01" step="0.01" required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--color-light-gray)' }} />
            </div>
            <div>
              <label htmlFor="donationType" style={{ display: 'block', marginBottom: '5px' }}>Destino da Doação:</label>
              <select id="donationType" name="donationType" value={formData.donationType} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--color-light-gray)' }}>
                <option value="Presente">Presente para o Lar</option>
                <option value="Lua de Mel">Caixinha da Lua de Mel</option>
              </select>
            </div>
            <div>
              <label htmlFor="donorMessage" style={{ display: 'block', marginBottom: '5px' }}>Mensagem (opcional):</label>
              <textarea id="donorMessage" name="donorMessage" value={formData.donorMessage} onChange={handleChange} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid var(--color-light-gray)', resize: 'vertical' }} />
            </div>
            <button type="submit" disabled={submissionStatus === 'loading'} style={{ padding: '12px 20px', backgroundColor: 'var(--color-gold-soft)', color: 'var(--color-white)', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1.1em', fontWeight: 'bold' }}>
              {submissionStatus === 'loading' ? 'Registrando...' : 'Registrar Doação'}
            </button>
          </form>
        </div>
      </section>

      {/* Seção de Caixinha de Doação para Lua de Mel (se for separada da geral) */}
      <section style={{ border: '1px solid var(--color-gold-soft)', borderRadius: '8px', padding: '30px', backgroundColor: 'var(--color-white)', marginTop: '30px' }}>
        <h2 style={{ color: 'var(--color-pink-soft)', fontSize: '1.8em', marginBottom: '20px', textAlign: 'center' }}>Caixinha de Doação para Lua de Mel</h2>
        <p style={{ textAlign: 'center', fontSize: '1.1em', marginBottom: '20px' }}>Ajude-nos a ter uma lua de mel inesquecível!</p>
        <p style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold', color: 'var(--color-deep-rose)' }}>Valor Mínimo: R$ 100,00</p>
        <p style={{ textAlign: 'center', fontSize: '0.9em', color: 'var(--color-dark-gray)', marginTop: '10px' }}>Use a mesma chave Pix acima e selecione "Caixinha da Lua de Mel" no formulário.</p>
        {/* O formulário de doação acima já serve para a lua de mel com a opção no select */}
      </section>

      {/* Seção para lista de presentes específicos (se for usar a API de /gifts) */}
      
      <section style={{ marginTop: '50px' }}>
        <h2 style={{ color: 'var(--color-pink-soft)', fontSize: '1.8em', marginBottom: '20px', textAlign: 'center' }}>Nossos Pedidos Específicos</h2>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>Aqui você pode reservar um item específico da nossa lista de desejos!</p>
        
        
      </section>
      
    </div>
  );
}