import "react";
import { global_classnames } from "../utils/classnames.js";
import Breadcrumbs from "../components/ui/breadcrumbs/Breadcrumbs.jsx";




    const breadcrumbItems = [
        { label: "Home", link: "/" },
        { label: "Profile", link: "/profile" },
        { label: "Edit Profile", link: "/profile/edit" },

    ];
const ProfileEdit = () => {
  return (
    <section className="min-h-screen bg-gray-100 ">
      <div
        className={`${global_classnames.width.container}   mx-auto px-4 sm:px-6 lg:px-8`}
      >
        <Breadcrumbs items={breadcrumbItems} />

        <div>ProfileEdit</div>
      </div>
    </section>
  );
};

export default ProfileEdit;
