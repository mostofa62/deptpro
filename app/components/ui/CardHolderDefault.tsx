import { ReactNode } from "react";

interface DefaultLayoutProps {
  children: ReactNode;
}
const CardHolderDefault = ({ children }: DefaultLayoutProps) => {
  return (
    <div className="rounded border border-stroke bg-white py-1 px-1 md:py-6 md:px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      {children}
    </div>
  );
};

export default CardHolderDefault;
