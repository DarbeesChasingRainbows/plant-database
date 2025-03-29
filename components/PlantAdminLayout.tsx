import { ComponentChildren } from "preact";
import { Head } from "$fresh/runtime.ts";
import AdminLayout from "./AdminLayout.tsx";

interface PlantAdminLayoutProps {
  children: ComponentChildren;
  plantId: number;
  plantName: string;
  activeTab: string;
  _currentPath?: string;
}

export default function PlantAdminLayout({ 
  children, 
  plantId, 
  plantName, 
  activeTab,
  _currentPath 
}: PlantAdminLayoutProps) {
  const tabs = [
    // Core Information
    { id: "details", name: "Details", path: `/admin/plants/${plantId}/details` },
    { id: "edit", name: "Edit Basic Info", path: `/admin/plants/${plantId}/edit` },
    
    // Plant Morphology
    { id: "parts", name: "Plant Parts", path: `/admin/plants/${plantId}/parts` },
    
    // Medicinal Properties
    { id: "western-medicine", name: "Western Medicine", path: `/admin/plants/${plantId}/western-medicine` },
    { id: "ayurvedic", name: "Ayurvedic Medicine", path: `/admin/plants/${plantId}/ayurvedic` },
    { id: "tcm", name: "TCM Properties", path: `/admin/plants/${plantId}/tcm` },
    { id: "actions", name: "Herbal Actions", path: `/admin/plants/${plantId}/actions` },
    { id: "medicinal", name: "Medicinal Properties", path: `/admin/plants/${plantId}/medicinal` },
    { id: "recipes", name: "Herbal Preparations", path: `/admin/plants/${plantId}/recipes` },
    
    // Cultivation
    { id: "growing", name: "Growing Guide", path: `/admin/plants/${plantId}/growing` },
    { id: "seeds", name: "Seeds & Germination", path: `/admin/plants/${plantId}/seeds` },
    
    // Cultural & Commercial
    { id: "culinary", name: "Culinary Uses", path: `/admin/plants/${plantId}/culinary` },
  ];

  return (
    <AdminLayout>
      <Head>
        <title>Plant Admin: {plantName}</title>
      </Head>
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col md:flex-row gap-8">
          {/* Side Navigation */}
          <div class="w-full md:w-64 flex-shrink-0">
            <div class="bg-white rounded-lg shadow overflow-hidden">
              <div class="px-4 py-3 bg-gray-50 border-b">
                <h3 class="text-lg font-medium text-gray-900 truncate" title={plantName}>
                  {plantName}
                </h3>
                <p class="text-sm text-gray-500">ID: {plantId}</p>
              </div>
              <nav class="flex flex-col">
                {/* Category headers and navigation items */}
                <div class="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Core Information
                </div>
                {tabs.slice(0, 2).map((tab) => (
                  <a
                    href={tab.path}
                    class={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {tab.name}
                  </a>
                ))}
                
                <div class="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Plant Morphology
                </div>
                {tabs.slice(2, 3).map((tab) => (
                  <a
                    href={tab.path}
                    class={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {tab.name}
                  </a>
                ))}
                
                <div class="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Medicinal Properties
                </div>
                {tabs.slice(3, 9).map((tab) => (
                  <a
                    href={tab.path}
                    class={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {tab.name}
                  </a>
                ))}
                
                <div class="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cultivation
                </div>
                {tabs.slice(9, 11).map((tab) => (
                  <a
                    href={tab.path}
                    class={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {tab.name}
                  </a>
                ))}
                
                <div class="px-4 py-2 bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cultural & Commercial
                </div>
                {tabs.slice(11).map((tab) => (
                  <a
                    href={tab.path}
                    class={`px-4 py-2 text-sm font-medium ${
                      activeTab === tab.id
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {tab.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div class="flex-1">
            <div class="bg-white rounded-lg shadow px-5 py-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
