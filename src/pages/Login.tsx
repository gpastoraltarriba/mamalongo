import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, provider, db } from '../lib/firebase';
import styles from "../assets/login.module.css"

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Funcion Login Google
  const btnLoginGoogle = async () => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithPopup(auth, provider)
          .then(async (userCredential) => {
            const user = userCredential.user
            await setDoc(doc(db, "users", user.uid), {
              uid: user.uid,
              username: user.displayName,
              email: email,
              foto: ""
            })
            navigate("/")
          }).catch((error) => {
            setError(error.message)
          })
      }).catch((error) => {
        setError(error.message)
      })
  }

  // Función Login Normal
  const btnLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            const user = auth.currentUser
            if(user?.emailVerified){
              navigate("/")
            }else{
              setError("Cuenta no verificada porfavor compruebe su correo electronico")
              return auth.signOut()
            }
          }).catch((error) => {
            setError(error.message)
          })
      }).catch((error) => {
        setError(error.message)
      })
  }

  return (
    <div className={styles.loginContainer}>
      {/* Mensaje de error cuando pase un error */}
      {error != null ? (
        <>
          <div className={styles.msgError}>
            <span>{error}</span>
          </div>
        </>
      ) : (
        <></>
      )}
      <h2 style={{ textAlign: 'center', color: '#172b4d' }}>Iniciar Sesión</h2>
      {/* Boton para iniciar sesion con Google */}
      <button onClick={btnLoginGoogle} className={styles.btnGoogle}>
        Continuar con Google
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)"><path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"></path><path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"></path><path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"></path><path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"></path></g></svg>
      </button>

      <hr style={{ margin: '20px 0', borderColor: '#eee' }} />
      {/* Boton para iniciar sesion con correo electronico y contraseña */}
      <form onSubmit={btnLogin}>
        <input className={styles.formInput} type="email" placeholder="Correo electrónico" required onChange={(e) => setEmail(e.target.value)} />
        <input className={styles.formInput} type="password" placeholder="Contraseña" required onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className={styles.formBtn}>
          Iniciar sesión
        </button>
      </form>
      <div>
        <p className={styles.textSignup}>¿No tienes Cuenta? <span className={styles.btnSignup} onClick={() => navigate("/signup")}>Regístrate</span></p>
      </div>
    </div>
  );
};

export default Login;