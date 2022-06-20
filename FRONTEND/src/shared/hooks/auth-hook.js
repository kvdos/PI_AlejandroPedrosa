import { useState, useCallback, useEffect } from "react";

// Variable general del componente para cuando caduca el 'token'
let logoutTimer;

export const useAuth = () => {
  // GESTIÓN DEL LOGIN
  // State para determinar si el usuario ha hecho login
  const [token, setToken] = useState(false);
  // State para determinar el id del usuario
  const [userId, setUserId] = useState(false);
  // State para determinar nombre, localizacion y correo del usuario
  const [userInfo, setUserInfo] = useState(false);
  // State para gestionar la fecha de expiración del 'token'
  const [tokenExpirationDate, setTokenExpirationDate] = useState();

  // State para gestionar la espera de la obtención del 'token'
  const [isLoading, setIsLoading] = useState(true);

  // Función de login con useCallback para evitar infinite loops y que inicia la 'sesión'
  const login = useCallback((userId, userInfo, token, expirationDate) => {
    setToken(token);
    setUserId(userId);
    setUserInfo(userInfo);
    // Recuperamos la fecha de expiración de 1h o la generamos si no la hay
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    // Fijamos la nueva fecha de caducidad en el state correspondiente
    setTokenExpirationDate(tokenExpirationDate);
    // En localStorage, fijamos nueva entrada, 'userData', con userId, 'token' y la fecha de caducidad
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: userId,
        userInfo: userInfo,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  // Función de logout para cerrar la 'sesión'
  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setUserInfo(null);
    localStorage.removeItem("userData");
    setTokenExpirationDate(null);
  }, []);

  // Cada vez que el 'token' cambia, se modifica el timer de su caducidad
  useEffect(() => {
    // Si tenemos 'token' y fecha de caducidad, fijamos el timeout
    if (token && tokenExpirationDate) {
      // Calculamos en milesegundos el tiempo que nos queda desde login hasta la hora
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      // Apuntamos al 'logout', pasamos lo que queda de tiempo y lo almacenamos
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      // Si no, en caso de haber hecho logout, limpiamos el timeout
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // Gestionamos con useEffect la recuperación del id y 'token' almacenados en localStorage
  // para volver a permitir entrar al usuario
  useEffect(() => {
    // Obtenemos y convertimos en JSON el item almacenado en localStorage con una clave
    const storedData = JSON.parse(localStorage.getItem("userData"));
    // Comprobamos el item, el 'token' y que la fecha de expiración es mayor a la actual
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      // De ser así, permitimos la entreda al usuario pasando a 'login' el id y 'token'
      login(
        storedData.userId,
        storedData.userInfo,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
    // Ya con el 'token' para devolver, dejamos de mostrar el splash screen
    setIsLoading(false);
    // Tendrá 'login' como dependencia, pero al ser callback, solo ejecutará una vez
  }, [login]);

  return { token, login, logout, userId, userInfo, isLoading };
};
