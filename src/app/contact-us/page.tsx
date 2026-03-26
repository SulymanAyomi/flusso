import ContactUsForm from "@/components/homepage/contact-us-form";
import Footer from "@/components/homepage/footer";
import Navbar from "@/components/homepage/navbar";

const ContactUsPage = () => {
  return (
    <div className="">
      <div className="xxx-gradient">
        <div className="max-w-6xl mx-auto min-h-screen space-y-7">
          <Navbar />
          <ContactUsForm />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactUsPage;
