"use client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2Icon, SendIcon } from "lucide-react";

const ContactUsForm = () => {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    business: "",
    message: "",
  });
  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };
  const [errors, setErrors] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors(false);
    setLoading(true);
    setSuccess(false);
    try {
      const res = await fetch("https://formspree.io/f/xovnyvdp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(formdata),
      });
      if (res.ok) {
        setSuccess(true);
        setFormdata({ name: "", email: "", business: "", message: "" });
      } else {
        setErrors(true);
      }
    } catch (err) {
      setErrors(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {success ? (
        <div className="w-full min-h-[calc(100vh-65px)] flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl md:text-6xl font-bold mb-4 text-brandBlue">
            Thank you for reaching out to us. We will surely get back to you
          </h1>
        </div>
      ) : (
        <div className="px-6 py-6">
          <h2 className="text-2xl font-semibold text-center mb-3">
            Get Started Today
          </h2>
          <p className="text-center text-sm mb-10 text-neutral-800">
            We’d love to hear from you. Fill out the form below and we will
            response promptly.
          </p>
          <Card className="w-full max-w-md h-full mx-auto">
            <form
              onSubmit={handleSubmit}
              className="max-w-xl mx-auto space-y-4 bg-inherit border p-6 rounded-lg shadow"
            >
              <div className="flex flex-col items-start mb-3">
                {errors && (
                  <p className="text-center text-xs text-red-500">
                    Something went wrong! Please try again.
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  className="w-full border rounded px-4 py-2"
                  value={formdata.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  required
                  className="w-full border rounded px-4 py-2"
                  value={formdata.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  type="text"
                  name="business"
                  placeholder="subject"
                  className="w-full border rounded px-4 py-2"
                  value={formdata.business}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  name="message"
                  placeholder="Message (optional)"
                  className="w-full border rounded px-4 py-2"
                  value={formdata.message}
                  onChange={handleChange}
                ></Textarea>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className={cn("w-full  cursor-pointer")}
              >
                {loading ? (
                  <>
                    <Loader2Icon className=" mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send message <SendIcon />
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                We’ll never share your information.
              </p>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContactUsForm;
