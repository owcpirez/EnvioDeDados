/**
 * Formulário Moderno de Envio de Informações
 * Validações inteligentes, máscara de telefone, cópia rápida e integração com cliente de e-mail.
 */

document.addEventListener('DOMContentLoaded', () => {

  const EMAILJS_CONFIG = {
    serviceId: 'service_ce9zkjf',
    templateId: 'template_dg4tyqd',
    publicKey: '2gy8AthkfCs9iF3gL',
    toEmail: 'owcpirez@gmail.com'
  };

  const isEmailJsConfigured = true;

  if (window.emailjs) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }

  // Elementos do DOM
  const form = document.getElementById('contact-form');
  const inputNome = document.getElementById('nome');
  const inputTelefone = document.getElementById('telefone');
  const inputEndereco = document.getElementById('endereco');
  const textareaObservacoes = document.getElementById('observacoes');
  const charCountEl = document.getElementById('char-count');
  
  const btnSubmit = document.getElementById('btn-submit');
  const btnLabel = document.getElementById('btn-label');
  const btnSpinner = document.getElementById('btn-spinner');
  const btnSendIcon = document.getElementById('btn-send-icon');
  const btnClear = document.getElementById('btn-clear');

  const toast = document.getElementById('toast');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  // ==========================================
  // 1. Toast Notification Moderna
  // ==========================================
  function showToast(title, message, isError = false) {
    if (toastTimer) clearTimeout(toastTimer);

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    if (isError) {
      toast.classList.add('error');
    } else {
      toast.classList.remove('error');
    }

    toast.classList.remove('hidden');

    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 4000);
  }

  // ==========================================
  // 2. Máscara de Telefone Dinâmica
  // ==========================================
  inputTelefone.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 10) {
      // Formato com 9 dígitos: (11) 98765-4321
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      // Formato fixo ou em digitação: (11) 8765-4321
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)$/, '($1');
    }

    e.target.value = value;
    clearError(inputTelefone);
  });

  // ==========================================
  // 3. Contador de Caracteres das Observações
  // ==========================================
  textareaObservacoes.addEventListener('input', (e) => {
    charCountEl.textContent = e.target.value.length;
  });

  // ==========================================
  // 4. Limpeza e Validação Visual dos Campos
  // ==========================================
  function markError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    const inputContainer = inputElement.closest('.input-container');
    if (formGroup) formGroup.classList.add('has-error');
    if (inputContainer) inputContainer.classList.add('error');
  }

  function clearError(inputElement) {
    const formGroup = inputElement.closest('.form-group');
    const inputContainer = inputElement.closest('.input-container');
    if (formGroup) formGroup.classList.remove('has-error');
    if (inputContainer) inputContainer.classList.remove('error');
  }

  [inputNome, inputEndereco].forEach(input => {
    input.addEventListener('input', () => clearError(input));
  });

  // ==========================================
  // 5. Estruturação dos Dados
  // ==========================================
  function getFormData() {
    const nome = inputNome.value.trim();
    const telefone = inputTelefone.value.trim();
    const endereco = inputEndereco.value.trim();
    const destinatario = EMAILJS_CONFIG.toEmail;
    const observacoes = textareaObservacoes.value.trim() || 'Sem observações adicionais.';
    const dataHora = new Date().toLocaleString('pt-BR');

    const subject = `Envio de Informações - ${nome}`;
    const body = 
`Prezados,

Seguem as informações enviadas através do formulário de contato:

• Nome Completo: ${nome}
• Telefone / WhatsApp: ${telefone}
• Endereço: ${endereco}

Observações:
${observacoes}

-------------------------------------------
Enviado em ${dataHora}`;

    return { nome, telefone, endereco, destinatario, observacoes, subject, body, dataHora };
  }

  // ==========================================
  // 6. Limpar formulário para novo envio
  // ==========================================
  btnClear.addEventListener('click', () => {
    form.reset();
    charCountEl.textContent = '0';

    document.querySelectorAll('.form-group').forEach(group => {
      group.classList.remove('has-error');
    });

    document.querySelectorAll('.input-container').forEach(container => {
      container.classList.remove('error');
    });

    inputNome.focus();
    showToast('Formulário limpo', 'Você pode preencher os dados novamente.');
  });

  // ==========================================
  // 8. Envio do Formulário por E-mail
  // ==========================================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const nome = inputNome.value.trim();
    const telefoneDigits = inputTelefone.value.replace(/\D/g, '');
    const endereco = inputEndereco.value.trim();
    const destinatario = EMAILJS_CONFIG.toEmail;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validação de Nome
    if (nome.length < 3) {
      markError(inputNome);
      isValid = false;
    }

    // Validação de Telefone
    if (telefoneDigits.length < 10) {
      markError(inputTelefone);
      isValid = false;
    }

    // Validação do e-mail de destino fixo
    if (!emailRegex.test(destinatario)) {
      isValid = false;
    }

    // Validação de Endereço
    if (endereco.length < 5) {
      markError(inputEndereco);
      isValid = false;
    }

    if (!isValid) {
      showToast('Campos Incompletos', 'Por favor, revise os campos destacados em vermelho.', true);
      return;
    }

    btnSubmit.disabled = true;
    btnSpinner.classList.remove('hidden');
    btnSendIcon.classList.add('hidden');
    btnLabel.textContent = 'Enviando...';

    const data = getFormData();

    try {
      if (!isEmailJsConfigured || !window.emailjs) {
        throw new Error('EmailJS não configurado');
      }

      const templateParams = {
        to_email: EMAILJS_CONFIG.toEmail,
        destinatario: data.destinatario,
        nome: data.nome,
        nome_completo: data.nome,
        telefone: data.telefone,
        telefone_whatsapp: data.telefone,
        endereco: data.endereco,
        endereco_completo: data.endereco,
        observacoes: data.observacoes,
        assunto: data.subject,
        subject: data.subject,
        mensagem: data.body,
        message: data.body,
        body: data.body,
        data_hora: data.dataHora,
        data: data.dataHora,
        mensagem_completa: data.body
      };

      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        {
          publicKey: EMAILJS_CONFIG.publicKey
        }
      );

      showToast('Sucesso', 'Suas informações foram recebidas com sucesso.');
      form.reset();
      charCountEl.textContent = '0';
      inputNome.focus();
      return;
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);

      if (window.location.protocol === 'file:') {
        showToast('Origem não autorizada', 'Execute node server.js, abra http://localhost:5500 e permita localhost nos domínios do EmailJS.', true);
      } else if (error.status === 403) {
        showToast('Envio recusado', 'O EmailJS recusou esta origem. Autorize localhost nos domínios permitidos da sua conta EmailJS.', true);
      } else {
        showToast('Falha no envio', 'O e-mail não foi enviado. Verifique a configuração do EmailJS e tente novamente.', true);
      }
    } finally {
      btnSubmit.disabled = false;
      btnSpinner.classList.add('hidden');
      btnSendIcon.classList.remove('hidden');
      btnLabel.textContent = 'Enviar por E-mail';
    }
  });

});
