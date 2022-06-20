import styles from "./App.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "./shared/context/auth-context";
import StartingPageContent from "./components/StartingPage/StartingPageContent";
import Helmet from "react-helmet";
import { useAuth } from "./shared/hooks/auth-hook";
import LoadingSpinner from "./shared/components/UI/LoadingSpinner";

// Importamos las páginas a medida que las necesitemos para no cargar todo de golpe
const Login = React.lazy(() => import("./user/pages/Auth/LoginForm"));
const NewEnquiry = React.lazy(() => import("./enquiries/pages/NewEnquiryForm"));
const MainNavigation = React.lazy(() =>
  import("./shared/components/Navigation/MainNavigation")
);
const Signup = React.lazy(() => import("./user/pages/Auth/SignupForm"));
const UserEnquiries = React.lazy(() =>
  import("./enquiries/pages/UserEnquiries")
);
const Enquiry = React.lazy(() => import("./enquiries/pages/Enquiry"));
const EnquiryShared = React.lazy(() =>
  import("./enquiries/pages/EnquiryShared")
);
const AnsweredEnquiry = React.lazy(() =>
  import("./enquiries/components/AnsweredEnquiry")
);

function App() {
  // Llamamos a nuestro custom hook para gestionar el login/logout del usuario con un 'token'
  // Destructuramos el objeto que devuelve
  const { token, login, logout, userId, userInfo, isLoading } = useAuth();

  let routes;

  let sharedEnquiry = (
    <>
      <Route path="consultas/shared/:enquiryId" element={<EnquiryShared />} />
      <Route path="consultas/respondida" element={<AnsweredEnquiry />} />
    </>
  );

  if (token) {
    routes = (
      <Routes>
        <Route path="/" element={<StartingPageContent />} />
        <Route path="consultas" element={<UserEnquiries />} />
        <Route path="consultas/nueva" element={<NewEnquiry />} />
        <Route path="consultas/:enquiryId" element={<Enquiry />} />
        {sharedEnquiry}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  } else {
    routes = (
      <Routes>
        <Route path="/" element={<Navigate to="login" />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        {sharedEnquiry}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // Al volver a la página (ej.reload) primero estaremos no atenticados, mostramos spinner mientras
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    // Con context, cada vez que cambia algo respecto a la 'sesión', se actualizan los componentes
    <AuthContext.Provider
      value={{
        // Con '!!' lo convertimos a 'true' si es truthy y viceversa
        isLoggedIn: !!token,
        token,
        userId,
        userInfo,
        login,
        logout,
      }}
    >
      <BrowserRouter>
        <Helmet>
          <title>Diskoza</title>
          <meta
            name="description"
            content="Obtiene respuestas a tus preguntas de una forma más personalizada"
          />
        </Helmet>
        <meta
          name="keywords"
          content="Consultar, Preguntar, Dudas, Respuestas, Consultas, Preguntas, Ask, Enquiry, Answers"
        />
        <MainNavigation />
        <main className={styles.main}>
          <Suspense
            fallback={
              <div className="center">
                <LoadingSpinner />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
