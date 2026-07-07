import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import svgPaths from "../imports/Sample-1/svg-kipx8b2kmo";
import imgUserAvatar from "../imports/Sample-1/23490c62fac90b9e3aa238f23160531fde9805eb.png";
import imgPos11 from "../imports/Sample-1/d7366f207b5d0c355bd4dad6f32d627b2b1a0a3c.png";
import imgUserAvatar1 from "../imports/Sample-1/0d0a423f8d83ce1803a65490c27601b72702ccbd.png";
import WarehouseList from "./components/WarehouseList";
import WarehouseDetails from "./components/WarehouseDetails";
import StorageLocations from "./components/StorageLocations";
import CapacityView from "./components/CapacityView";
import TransferRequests from "./components/TransferRequests";
const NAV_GROUPS = [
  {
    label: "OPERATIONS",
    items: [
      { key: "pos", label: "POS", svgPath: svgPaths.p2ef0ac00, w: "20px", h: "20px" },
      { key: "sales", label: "Sales", svgPath: svgPaths.p396ca1c0, w: "18px", h: "20px" },
      { key: "returns", label: "Returns", svgPath: svgPaths.p8f89700, w: "18px", h: "20px" },
      { key: "payments", label: "Payments", svgPath: svgPaths.p26835240, w: "22px", h: "16px" }
    ]
  },
  {
    label: "INVENTORY",
    items: [
      { key: "products", label: "Products", svgPath: svgPaths.p643d217, w: "20px", h: "20px" },
      { key: "categories", label: "Categories", svgPath: svgPaths.p23f03200, w: "19px", h: "20px" },
      { key: "inventory", label: "Inventory", svgPath: svgPaths.p1439fe00, w: "19.55px", h: "20px" },
      { key: "warehouse", label: "Warehouse", svgPath: svgPaths.p3924c300, w: "20px", h: "18px", active: true },
      { key: "transfers", label: "Stock Transfers", svgPath: svgPaths.p278ce134, w: "20px", h: "16px" },
      { key: "goods", label: "Goods Receiving", svgPath: svgPaths.p11f89b00, w: "20px", h: "16px" }
    ]
  },
  {
    label: "MANAGEMENT",
    items: [
      { key: "employees", label: "Employees", svgPath: svgPaths.p207ea900, w: "20px", h: "20px" },
      { key: "customers", label: "Customers", svgPath: svgPaths.p39955c80, w: "22px", h: "16px" },
      { key: "suppliers", label: "Suppliers", svgPath: svgPaths.p146eb80, w: "22px", h: "16px" },
      { key: "branches", label: "Branches", svgPath: svgPaths.p2a93db80, w: "18px", h: "16px" }
    ]
  },
  {
    label: "ADMINISTRATION",
    items: [
      { key: "users", label: "User Management", svgPath: svgPaths.p23fbfe00, w: "19.85px", h: "17px" },
      { key: "audit", label: "Audit Logs", svgPath: svgPaths.p22876fc0, w: "18px", h: "18px" }
    ]
  }
];
const MODULE_TABS = [
  { key: "list", label: "Warehouse List" },
  { key: "capacity", label: "Capacity View" },
  { key: "transfers", label: "Transfer Requests" }
];
function App() {
  const [screen, setScreen] = useState("list");
  const [selectedWarehouseId, setSelectedWarehouseId] = useState("");
  const [listSearch, setListSearch] = useState("");
  const breadcrumbs = ["Workspace", "Inventory", "Warehouse"];
  if (screen === "details" || screen === "locations") breadcrumbs.push("Details");
  if (screen === "locations") breadcrumbs.push("Storage Locations");
  if (screen === "capacity") breadcrumbs.push("Capacity View");
  if (screen === "transfers") breadcrumbs.push("Transfer Requests");
  const handleSelectWarehouse = (id) => {
    setSelectedWarehouseId(id);
    setScreen("details");
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-center pl-[260px] relative size-full", style: { backgroundImage: "linear-gradient(90deg, rgb(248,250,252) 0%, rgb(248,250,252) 100%)" }, children: [
    /* @__PURE__ */ jsxs("div", { className: "content-stretch flex flex-1 flex-col h-full isolate items-start min-h-[1024px] min-w-px relative", children: [
      /* @__PURE__ */ jsx("div", { className: "bg-[#faf8ff] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-[64px] relative shrink-0 w-full z-[2] border-b border-[#c3c6d7]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-row items-center justify-between px-[24px] h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative max-w-[400px] flex-1", children: [
          /* @__PURE__ */ jsx("div", { className: "absolute left-[12px] top-1/2 -translate-y-1/2", children: /* @__PURE__ */ jsx("svg", { width: "15", height: "15", fill: "none", viewBox: "0 0 15 15", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p2dbaedc0, fill: "#737686" }) }) }),
          /* @__PURE__ */ jsx(
            "input",
            {
              placeholder: "Search orders, products, or customers...",
              className: "w-full pl-[34px] pr-[60px] py-[9px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[14px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white shadow-[inset_0px_1px_2px_1px_rgba(0,0,0,0.05)]"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center gap-[4px]", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-[#eaedff] border border-[#c3c6d7] rounded-[4px] px-[7px] py-[3px]", children: /* @__PURE__ */ jsx("svg", { width: "8.9", height: "8.9", viewBox: "0 0 8.90137 8.90137", fill: "none", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p8c4b100, fill: "#737686" }) }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-[#eaedff] border border-[#c3c6d7] rounded-[4px] px-[7px] py-[3px]", children: /* @__PURE__ */ jsx("p", { className: "font-['Liberation_Mono:Regular',monospace] text-[10px] text-[#737686] leading-[15px]", children: "K" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[24px]", children: [
          /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#c3c6d7] rounded-[8px] flex items-center gap-[8px] px-[13px] py-[7px]", children: [
            /* @__PURE__ */ jsx("div", { className: "bg-[#4ae176] rounded-full w-[8px] h-[8px]" }),
            /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#131b2e] text-[12px] tracking-[0.12px]", children: "Downtown Flagship" }),
            /* @__PURE__ */ jsx("svg", { width: "8", height: "4.93", viewBox: "0 0 8 4.93333", fill: "none", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p5cc7680, fill: "#737686" }) })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "w-px h-[24px] bg-[#c3c6d7]" }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[8px]", children: [
            /* @__PURE__ */ jsxs("div", { className: "relative w-[36px] h-[36px] flex items-center justify-center", children: [
              /* @__PURE__ */ jsx("svg", { width: "13.3", height: "16.7", viewBox: "0 0 13.3333 16.6667", fill: "none", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p2ab08e80, fill: "#434655" }) }),
              /* @__PURE__ */ jsx("div", { className: "absolute top-[8px] right-[8px] w-[8px] h-[8px] bg-[#ba1a1a] rounded-full border border-white" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "w-[36px] h-[36px] flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { width: "16.75", height: "16.7", viewBox: "0 0 16.75 16.6667", fill: "none", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p18e22d80, fill: "#434655" }) }) }),
            /* @__PURE__ */ jsx("div", { className: "bg-[#e2e7ff] rounded-full w-[32px] h-[32px] overflow-hidden border border-[#c3c6d7] ml-[8px]", children: /* @__PURE__ */ jsx("img", { src: imgUserAvatar, alt: "", className: "w-full h-full object-cover" }) })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 w-full z-[1]", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col p-[32px] h-full", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[0px] mb-[24px]", children: [
          /* @__PURE__ */ jsx("div", { className: "w-[10.7px] h-[12px]", children: /* @__PURE__ */ jsx("svg", { width: "10.7", height: "12", viewBox: "0 0 10.6667 12", fill: "none", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p3dad180, fill: "#505F76" }) }) }),
          breadcrumbs.map((b, i) => /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
            /* @__PURE__ */ jsx("svg", { width: "12.9", height: "13", viewBox: "0 0 12.9333 13", fill: "none", className: "mx-[1px]", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p27191300, fill: "#C3C6D7" }) }),
            /* @__PURE__ */ jsx("p", { className: `font-['Inter:Medium',sans-serif] font-medium text-[12px] tracking-[0.12px] leading-[16px] ${i === breadcrumbs.length - 1 ? "text-[#131b2e]" : "text-[#505f76]"}`, children: b })
          ] }, i))
        ] }),
        /* @__PURE__ */ jsx("div", { className: "flex items-center gap-[4px] mb-[28px]", children: MODULE_TABS.map((tab) => /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setScreen(tab.key),
            className: `px-[14px] py-[7px] rounded-[8px] font-['Inter:Medium',sans-serif] font-medium text-[13px] tracking-[0.13px] transition-colors ${screen === tab.key || tab.key === "list" && (screen === "details" || screen === "locations") ? "bg-[#004ac6] text-white" : "bg-white text-[#505f76] border border-[#c3c6d7] hover:bg-[#f2f3ff]"}`,
            children: tab.label
          },
          tab.key
        )) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
          screen === "list" && /* @__PURE__ */ jsx(
            WarehouseList,
            {
              onSelectWarehouse: handleSelectWarehouse,
              searchQuery: listSearch,
              onSearchChange: setListSearch
            }
          ),
          screen === "details" && selectedWarehouseId && /* @__PURE__ */ jsx(
            WarehouseDetails,
            {
              warehouseId: selectedWarehouseId,
              onBack: () => setScreen("list"),
              onViewLocations: () => setScreen("locations")
            }
          ),
          screen === "locations" && selectedWarehouseId && /* @__PURE__ */ jsx(
            StorageLocations,
            {
              warehouseId: selectedWarehouseId,
              onBack: () => setScreen("details")
            }
          ),
          screen === "capacity" && /* @__PURE__ */ jsx(CapacityView, {}),
          screen === "transfers" && /* @__PURE__ */ jsx(TransferRequests, {})
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "absolute bg-white drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] h-full left-0 top-0 w-[260px] border-r border-[#c3c6d7] z-[3]", children: [
      /* @__PURE__ */ jsxs("div", { className: "absolute left-0 right-px top-0 px-[24px] pb-[25px] pt-[24px] border-b border-[rgba(195,198,215,0.5)] flex items-center", children: [
        /* @__PURE__ */ jsx("div", { className: "relative w-[56px] h-[56px] shrink-0", children: /* @__PURE__ */ jsx("img", { src: imgPos11, alt: "", className: "absolute inset-0 w-full h-full object-cover pointer-events-none" }) }),
        /* @__PURE__ */ jsxs("div", { className: "ml-[8px] flex flex-col gap-[4px]", children: [
          /* @__PURE__ */ jsx("p", { className: "font-['Hanken_Grotesk:Bold',sans-serif] font-bold text-[#004ac6] text-[20px] leading-[28px]", children: "RetailOS Pro" }),
          /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] leading-[16px]", children: "Enterprise Hub" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "absolute left-0 right-px top-[97px] p-[16px]", children: /* @__PURE__ */ jsxs("button", { className: "w-full flex items-center justify-center gap-[4px] bg-[#2563eb] text-white py-[8px] rounded-[8px] font-['Inter:Medium',sans-serif] font-medium text-[12px] tracking-[0.12px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#1d4ed8] transition-colors shadow-[inset_0px_-1px_0px_0px_rgba(0,0,0,0.1)]", children: [
        /* @__PURE__ */ jsx("svg", { width: "10.5", height: "10.5", viewBox: "0 0 10.5 10.5", fill: "none", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p38ac19c0, fill: "white" }) }),
        "Quick Transaction"
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "absolute inset-[163px_1px_109px_0] overflow-y-auto p-[8px] flex flex-col gap-[4px]", children: NAV_GROUPS.map((group) => /* @__PURE__ */ jsxs("div", { className: "w-full", children: [
        /* @__PURE__ */ jsx("div", { className: "px-[8px] py-[8px]", children: /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#737686] text-[12px] tracking-[0.6px] uppercase leading-[16px]", children: group.label }) }),
        group.items.map((item) => {
          const isActive = item.active;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: `relative rounded-[8px] w-full cursor-pointer transition-colors ${isActive ? "bg-[#eaedff]" : "hover:bg-[#f2f3ff]"}`,
              onClick: () => {
                if (item.key === "warehouse") setScreen("list");
                if (item.key === "transfers") setScreen("transfers");
              },
              children: [
                /* @__PURE__ */ jsxs("div", { className: `flex items-center gap-[16px] p-[8px]`, children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", style: { width: item.w, height: item.h }, children: /* @__PURE__ */ jsx("svg", { width: item.w, height: item.h, viewBox: `0 0 ${parseFloat(item.w)} ${parseFloat(item.h)}`, fill: "none", children: /* @__PURE__ */ jsx("path", { d: item.svgPath, fill: isActive ? "#004ac6" : "#505F76" }) }) }),
                  /* @__PURE__ */ jsx("p", { className: `font-['Inter:Medium',sans-serif] font-medium text-[12px] tracking-[0.12px] leading-[16px] ${isActive ? "text-[#004ac6]" : "text-[#505f76]"}`, children: item.label })
                ] }),
                isActive && /* @__PURE__ */ jsx("div", { className: "absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[20px] bg-[#004ac6] rounded-r-full" })
              ]
            },
            item.key
          );
        })
      ] }, group.label)) }),
      /* @__PURE__ */ jsxs("div", { className: "absolute left-0 right-px bottom-0 border-t border-[#c3c6d7] pt-[9px] pb-[8px] px-[8px] flex flex-col gap-[4px]", children: [
        /* @__PURE__ */ jsx("div", { className: "relative rounded-[8px] w-full hover:bg-[#f2f3ff] cursor-pointer transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[16px] p-[8px]", children: [
          /* @__PURE__ */ jsx("div", { className: "w-[20.1px] h-[20px] flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { width: "20.1", height: "20", viewBox: "0 0 20.1 20", fill: "none", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p3cdadd00, fill: "#505F76" }) }) }),
          /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] leading-[16px]", children: "Settings" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "relative rounded-[8px] w-full hover:bg-[#f2f3ff] cursor-pointer transition-colors", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[16px] p-[8px]", children: [
          /* @__PURE__ */ jsx("div", { className: "w-[17px] h-[20px] flex items-center justify-center", children: /* @__PURE__ */ jsx("svg", { width: "17", height: "20", viewBox: "0 0 17 20", fill: "none", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p2d9a1e80, fill: "#505F76" }) }) }),
          /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] leading-[16px]", children: "Support" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[12px] p-[8px] rounded-[8px] hover:bg-[#f2f3ff] cursor-pointer transition-colors", children: [
          /* @__PURE__ */ jsx("div", { className: "bg-[#e2e7ff] rounded-full w-[32px] h-[32px] overflow-hidden border border-[#c3c6d7] shrink-0", children: /* @__PURE__ */ jsx("img", { src: imgUserAvatar1, alt: "", className: "w-full h-full object-cover" }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#131b2e] text-[12px] tracking-[0.12px] leading-[16px]", children: "Alex Chen" }),
            /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#505f76] text-[10px] leading-[15px]", children: "Store Manager" })
          ] }),
          /* @__PURE__ */ jsx("svg", { width: "13.5", height: "13.5", viewBox: "0 0 13.5 13.5", fill: "none", children: /* @__PURE__ */ jsx("path", { d: svgPaths.p33af4a10, fill: "#737686" }) })
        ] })
      ] })
    ] })
  ] });
}
export {
  App as default
};
