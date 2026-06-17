import { createContext, useContext } from "react";

// Contexto do menu lateral das três listras. A TopBar é a dona do estado
// (useState) e expõe `closeMenu` para os itens internos (abas, login/sair)
// fecharem o menu sem manipular `document.body.classList` diretamente.
export const MenuContext = createContext({ closeMenu: () => {} });

export function useMenu() {
  return useContext(MenuContext);
}
