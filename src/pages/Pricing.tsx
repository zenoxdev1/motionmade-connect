import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Music,
  Check,
  Star,
  ArrowRight,
  Zap,
  Crown,
  Rocket,
  Users,
  Cloud,
  Shield,
  Headphones,
  Mic,
} from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for musicians just starting their journey",
      icon: Music,
      features: [
        "Up to 5 tracks upload",
        "Basic profile",
        "Community access",
        "Standard audio quality",
        "Basic discovery",
        "Mobile app access",
      ],
      limitations: [
        "Limited storage (1GB)",
        "Basic analytics",
        "Community support only",
      ],
      cta: "Get Started",
      popular: false,
      gradient: "from-gray-500 to-gray-600",
      borderColor: "border-gray-500/20",
      bgGradient: "from-card to-gray-950/10",
    },
    {
      name: "Pro",
      price: "$19",
      period: "/month",
      description: "For serious musicians ready to grow their career",
      icon: Zap,
      features: [
        "Unlimited track uploads",
        "Premium profile features",
        "Priority matching",
        "High-quality audio (24-bit)",
        "Advanced analytics",
        "Live collaboration tools",
        "Distribution to streaming platforms",
        "Priority support",
        "Advanced search filters",
        "Custom branding",
      ],
      limitations: [],
      cta: "Start Pro Trial",
      popular: true,
      gradient: "from-purple-500 to-blue-600",
      borderColor: "border-purple-500/20",
      bgGradient: "from-card via-purple-950/10 to-blue-950/10",
    },
    {
      name: "Studio",
      price: "$49",
      period: "/month",
      description: "For professionals and music studios",
      icon: Crown,
      features: [
        "Everything in Pro",
        "Team collaboration (up to 10 members)",
        "White-label solutions",
        "API access",
        "Advanced project management",
        "Multi-track recording",
        "Professional mastering tools",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced rights management",
        "Priority playlist placement",
        "Industry networking events",
      ],
      limitations: [],
      cta: "Contact Sales",
      popular: false,
      gradient: "from-yellow-500 to-orange-600",
      borderColor: "border-yellow-500/20",
      bgGradient: "from-card to-yellow-950/10",
    },
  ];

  const features = [
    {
      name: "High-Quality Audio",
      description: "24-bit lossless audio for professional sound",
      icon: Headphones,
    },
    {
      name: "Global Distribution",
      description: "Distribute to 150+ streaming platforms worldwide",
      icon: Cloud,
    },
    {
      name: "Real-time Collaboration",
      description: "Work together with musicians in real-time",
      icon: Users,
    },
    {
      name: "Rights Protection",
      description: "Copyright protection and licensing management",
      icon: Shield,
    },
    {
      name: "Professional Tools",
      description: "Advanced mixing and mastering capabilities",
      icon: Mic,
    },
    {
      name: "Analytics & Insights",
      description: "Detailed analytics to grow your audience",
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Motion Connect
            </span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              to="/community"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Community
            </Link>
            <Link to="/pricing" className="text-foreground font-medium">
              Pricing
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              asChild
            >
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 text-sm font-medium"
            >
              💎 Simple Pricing
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Choose Your
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent block">
                Musical Journey
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              From bedroom producers to professional studios, we have the
              perfect plan to accelerate your musical career. Start free,
              upgrade when you're ready.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => {
              const IconComponent = plan.icon;
              return (
                <Card
                  key={index}
                  className={`${plan.borderColor} bg-gradient-to-br ${plan.bgGradient} relative transition-all duration-300 hover:transform hover:scale-105 ${
                    plan.popular ? "ring-2 ring-purple-500/50" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-8">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mx-auto mb-4`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold mb-2">
                      {plan.name}
                    </CardTitle>
                    <div className="mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-center space-x-3"
                        >
                          <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {plan.limitations.length > 0 && (
                      <div className="border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground mb-2">
                          Limitations:
                        </p>
                        <div className="space-y-1">
                          {plan.limitations.map((limitation, limitIndex) => (
                            <p
                              key={limitIndex}
                              className="text-xs text-muted-foreground"
                            >
                              • {limitation}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      className={`w-full ${
                        plan.popular
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                          : plan.name === "Studio"
                            ? "bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                            : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800"
                      }`}
                      asChild={plan.name !== "Studio"}
                    >
                      {plan.name === "Studio" ? (
                        <a href="mailto:sales@motionconnect.com">
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                      ) : (
                        <Link to="/signup">
                          {plan.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      )}
                    </Button>

                    {plan.name === "Pro" && (
                      <p className="text-xs text-center text-muted-foreground">
                        14-day free trial • No credit card required
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Succeed
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional tools and features designed specifically for
              musicians
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10 text-center p-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Questions
              </span>
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Can I upgrade or downgrade my plan anytime?
                </h3>
                <p className="text-muted-foreground">
                  Yes! You can upgrade or downgrade your plan at any time.
                  Changes take effect immediately, and we'll prorate any billing
                  adjustments.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Is there a free trial for Pro plans?
                </h3>
                <p className="text-muted-foreground">
                  Yes! We offer a 14-day free trial for all Pro features. No
                  credit card required to start your trial.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  What happens to my music if I cancel?
                </h3>
                <p className="text-muted-foreground">
                  Your music remains accessible for 30 days after cancellation.
                  You can download all your tracks and data during this period.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-card to-blue-950/10">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Do you offer student discounts?
                </h3>
                <p className="text-muted-foreground">
                  Yes! Students get 50% off Pro plans with a valid student ID.
                  Contact our support team to verify your student status.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-4xl mx-auto border-purple-500/20 bg-gradient-to-br from-card via-purple-950/10 to-blue-950/10">
            <CardContent className="p-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Start Your
                <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}
                  Musical Journey?
                </span>
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of musicians who are already creating amazing
                music with Motion Connect. Start for free today!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 h-auto"
                  asChild
                >
                  <Link to="/signup">
                    <Rocket className="w-5 h-5 mr-2" />
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="text-lg px-8 py-6 h-auto border-purple-500/30 hover:bg-purple-500/10"
                  asChild
                >
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Motion Connect
              </span>
            </Link>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <Link
                to="/privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="hover:text-foreground transition-colors"
              >
                Terms
              </Link>
              <a href="#" className="hover:text-foreground transition-colors">
                Support
              </a>
              <span>© 2024 Motion Connect. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
