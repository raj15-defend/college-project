import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplet, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Diabetes = () => {
  const [formData, setFormData] = useState({
    pregnancies: "",
    glucose: "",
    bloodPressure: "",
    skinThickness: "",
    insulin: "",
    bmi: "",
    diabetesPedigree: "",
    age: "",
  });

  const [result, setResult] = useState<{ prediction: string; probability: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const isEmpty = Object.values(formData).some(value => value === "");
    if (isEmpty) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/predict-diabetes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Prediction failed");
      }

      const result = await response.json();
      setResult(result);
      toast.success("AI analysis completed successfully");
    } catch (error) {
      console.error("Prediction error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get prediction");
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    { name: "pregnancies", label: "Number of Pregnancies", placeholder: "e.g., 2" },
    { name: "glucose", label: "Glucose Level (mg/dL)", placeholder: "e.g., 120" },
    { name: "bloodPressure", label: "Blood Pressure (mm Hg)", placeholder: "e.g., 80" },
    { name: "skinThickness", label: "Skin Thickness (mm)", placeholder: "e.g., 20" },
    { name: "insulin", label: "Insulin Level (μU/mL)", placeholder: "e.g., 80" },
    { name: "bmi", label: "BMI", placeholder: "e.g., 25.5" },
    { name: "diabetesPedigree", label: "Diabetes Pedigree Function", placeholder: "e.g., 0.5" },
    { name: "age", label: "Age", placeholder: "e.g., 35" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center animate-fade-in">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
              <Droplet className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-foreground">Diabetes Prediction</h1>
            <p className="text-lg text-muted-foreground">
              Enter your health metrics to predict diabetes risk using AI
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-card animate-scale-in border-border/50">
                <CardHeader>
                  <CardTitle>Patient Information</CardTitle>
                  <CardDescription>Please provide accurate health data for best results</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {formFields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label htmlFor={field.name}>{field.label}</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="number"
                            step="any"
                            placeholder={field.placeholder}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleInputChange}
                            className="border-border/50 focus:border-primary"
                          />
                        </div>
                      ))}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Analyzing..." : "Predict Diabetes Risk"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="shadow-card sticky top-24 animate-scale-in border-border/50">
                <CardHeader>
                  <CardTitle>Prediction Result</CardTitle>
                  <CardDescription>AI-powered analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  {result ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className={`flex items-center gap-3 rounded-lg p-4 ${
                        result.prediction === "High Risk" 
                          ? "bg-destructive/10 text-destructive" 
                          : "bg-primary/10 text-primary"
                      }`}>
                        {result.prediction === "High Risk" ? (
                          <AlertCircle className="h-6 w-6" />
                        ) : (
                          <CheckCircle2 className="h-6 w-6" />
                        )}
                        <div>
                          <p className="font-semibold">{result.prediction}</p>
                          <p className="text-sm opacity-90">
                            {result.probability.toFixed(1)}% confidence
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        This prediction is based on AI analysis. Please consult with a healthcare 
                        professional for proper medical advice.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Droplet className="mb-3 h-12 w-12 text-muted-foreground/50" />
                      <p className="text-sm text-muted-foreground">
                        Fill in the form and submit to see your prediction results
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Diabetes;
