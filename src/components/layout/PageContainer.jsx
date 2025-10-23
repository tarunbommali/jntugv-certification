/* eslint-disable no-unused-vars */
import BreadCrumbs from "../ui/breadcrumbs/Breadcrumbs.jsx";

const PageContainer = ({ children, className, items, ...props }) => {
  return (
    <div
      className={`min-h-screen py-2 lg:px-18 md:px-4 sm:px-2 xl:max-w-8xl `}
      {...props}
    >
      {items && <BreadCrumbs items={items} />}
      {children}
    </div>
  );
};

export default PageContainer;
