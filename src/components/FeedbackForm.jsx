import { useState, useEffect } from "react";
import { createGlobalStyle, styled } from "styled-components";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    outline: none;
    & body {
      background-color: var(--blue-600);
      margin: 0;
      padding: 0;
      font-family: var(--font-family);
      color: var(--text-color);

      & #root {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        flex-direction: column;
      }
    }
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 28.125rem;
  padding: 2rem;

  & .p-card-body {
    padding-bottom: 1.65rem;

    & .p-card-title {
      font-size: 1.5rem;
      text-align: center;
      line-height: 1.8rem;
      margin: 0 0 1.5rem;
    }

    & .p-card-content {
      padding: 0;
    }
  }
`;

const FeedbackForm = () => {
  
  const [form, setForm] = useState({ nome: "", email: "", comentario: "" });
  const [errors, setErrors] = useState({});
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Não foi possível enviar seu Feedback!"
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Endpoint do Formspree - pode estar vazio ou incompleto
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xjkwrqew"; // Removido o ID do Formspree

  // Verificar se o endpoint do Formspree está configurado corretamente
  useEffect(() => {
    if (
      !FORMSPREE_ENDPOINT ||
      !FORMSPREE_ENDPOINT.startsWith("https://formspree.io/f/") ||
      FORMSPREE_ENDPOINT.length < 25
    ) {
      console.warn(
        "Endpoint do Formspree não está configurado corretamente. Ativando modo de demonstração."
      );
      setIsDemoMode(true);
    }
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target || {};
    if (id) {
      setForm((prevForm) => ({ ...prevForm, [id]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [id]: false }));
    }
  };

  const validar = () => {
    const { nome, email, comentario } = form;
    const validacao = {
      nome: !nome?.trim(),
      email: !email?.includes("@") || !email?.includes("."),
      comentario: !comentario?.trim(),
    };
    setErrors(validacao);
    return !Object.values(validacao).some(Boolean);
  };

  const simulateFormSubmission = () => {
    return new Promise((resolve) => {
      // Simular um atraso de rede de 1 segundo
      setTimeout(() => {
        console.log("MODO DE DEMONSTRAÇÃO: Simulando envio bem-sucedido");
        console.log("Dados que seriam enviados:", form);
        resolve({ ok: true });
      }, 1000);
    });
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Resetar mensagens de status
    setSucesso(false);
    setErro(false);

    if (validar()) {
      setIsSubmitting(true);

      try {
        let response;

        if (isDemoMode) {
          // Usar a simulação em vez de enviar para o Formspree
          response = await simulateFormSubmission();
        } else {
          // Envio real para o Formspree
          response = await fetch(FORMSPREE_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
        }

        if (response.ok) {
          console.log("Formulário processado com sucesso!");
          alert(`Nome: ${form.nome}\nE-mail: ${form.email}\nComentário: ${form.comentario}`);
          setSucesso(true);
          setForm({ nome: "", email: "", comentario: "" });
          setTimeout(() => setSucesso(false), 4000);
        } else {
          console.error("Erro ao processar formulário:", response.status);
          setErrorMessage(
            "Erro ao enviar: Verifique a configuração do formulário"
          );
          setErro(true);
          setTimeout(() => setErro(false), 4000);
        }
      } catch (err) {
        console.error("Erro:", err.message);

        // Mesmo com erro, mostrar mensagem de sucesso em modo de demonstração
        if (isDemoMode) {
          console.log(
            "MODO DE DEMONSTRAÇÃO: Ignorando erro e mostrando sucesso"
          );
          setSucesso(true);
          setForm({ nome: "", email: "", comentario: "" });
          setTimeout(() => setSucesso(false), 4000);
        } else {
          setErrorMessage(`Erro: ${err.message || "Falha na conexão"}`);
          setErro(true);
          setTimeout(() => setErro(false), 4000);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <>
      <GlobalStyle />
      <FormWrapper>
        <Card title="Formulário de Feedback" className="shadow-4">
          {isDemoMode && (
            <div className="p-2 mb-3 bg-blue-100 text-blue-800 rounded text-sm">
              <strong>Modo de demonstração ativo:</strong> Os envios serão
              simulados e não serão realmente enviados.
            </div>
          )}

          <form onSubmit={handleSubmit} method="POST">
            {[
              { id: "nome", display: "Nome" },
              { id: "email", display: "E-mail" },
              { id: "comentario", display: "Comentario" },
            ].map((campo) => {
              const isTextarea = campo.id === "comentario";

              return (
                <div key={campo.id} className="mb-3">
                  <label
                    htmlFor={campo.id}
                    className="block font-semibold mb-2"
                  >
                    {campo.display}
                  </label>
                  {isTextarea ? (
                    <InputTextarea
                      id={campo.id}
                      rows={4}
                      value={form[campo.id] || ""}
                      onChange={handleChange}
                      className={`w-full ${
                        errors[campo.id] ? "p-invalid" : ""
                      }`}
                      placeholder={`Digite seu ${campo.display.toLowerCase()}`}
                    />
                  ) : (
                    <InputText
                      id={campo.id}
                      value={form[campo.id] || ""}
                      onChange={handleChange}
                      className={`w-full ${
                        errors[campo.id] ? "p-invalid" : ""
                      }`}
                      placeholder={`Digite seu ${campo.display.toLowerCase()}`}
                    />
                  )}
                  {errors[campo.id] && (
                    <small className="text-red-500">
                      Esse campo é obrigatório.
                    </small>
                  )}
                </div>
              );
            })}
            <Button
              type="submit"
              label={isSubmitting ? "Enviando..." : "Enviar Feedback"}
              severity="success"
              className="w-full"
              disabled={isSubmitting}
            />
            {sucesso && (
              <p className="text-green-700 text-center font-semibold mt-3 mb-0">
                Feedback enviado com sucesso!
              </p>
            )}
            {erro && (
              <p className="text-red-700 text-center font-semibold mt-3 mb-0">
                {errorMessage}
              </p>
            )}
          </form>
        </Card>
      </FormWrapper>
    </>
  );
}

export default FeedbackForm;
