import { GetServerSideProps } from "next";
import { ENV_CONFIG } from "@/lib/config/environment";
import { useRouter } from "next/router";
import { MemberPublic } from "@/lib/firebase-helpers/interfaces";
import { mockGetMembers } from "@/lib/firebase-helpers/stubApi";
import Nav from "@/components/Nav";
import Metatags from "@/components/Metatags";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Briefcase,
  Users,
  Calendar,
  ExternalLink,
  Code,
} from "lucide-react";

interface DevMockUserProfileProps {
  member: MemberPublic | null;
  notFound?: boolean;
}

export default function DevMockUserProfile({
  member,
  notFound,
}: DevMockUserProfileProps) {
  const router = useRouter();

  if (notFound || !member) {
    return (
      <>
        <Metatags
          title="[DEV] Mock User Not Found - Hawaiians in Technology"
          description="The requested mock user profile could not be found."
        />
        <Nav />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <Code className="text-blue-600" size={24} />
              <span className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                DEVELOPMENT MODE
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-stone-900">
              Mock User Not Found
            </h1>
            <p className="mb-8 text-stone-600">
              The mock user profile you&apos;re looking for doesn&apos;t exist.
            </p>
            <button
              onClick={() => router.push("/")}
              className="rounded-lg bg-brown-600 px-6 py-3 text-white transition-colors hover:bg-brown-700"
            >
              Back to Directory
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Metatags
        title={`[DEV] ${member.name} - Mock Profile - Hawaiians in Technology`}
        description={`Mock profile for ${member.name}. Development testing only.`}
      />
      <Nav />
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Development Banner */}
        <div className="mb-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center gap-3">
            <Code className="text-blue-600" size={20} />
            <div>
              <h2 className="font-semibold uppercase tracking-wide text-blue-800">
                Development Mode - Mock User Profile
              </h2>
              <p className="text-sm text-blue-700">
                This is a test profile with generated data. Not available in
                production.
              </p>
            </div>
          </div>
        </div>
        {/* Header Section */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-brown-600 to-brown-700 p-8 text-white">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-3xl font-bold">
              {member.name?.charAt(0) || "?"}
            </div>
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold md:text-4xl">
                {member.name}
              </h1>
              {member.title && (
                <p className="mb-2 text-xl text-brown-100">{member.title}</p>
              )}
              {member.location && (
                <div className="flex items-center gap-2 text-brown-100">
                  <MapPin size={16} />
                  <span>{member.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Focus Areas */}
          {member.focus && member.focus.length > 0 && (
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                  <Briefcase size={20} />
                  Focus Area{member.focus.length > 1 ? "s" : ""}
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="flex flex-wrap gap-2">
                  {member.focus.map((focus, index) => (
                    <span
                      key={
                        typeof focus === "string" ? focus : focus.id || index
                      }
                      className="inline-flex items-center rounded-full bg-brown-100 px-3 py-1 text-sm font-medium text-brown-800"
                    >
                      {typeof focus === "string" ? focus : focus.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Industry */}
          {member.industry && member.industry.length > 0 && (
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                  <Users size={20} />
                  Industr{member.industry.length > 1 ? "ies" : "y"}
                </h3>
              </div>
              <div className="p-6 pt-0">
                <div className="flex flex-wrap gap-2">
                  {member.industry.map((industry, index) => (
                    <span
                      key={
                        typeof industry === "string"
                          ? industry
                          : industry.id || index
                      }
                      className="inline-flex items-center rounded-full bg-tan-200 px-3 py-1 text-sm font-medium text-stone-800"
                    >
                      {typeof industry === "string" ? industry : industry.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Experience */}
          {member.yearsExperience && (
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                  <Calendar size={20} />
                  Experience
                </h3>
              </div>
              <div className="p-6 pt-0">
                <Badge variant="outline" className="px-4 py-2 text-lg">
                  {member.yearsExperience}
                </Badge>
              </div>
            </div>
          )}

          {/* Company Size */}
          {member.companySize && (
            <div className="rounded-lg border bg-white shadow-sm">
              <div className="flex flex-col space-y-1.5 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold leading-none tracking-tight">
                  <Users size={20} />
                  Company Size
                </h3>
              </div>
              <div className="p-6 pt-0">
                <Badge variant="outline" className="px-4 py-2 text-lg">
                  {member.companySize}
                </Badge>
              </div>
            </div>
          )}
        </div>

        {/* Region Info */}
        {member.regions && member.regions.length > 0 && (
          <div className="mb-8 rounded-lg border bg-white shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                Region{member.regions.length > 1 ? "s" : ""}
              </h3>
            </div>
            <div className="p-6 pt-0">
              <div className="flex flex-wrap gap-2">
                {member.regions.map((region) => (
                  <Badge
                    key={region.id}
                    variant="secondary"
                    className="px-3 py-1 text-base"
                  >
                    {region.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-lg font-semibold leading-none tracking-tight">
              Contact Information
            </h3>
          </div>
          <div className="p-6 pt-0">
            <div className="space-y-4">
              {member.emailAbbr && (
                <div>
                  <h4 className="mb-1 font-medium text-stone-700">Email</h4>
                  <p className="text-stone-600">
                    {member.emailAbbr} (Contact through Hawaiians in Tech)
                  </p>
                </div>
              )}
              <div className="rounded-lg bg-tan-100 p-4">
                <p className="text-sm text-stone-700">
                  <strong>⚠️ Development Only:</strong> This mock profile page
                  is only available in development mode for testing purposes.
                  Member information and details are generated for demonstration
                  only.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Directory */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 rounded-lg bg-brown-600 px-6 py-3 text-white transition-colors hover:bg-brown-700"
          >
            <ExternalLink size={16} />
            Back to Directory
          </button>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // Only allow access to user profiles in development mode
  if (!ENV_CONFIG.isDevelopment) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { id } = context.params!;

  // Get mock members to find the requested user
  const mockMembers = mockGetMembers(100); // Generate enough to cover the requested ID
  const member = mockMembers.find((m) => m.id === id);

  if (!member) {
    return {
      props: {
        member: null,
        notFound: true,
      },
    };
  }

  return {
    props: {
      member,
    },
  };
};
