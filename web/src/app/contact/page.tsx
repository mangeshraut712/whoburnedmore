import React from "react";
import { SiteChrome } from "@/components/landing/SiteChrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Contact — whoburnedmore",
  description: "Questions, ideas, or something not working? Email the maker.",
};

export default function ContactPage() {
  return (
    <SiteChrome title="Get in touch" subtitle="Questions, ideas, or something not working? Drop an email.">
      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="outline">email</Badge>
        <Badge variant="outline">reply fast</Badge>
        <Badge variant="outline">bugs yes</Badge>
      </div>
      <Card className="max-w-xl border-border bg-card/50 shadow-none">
        <CardHeader>
          <CardTitle>contact</CardTitle>
          <CardDescription>email the maker</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <a href="mailto:hi@arhamamin.com">hi@arhamamin.com</a>
          </Button>
          <Button asChild variant="outline">
            <a href="https://x.com/whoburnedmore" target="_blank" rel="noreferrer">
              X @whoburnedmore
            </a>
          </Button>
          <Button asChild variant="ghost">
            <a href="https://github.com/arhxam/whoburnedmore" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </Button>
        </CardContent>
      </Card>
    </SiteChrome>
  );
}
