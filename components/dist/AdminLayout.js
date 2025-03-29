"use strict";
exports.__esModule = true;
exports.AdminLayout = void 0;
function AdminLayout(_a) {
    var children = _a.children, _b = _a.currentPath, currentPath = _b === void 0 ? "" : _b, title = _a.title, active = _a.active;
    var navItems = [
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
    return (React.createElement("div", { "class": "min-h-screen bg-gray-100" },
        React.createElement("nav", { "class": "bg-green-800 text-white p-4" },
            React.createElement("div", { "class": "max-w-7xl mx-auto flex justify-between items-center" },
                React.createElement("h1", { "class": "text-xl font-bold" }, "Herbal Database Admin"))),
        React.createElement("div", { "class": "flex" },
            React.createElement("div", { "class": "w-64 bg-white h-screen shadow-lg" },
                React.createElement("nav", { "class": "p-4" }, navItems.map(function (item) { return (React.createElement("a", { href: item.path, "class": "block py-2 px-4 rounded mb-1 " + (currentPath === item.path || active === item.key
                        ? "bg-green-100 text-green-800"
                        : "hover:bg-gray-100") }, item.label)); }))),
            React.createElement("div", { "class": "flex-1 p-8" },
                title && React.createElement("h1", { "class": "text-2xl font-bold mb-6" }, title),
                children))));
}
exports.AdminLayout = AdminLayout;
// Also export as default for backward compatibility
exports["default"] = AdminLayout;
