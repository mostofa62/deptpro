import { ReactNode } from "react";

interface DefaultLayoutProps {
  children: ReactNode;
}
const CardHolderTiny = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="rounded border-2 border-[#06c3ef]  bg-white py-2 px-3 shadow-default dark:border-strokedark dark:bg-boxdark">
      {children}
    </div>
  );
};

export default CardHolderTiny;
