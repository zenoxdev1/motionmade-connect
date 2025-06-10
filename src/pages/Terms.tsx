import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-950/20">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Motion Connect
            </span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/signup">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Signup
            </Link>
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Terms of
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Service
              </span>
            </h1>
            <p className="text-muted-foreground">
              Last updated: December 10, 2024
            </p>
          </div>

          <Card className="border-purple-500/20 bg-gradient-to-br from-card to-purple-950/10">
            <CardContent className="p-8 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  1. Acceptance of Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Motion Connect ("the Service"), you
                  accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  2. Use License
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Permission is granted to temporarily use Motion Connect for
                  personal, non-commercial transitory viewing only. This is the
                  grant of a license, not a transfer of title, and under this
                  license you may not:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>modify or copy the materials</li>
                  <li>
                    use the materials for any commercial purpose or for any
                    public display
                  </li>
                  <li>
                    attempt to reverse engineer any software contained on the
                    website
                  </li>
                  <li>
                    remove any copyright or other proprietary notations from the
                    materials
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  3. User Content
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Motion Connect allows users to upload, share, and collaborate
                  on musical content. By uploading content, you represent and
                  warrant that:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>You own or have the necessary rights to your content</li>
                  <li>
                    Your content does not infringe on any third-party rights
                  </li>
                  <li>
                    Your content complies with all applicable laws and
                    regulations
                  </li>
                  <li>
                    You grant Motion Connect a license to use, display, and
                    distribute your content on the platform
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  4. Privacy Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your privacy is important to us. Our Privacy Policy explains
                  how we collect, use, and protect your information when you use
                  our service. By using Motion Connect, you agree to the
                  collection and use of information in accordance with our
                  Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  5. Prohibited Uses
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may not use Motion Connect:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>
                    For any unlawful purpose or to solicit others to perform
                    acts
                  </li>
                  <li>
                    To violate any international, federal, provincial, or state
                    regulations or laws
                  </li>
                  <li>
                    To transmit, or procure the sending of, any advertising or
                    promotional material
                  </li>
                  <li>
                    To impersonate or attempt to impersonate the company,
                    employees, or other users
                  </li>
                  <li>
                    To upload or transmit viruses or any other type of malicious
                    code
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  6. Intellectual Property
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The service and its original content, features, and
                  functionality are and will remain the exclusive property of
                  Motion Connect and its licensors. The service is protected by
                  copyright, trademark, and other laws. Our trademarks and trade
                  dress may not be used in connection with any product or
                  service without our prior written consent.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  7. Termination
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may terminate or suspend your account and bar access to the
                  service immediately, without prior notice or liability, under
                  our sole discretion, for any reason whatsoever and without
                  limitation, including but not limited to a breach of the
                  Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  8. Disclaimer
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  The information on this website is provided on an "as is"
                  basis. To the fullest extent permitted by law, this Company
                  excludes all representations, warranties, conditions and terms
                  relating to our website and the use of this website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  9. Changes to Terms
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right, at our sole discretion, to modify or
                  replace these Terms at any time. If a revision is material, we
                  will provide at least 30 days notice prior to any new terms
                  taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  10. Contact Information
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about these Terms of Service, please
                  contact us at:
                </p>
                <div className="mt-4 text-muted-foreground">
                  <p>Email: legal@motionconnect.com</p>
                  <p>Address: Motion Connect, Inc.</p>
                  <p>123 Music Street, Harmony City, HC 12345</p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
