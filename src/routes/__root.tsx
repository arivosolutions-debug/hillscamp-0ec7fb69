import { useEffect, type ReactNode } from "react";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WhatsAppWidget } from "@/components/property/WhatsAppWidget";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import NotFound from "@/pages/NotFound";
import appCss from "../styles.css?url";

const SITE_TITLE = "Hills Camp — Luxury Staycations & Curated Hill Retreats";
const SITE_DESCRIPTION =
  "Curated luxury staycations across hills and backwaters — Wayanad, Munnar, Vagamon, Alleppey. Boutique retreats where nature meets comfort.";
const SOCIAL_TITLE = "Staycations and curated packages in Kerala";
const SOCIAL_IMAGE =
  "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/6bcc521e-e7c4-477f-88c3-ce02e1617a5a/id-preview-01133044--af06c9bd-c27a-4184-98a7-48f3255a6e13.lovable.app-1779389408626.png";

const ORGANIZATION_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hills Camp",
  url: "https://hillscamp.com",
  description: "Curated luxury staycations across Kerala's hills and backwaters.",
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0, viewport-fit=cover" },
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { name: "author", content: "Hills Camp" },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://hillscamp.com/" },
      { property: "og:site_name", content: "Hills Camp" },
      { property: "og:title", content: SOCIAL_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:image", content: SOCIAL_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: SOCIAL_TITLE },
      { name: "twitter:description", content: SITE_DESCRIPTION },
      { name: "twitter:image", content: SOCIAL_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Manrope:wght@300;400;500;600;700&family=Sacramento&display=swap",
      },
    ],
    scripts: [{ type: "application/ld+json", children: ORGANIZATION_JSON_LD }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Outlet />
          <WhatsAppWidget />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen bg-hc-bg flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="font-headline text-3xl text-hc-primary mb-4">This page didn't load</h1>
        <p className="font-body text-hc-text mb-8">
          Something went wrong on our side. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-hc-primary text-primary-foreground px-6 py-3 rounded-full font-bold text-sm"
          >
            Try again
          </button>
          <Link
            to="/"
            className="bg-surface-low text-hc-primary px-6 py-3 rounded-full font-bold text-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
