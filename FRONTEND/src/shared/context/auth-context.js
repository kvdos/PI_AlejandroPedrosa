// Este componente de context nos ayudará a compartir información entre componentes sin props
import { createContext } from "react";

// Creamos el contexto inicializándolo con un estado y dos métodos para gestionar al autenticación
// Lo exportamos para que cualquier componente que lo 'escuche', pueda actualizar en base al contexto
export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  userInfo: null,
  token: null,
  login: () => {},
  logout: () => {},
});
