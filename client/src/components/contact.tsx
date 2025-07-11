import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ContactFormData, contactSchema } from "@/lib/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const socialLinks = [
  { name: "GitHub", abbr: "GH", url: "https://github.com", color: "neon-green", icon: "/pixel-icons/pixel-github.png" },
  { name: "LinkedIn", abbr: "LI", url: "https://linkedin.com", color: "hot-pink", icon: "/pixel-icons/pixel-linkedin.png" },
  { name: "Instagram", abbr: "IG", url: "https://instagram.com", color: "pixel-orange", icon: "/pixel-icons/pixel-instagram.png" },
];

export default function Contact() {
  const { toast } = useToast();
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "I'll get back to you as soon as possible.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  return (
    <section id="contact" className="py-20 scanline-overlay">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-pixel text-xl md:text-2xl text-[var(--neon-green)] mb-4">
            CONTACT
          </h2>
          <div className="font-retro text-lg text-[var(--light-grey)]">
            Ready to start your next project?
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="font-pixel text-lg text-[var(--pixel-orange)] mb-8">
              GET IN TOUCH
            </h3>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-[var(--neon-green)] flex items-center justify-center rounded">
                  <span className="font-pixel text-xs text-[var(--dark-navy)]">@</span>
                </div>
                <div>
                  <div className="font-pixel text-xs text-[var(--neon-green)]">EMAIL</div>
                  <div className="font-retro text-sm text-[var(--light-grey)]">
                    sushilpatel5113@gmail.com
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-[var(--hot-pink)] flex items-center justify-center rounded">
                  <span className="font-pixel text-xs text-[var(--dark-navy)]">📱</span>
                </div>
                <div>
                  <div className="font-pixel text-xs text-[var(--hot-pink)]">PHONE</div>
                  <div className="font-retro text-sm text-[var(--light-grey)]">
                    +91 9302298310
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-[var(--pixel-orange)] flex items-center justify-center rounded">
                  <span className="font-pixel text-xs text-[var(--dark-navy)]">📍</span>
                </div>
                <div>
                  <div className="font-pixel text-xs text-[var(--pixel-orange)]">LOCATION</div>
                  <div className="font-retro text-sm text-[var(--light-grey)]">
                    Bilaspur, Chhattisgarh, India
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="font-pixel text-sm text-[var(--neon-green)] mb-4">
                SOCIAL LINKS
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-12 h-12 flex items-center justify-center rounded transition-all duration-200 hover:scale-110`}
                  >
                    <img src={link.icon} alt={link.name} className="w-full h-full object-contain p-2" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[var(--darker-blue)] p-8 rounded-lg border-2 border-[var(--neon-green)]">
            <h3 className="font-pixel text-sm text-[var(--pixel-orange)] mb-6">
              SEND MESSAGE
            </h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pixel text-xs text-[var(--light-grey)]">
                        NAME
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="w-full bg-[var(--dark-navy)] border-2 border-[var(--neon-green)] rounded px-4 py-2 font-retro text-sm text-[var(--light-grey)] focus:border-[var(--hot-pink)] focus:outline-none transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pixel text-xs text-[var(--light-grey)]">
                        EMAIL
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          className="w-full bg-[var(--dark-navy)] border-2 border-[var(--neon-green)] rounded px-4 py-2 font-retro text-sm text-[var(--light-grey)] focus:border-[var(--hot-pink)] focus:outline-none transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-pixel text-xs text-[var(--light-grey)]">
                        MESSAGE
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          className="w-full bg-[var(--dark-navy)] border-2 border-[var(--neon-green)] rounded px-4 py-2 font-retro text-sm text-[var(--light-grey)] focus:border-[var(--hot-pink)] focus:outline-none transition-colors duration-200"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="retro-button retro-button-green w-full glitch-hover"
                >
                  {contactMutation.isPending ? "SENDING..." : "SEND MESSAGE"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
