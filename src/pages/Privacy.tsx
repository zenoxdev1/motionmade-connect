import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Music, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Privacy = () => {
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
              Privacy
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {" "}
                Policy
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
                  1. Information We Collect
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We collect information you provide directly to us, such as
                  when you create an account, upload content, or contact us for
                  support. This may include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Name, email address, and profile information</li>
                  <li>Musical content, including audio files and metadata</li>
                  <li>Messages and communications with other users</li>
                  <li>Usage data and analytics information</li>
                  <li>Device information and technical data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  2. How We Use Your Information
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>
                    Connect you with other musicians and facilitate
                    collaborations
                  </li>
                  <li>Send you technical notices and support messages</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Protect against fraud and abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  3. Information Sharing
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>
                    <strong>With other users:</strong> Profile information and
                    public content as part of the social features
                  </li>
                  <li>
                    <strong>With service providers:</strong> Third parties who
                    perform services on our behalf
                  </li>
                  <li>
                    <strong>For legal reasons:</strong> When required by law or
                    to protect our rights
                  </li>
                  <li>
                    <strong>Business transfers:</strong> In connection with a
                    merger, acquisition, or sale of assets
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  4. Data Security
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational measures
                  to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. However, no
                  method of transmission over the internet or electronic storage
                  is 100% secure, so we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  5. Your Rights and Choices
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>
                    <strong>Access:</strong> Request access to your personal
                    information
                  </li>
                  <li>
                    <strong>Correction:</strong> Request correction of
                    inaccurate information
                  </li>
                  <li>
                    <strong>Deletion:</strong> Request deletion of your
                    information
                  </li>
                  <li>
                    <strong>Portability:</strong> Request transfer of your data
                  </li>
                  <li>
                    <strong>Opt-out:</strong> Unsubscribe from marketing
                    communications
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  6. Cookies and Tracking
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies and similar tracking technologies to collect
                  and track information about your use of our service. Cookies
                  are small data files stored on your device. You can control
                  cookies through your browser settings, but disabling cookies
                  may affect functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  7. Third-Party Services
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our service may contain links to third-party websites or
                  services. We are not responsible for the privacy practices of
                  these third parties. We encourage you to read their privacy
                  policies before providing any information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  8. Children's Privacy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our service is not intended for children under 13 years of
                  age. We do not knowingly collect personal information from
                  children under 13. If we become aware that we have collected
                  such information, we will take steps to delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  9. International Data Transfers
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in
                  countries other than your own. We ensure appropriate
                  safeguards are in place to protect your information in
                  accordance with this privacy policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  10. Changes to This Policy
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this privacy policy from time to time. We will
                  notify you of any material changes by posting the new policy
                  on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                  11. Contact Us
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <div className="mt-4 text-muted-foreground">
                  <p>Email: privacy@motionconnect.com</p>
                  <p>Address: Motion Connect, Inc.</p>
                  <p>123 Music Street, Harmony City, HC 12345</p>
                  <p>Phone: +1 (555) 123-MUSIC</p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
