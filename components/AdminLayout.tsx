import { ComponentChildren } from "preact";

interface AdminLayoutProps {
  children: ComponentChildren;
  currentPath?: string;
  title?: string;
  active?: string;
}

export function AdminLayout(
  { children, currentPath = "", title, active }: AdminLayoutProps,
) {
  const navItems = [
    { path: "/admin", label: "Dashboard", key: "dashboard" },
    { path: "/admin/plants", label: "Plants", key: "plants" },
    { path: "/admin/parts", label: "Plant Parts", key: "parts" },
    { path: "/admin/medicinal", label: "Medicinal Properties", key: "medicinal" },
    { path: "/admin/actions", label: "Herbal Actions", key: "actions" },
    { path: "/admin/growing", label: "Growing Records", key: "growing" },
    { path: "/admin/garden/plots", label: "Garden Plots", key: "garden" },
    { path: "/admin/garden/beds", label: "Garden Beds", key: "garden" },
    { path: "/admin/garden/crop-rotations", label: "Crop Rotations", key: "garden" },
  ];

  return (
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-green-800 text-white p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <h1 class="text-xl font-bold">Herbal Database Admin</h1>
          {/* Add authentication status/controls here */}
        </div>
      </nav>

      <div class="flex">
        {/* Sidebar Navigation */}
        <div class="w-64 bg-white h-screen shadow-lg">
          <nav class="p-4">
            {navItems.map((item) => (
              <a
                href={item.path}
                class={`block py-2 px-4 rounded mb-1 ${
                  currentPath === item.path || active === item.key
                    ? "bg-green-100 text-green-800"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div class="flex-1 p-8">
          {title && <h1 class="text-2xl font-bold mb-6">{title}</h1>}
          {children}
        </div>
      </div>
    </div>
  );
}

// Also export as default for backward compatibility
export default AdminLayout;
