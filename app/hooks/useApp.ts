import { useContext } from "react";
import AppContext from "@/app/context/app-context";

const useApp = () => {
    const auth = useContext(AppContext);
    return auth;
  };
  
export default useApp;
  