// Obtenemos la fecha de conexión o devolvemos null
export const logTime = () => {
  let expir;
  if (localStorage.getItem("userData")) {
    expir = new Date(JSON.parse(localStorage.getItem("userData")).expiration);
    return new Date(expir.setHours(expir.getHours() - 1));
  }
  return null;
};
