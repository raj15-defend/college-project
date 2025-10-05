import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const Parkinsons = () => {
  const [formData, setFormData] = useState({
    mdvpFo: "",
    mdvpFhi: "",
    mdvpFlo: "",
    mdvpJitter: "",
    mdvpJitterAbs: "",
    mdvpRap: "",
    mdvpPpq: "",
    jitterDdp: "",
    mdvpShimmer: "",
    mdvpShimmerDb: "",
    shimmerApq3: "",
    shimmerApq5: "",
    mdvpApq: "",
    shimmerDda: "",
    nhr: "",
    hnr: "",
    rpde: "",
    dfa: "",
    spread1: "",
    spread2: "",
    d2: "",
    ppe: "",
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
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/predict-parkinsons`,
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
    { name: "mdvpFo", label: "MDVP:Fo(Hz)", placeholder: "e.g., 119.992" },
    { name: "mdvpFhi", label: "MDVP:Fhi(Hz)", placeholder: "e.g., 157.302" },
    { name: "mdvpFlo", label: "MDVP:Flo(Hz)", placeholder: "e.g., 74.997" },
    { name: "mdvpJitter", label: "MDVP:Jitter(%)", placeholder: "e.g., 0.00784" },
    { name: "mdvpJitterAbs", label: "MDVP:Jitter(Abs)", placeholder: "e.g., 0.00007" },
    { name: "mdvpRap", label: "MDVP:RAP", placeholder: "e.g., 0.00370" },
    { name: "mdvpPpq", label: "MDVP:PPQ", placeholder: "e.g., 0.00554" },
    { name: "jitterDdp", label: "Jitter:DDP", placeholder: "e.g., 0.01109" },
    { name: "mdvpShimmer", label: "MDVP:Shimmer", placeholder: "e.g., 0.04374" },
    { name: "mdvpShimmerDb", label: "MDVP:Shimmer(dB)", placeholder: "e.g., 0.426" },
    { name: "shimmerApq3", label: "Shimmer:APQ3", placeholder: "e.g., 0.02182" },
    { name: "shimmerApq5", label: "Shimmer:APQ5", placeholder: "e.g., 0.03130" },
    { name: "mdvpApq", label: "MDVP:APQ", placeholder: "e.g., 0.02971" },
    { name: "shimmerDda", label: "Shimmer:DDA", placeholder: "e.g., 0.06545" },
    { name: "nhr", label: "NHR", placeholder: "e.g., 0.02211" },
    { name: "hnr", label: "HNR", placeholder: "e.g., 21.033" },
    { name: "rpde", label: "RPDE", placeholder: "e.g., 0.414783" },
    { name: "dfa", label: "DFA", placeholder: "e.g., 0.815285" },
    { name: "spread1", label: "Spread1", placeholder: "e.g., -4.813031" },
    { name: "spread2", label: "Spread2", placeholder: "e.g., 0.266482" },
    { name: "d2", label: "D2", placeholder: "e.g., 2.301442" },
    { name: "ppe", label: "PPE", placeholder: "e.g., 0.284654" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center animate-fade-in">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-secondary shadow-glow">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mb-4 text-4xl font-bold text-foreground">Parkinson's Disease Prediction</h1>
            <p className="text-lg text-muted-foreground">
              Enter voice measurement data to predict Parkinson's disease risk using AI
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-card animate-scale-in border-border/50">
                <CardHeader>
                  <CardTitle>Voice Measurements</CardTitle>
                  <CardDescription>Provide accurate voice analysis metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      {formFields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <Label htmlFor={field.name} className="text-sm">{field.label}</Label>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="number"
                            step="any"
                            placeholder={field.placeholder}
                            value={formData[field.name as keyof typeof formData]}
                            onChange={handleInputChange}
                            className="border-border/50 focus:border-accent"
                          />
                        </div>
                      ))}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-accent to-secondary text-primary-foreground shadow-glow hover:opacity-90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Analyzing..." : "Predict Parkinson's Risk"}
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
                        result.prediction === "Positive" 
                          ? "bg-destructive/10 text-destructive" 
                          : "bg-accent/10 text-accent"
                      }`}>
                        {result.prediction === "Positive" ? (
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
                      <Brain className="mb-3 h-12 w-12 text-muted-foreground/50" />
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

export default Parkinsons;
