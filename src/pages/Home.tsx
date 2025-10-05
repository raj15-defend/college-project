import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, Brain, Heart, ArrowRight } from "lucide-react";
import backgroundImage from "@/assets/backgroundimage.jpg";

const Home = () => {
  const diseases = [
    {
      title: "Diabetes Prediction",
      description: "Predict diabetes risk using health metrics like glucose levels, BMI, and blood pressure.",
      icon: Droplet,
      path: "/diabetes",
      color: "from-primary to-accent",
    },
    {
      title: "Parkinson's Disease",
      description: "Analyze voice measurements to predict Parkinson's disease using advanced AI algorithms.",
      icon: Brain,
      path: "/parkinsons",
      color: "from-accent to-secondary",
    },
    {
      title: "Heart Disease",
      description: "Assess heart disease risk based on cardiovascular health indicators and patient data.",
      icon: Heart,
      path: "/heart-disease",
      color: "from-secondary to-primary",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden bg-cover bg-center py-24"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background"></div>
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center animate-fade-in">
              <h1 className="mb-6 text-5xl font-bold leading-tight text-foreground md:text-6xl">
                AI-Powered Disease
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Prediction</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground md:text-xl">
                Leverage advanced machine learning algorithms to predict health risks early. 
                Enter your health data and get instant AI-powered predictions.
              </p>
              <Button 
                asChild
                size="lg"
                className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
              >
                <Link to="#predictions">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Disease Prediction Cards */}
        <section id="predictions" className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center animate-fade-in">
              <h2 className="mb-4 text-4xl font-bold text-foreground">
                Choose Your Prediction
              </h2>
              <p className="text-lg text-muted-foreground">
                Select a disease predictor to begin your health assessment
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {diseases.map((disease, index) => {
                const Icon = disease.icon;
                return (
                  <Card 
                    key={disease.path}
                    className="group shadow-card hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-scale-in border-border/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${disease.color} shadow-glow`}>
                        <Icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-2xl text-foreground">{disease.title}</CardTitle>
                      <CardDescription className="text-base">
                        {disease.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        asChild
                        className="w-full gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
                      >
                        <Link to={disease.path}>
                          Start Prediction <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="border-t border-border/40 bg-muted/30 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h3 className="mb-4 text-3xl font-bold text-foreground">
                How It Works
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our AI models are trained on extensive medical datasets to provide accurate predictions. 
                Simply input your health metrics, and our system will analyze the data using advanced 
                machine learning algorithms to assess your risk level. Please note that these predictions 
                are for informational purposes and should not replace professional medical advice.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
