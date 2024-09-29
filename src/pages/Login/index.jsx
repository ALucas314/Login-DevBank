import { useState } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseConfig";
import {
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import logoImg from "../../assets/logo.svg";
import arrowImg from "../../assets/arrow.svg";
import "./styles.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [resetPasswordEmail, setResetPasswordEmail] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();

  const [signInWithEmailAndPassword, user, loading] =
    useSignInWithEmailAndPassword(auth);

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        alert("Login com Google realizado com sucesso!");
        window.location.href = "https://dev-bank-uowg.vercel.app/";
      }
    } catch (error) {
      setFormError("Erro ao fazer login com o Google. Tente novamente.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
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

    try {
      const result = await signInWithEmailAndPassword(email, password);
      if (result.user) {
        alert("Login realizado com sucesso!");
        // Redirecionar para o link específico
        window.location.href = "https://dev-bank-ten.vercel.app/";
      }
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      if (err.code === "auth/wrong-password") {
        setFormError("Senha incorreta. Tente novamente.");
      } else if (err.code === "auth/user-not-found") {
        setFormError("Nenhum usuário encontrado com este e-mail.");
      } else if (err.code === "auth/invalid-email") {
        setFormError("O e-mail fornecido é inválido.");
      } else if (err.code === "auth/network-request-failed") {
        setFormError("Erro de rede. Verifique sua conexão e tente novamente.");
      } else {
        setFormError("Erro ao fazer login. Tente novamente.");
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
      setShowResetPassword(false);
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
        <span>Por favor digite suas informações de login</span>
      </header>

      <form onSubmit={handleLogin}>
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
            className={formError ? "error" : ""}
          />
        </div>

        {fieldError && <p className="error-message">{fieldError}</p>}
        {formError && <p className="error-message">{formError}</p>}

        <button type="submit" className="button">
          Entrar <img src={arrowImg} alt="->" />
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="button google space-between-buttons"
        >
          Login com Google
        </button>

        <div className="footer">
          <p>Não tem uma conta?</p>
          <Link to="/register">Cadastre-se aqui</Link>
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
