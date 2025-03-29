import { ComponentChildren } from "preact";
import { Head } from "$fresh/runtime.ts";
import AdminLayout from "./AdminLayout.tsx";

interface PlantListingLayoutProps {
  children: ComponentChildren;
  title: string;
  activeSection: "list" | "new";
}

/**
 * Layout component for plant listing and creation pages
 * Provides a consistent layout with the PlantAdminLayout while not requiring plant-specific props
 */
export default function PlantListingLayout({ 
  children, 
  title, 
  activeSection 
}: PlantListingLayoutProps) {
  const sections = [
    { id: "list", name: "Plant Listing", path: "/admin/plants" },
    { id: "new", name: "Add New Plant", path: "/admin/plants/new" },
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Plant Admin: {title}</title>
      </Head>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        
        <div class="mb-6 border-b border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Plant Admin Navigation">
            {sections.map((section) => (
              <a
                key={section.id}
                href={section.path}
                class={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeSection === section.id
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}
                `}
                aria-current={activeSection === section.id ? "page" : undefined}
              >
                {section.name}
              </a>
            ))}
          </nav>
        </div>
        
        {children}
      </div>
    </AdminLayout>
  );
}
