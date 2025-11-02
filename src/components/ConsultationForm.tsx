import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const formSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s\(\)\-\+]+$/, { message: "Please enter a valid phone number" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(20, { message: "Phone number must be less than 20 characters" }),
  zipCode: z
    .string()
    .trim()
    .regex(/^\d{5}(-\d{4})?$/, { message: "Please enter a valid ZIP code (e.g., 85281)" })
    .max(10),
  insuranceType: z.string().min(1, { message: "Please select an insurance type" }),
  contactTime: z.string().min(1, { message: "Please select your preferred contact time" }),
  currentInsurer: z.string().trim().max(100).optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ConsultationForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      zipCode: "",
      insuranceType: "",
      contactTime: "",
      currentInsurer: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Send data to n8n webhook
      const response = await fetch("https://vnguy113.app.n8n.cloud/webhook-test/1f5cbbd8-8cbf-4097-b25a-b30217e712d6", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          zipCode: data.zipCode,
          insuranceType: data.insuranceType,
          contactTime: data.contactTime,
          currentInsurer: data.currentInsurer || "",
          timestamp: new Date().toISOString(),
          source: "roi_consultation_form",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to webhook");
      }

      toast({
        title: "Success! 🎉",
        description: "We'll reach out to you shortly to discuss your insurance needs and ROI.",
      });
      form.reset();
    } catch (error) {
      console.error("Webhook error:", error);
      toast({
        title: "Error",
        description: "There was a problem submitting your form. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8" style={{ background: "var(--gradient-bg)" }}>
      <div className="w-full max-w-2xl">
        <div 
          className="rounded-2xl p-8 sm:p-10 lg:p-12"
          style={{ 
            background: "var(--gradient-card)",
            boxShadow: "var(--shadow-medium)"
          }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              See Your ROI
            </h1>
            <p className="text-muted-foreground text-lg max-w-md mx-auto">
              Discover how much you could save with AI-powered insurance solutions
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Full Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Jane Doe" 
                        {...field}
                        className="h-12 bg-background/50 border-border focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="e.g., jane.doe@email.com" 
                          {...field}
                          className="h-12 bg-background/50 border-border focus:border-primary transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Phone Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="tel"
                          placeholder="(555) 123-4567" 
                          {...field}
                          className="h-12 bg-background/50 border-border focus:border-primary transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">ZIP Code</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., 85281" 
                        {...field}
                        className="h-12 bg-background/50 border-border focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="insuranceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Type of Insurance Needed</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border focus:border-primary transition-colors">
                            <SelectValue placeholder="Select insurance type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border z-50">
                          <SelectItem value="auto">Auto</SelectItem>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="renters">Renters</SelectItem>
                          <SelectItem value="life">Life</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Best Time to Contact</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-background/50 border-border focus:border-primary transition-colors">
                            <SelectValue placeholder="Select preferred time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card border-border z-50">
                          <SelectItem value="morning">Morning (9am-12pm)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12pm-5pm)</SelectItem>
                          <SelectItem value="evening">Evening (5pm-8pm)</SelectItem>
                          <SelectItem value="anytime">Any Time</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currentInsurer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-medium">Current Insurer (if any)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., State Farm, GEICO" 
                        {...field}
                        className="h-12 bg-background/50 border-border focus:border-primary transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              >
                See My ROI & Schedule Consultation
              </Button>
            </form>
          </Form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            🔒 Your information is secure and will never be shared
          </p>
        </div>
      </div>
    </div>
  );
}
