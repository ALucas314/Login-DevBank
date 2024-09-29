import { useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import arrowImg from "../../assets/arrow.svg";
import logoImg from "../../assets/logo.svg";
import { auth } from "../../services/firebaseConfig";
import {
  fetchSignInMethodsForEmail,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import "./styles.css";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);

  const [createUserWithEmailAndPassword, user, loading] =
    useCreateUserWithEmailAndPassword(auth);

  const checkEmailExists = async (email) => {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0;
    } catch (err) {
      console.error("Erro ao verificar o e-mail:", err);
      return false;
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoogleValidation = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert("Login com Google realizado com sucesso!");
      // Aqui, se desejar redirecionar após login com Google, você pode usar navigate ou outros métodos de redirecionamento
    } catch (error) {
      setFormError("Erro ao fazer login com o Google. Tente novamente.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setFormError("");
    setFieldError("");

    if (!email || !password) {
      setFieldError("Por favor, preencha todos os campos.");
      return;
    }

    if (!isValidEmail(email)) {
      setFieldError("O e-mail fornecido é inválido.");
      return;
    }

    if (password.length < 6) {
      setPasswordError(
        "Sua senha é muito fraca. Ela deve ter pelo menos 6 caracteres."
      );
      return;
    }

    const emailExists = await checkEmailExists(email);
    if (emailExists) {
      setFormError(
        "Já foi criada uma conta com este e-mail. Tente fazer login ou use um e-mail diferente."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        email,
        password
      );
      if (userCredential.user) {
        await userCredential.user.sendEmailVerification();
        alert("Conta criada com sucesso. Verifique seu e-mail para confirmar.");
        // Aqui, em vez de usar navigate, redireciona com Link
      }
    } catch (err) {
      console.error("Erro ao criar a conta:", err);
      switch (err.code) {
        case "auth/invalid-email":
          setFormError("O e-mail fornecido é inválido.");
          break;
        case "auth/weak-password":
          setFormError("A senha fornecida é muito fraca.");
          break;
        case "auth/email-already-in-use":
          setFormError(
            "Já foi criada uma conta com este e-mail. Tente fazer login ou use um e-mail diferente."
          );
          break;
        case "auth/network-request-failed":
          setFormError(
            "Erro de rede. Verifique sua conexão e tente novamente."
          );
          break;
        case "auth/operation-not-allowed":
          setFormError("Operação não permitida. Contate o suporte.");
          break;
        // Remova o bloco default para não exibir mensagens genéricas
      }
    }
  };

  const handlePasswordReset = async () => {
    if (!isValidEmail(resetPasswordEmail)) {
      setFormError("O e-mail fornecido para recuperação de senha é inválido.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetPasswordEmail);
      alert("E-mail de recuperação de senha enviado com sucesso!");
      setShowResetPassword(false); // Oculta o campo de recuperação de senha após o envio
    } catch (err) {
      console.error("Erro ao enviar o e-mail de recuperação de senha:", err);
      setFormError(
        "Erro ao enviar o e-mail de recuperação de senha. Tente novamente."
      );
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="container">
      <header className="header">
        <img src={logoImg} alt="Workflow" className="logoImg" />
        <span>Por favor digite suas informações de cadastro</span>
      </header>

      <form onSubmit={handleSignUp}>
        <div className="inputContainer">
          <label htmlFor="email">E-mail</label>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="antoniolucas@gmail.com"
            onChange={(e) => setEmail(e.target.value)}
            className={fieldError ? "error" : ""}
          />
        </div>

        <div className="inputContainer">
          <label htmlFor="password">Senha</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="********************"
            onChange={(e) => setPassword(e.target.value)}
            className={passwordError ? "error" : ""}
          />
          {passwordError && <p className="error-message">{passwordError}</p>}
        </div>

        {fieldError && <p className="error-message">{fieldError}</p>}
        {formError && <p className="error-message">{formError}</p>}

        <Link to="/" className="button-link" onClick={handleSignUp}>
          <button type="button" className="button">
            Cadastrar <img src={arrowImg} alt="->" />
          </button>
        </Link>

        <button
          type="button"
          onClick={handleGoogleValidation}
          className="button google"
        >
          Validação com Google
        </button>

        <div className="footer">
          <p>Você já tem uma conta?</p>
          <Link to="/" className="white-link">
            Acesse sua conta aqui
          </Link>
          <p
            className="forgot-password"
            onClick={() => setShowResetPassword(!showResetPassword)}
          >
            Esqueceu sua senha?
          </p>
        </div>
      </form>

      {showResetPassword && (
        <div className="password-reset">
          <h3>Recuperar senha</h3>
          <input
            type="text"
            placeholder="Digite seu e-mail para recuperação"
            onChange={(e) => setResetPasswordEmail(e.target.value)}
            className={formError ? "error" : ""}
          />
          <button onClick={handlePasswordReset}>
            Enviar e-mail de recuperação
          </button>
        </div>
      )}
    </div>
  );
}
