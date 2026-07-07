import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, Grid3x3, List } from "lucide-react";
import api from "../../services/api";

const STATUS_STYLES = {
  Occupied: "bg-[#e9ebff] text-[#004ac6]",
  Empty: "bg-[#e6f9ee] text-[#16a34a]",
  Reserved: "bg-[#fff7e6] text-[#d97706]",
  Maintenance: "bg-[#fee2e2] text-[#dc2626]"
};

const STATUS_DOT = {
  Occupied: "#004ac6",
  Empty: "#16a34a",
  Reserved: "#d97706",
  Maintenance: "#dc2626"
};

function StorageLocations({ warehouseId, onBack }) {
  const [warehouse, setWarehouse] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [zoneFilter, setZoneFilter] = useState("All");
  const [viewMode, setViewMode] = useState("grid");

  const zones = ["All", "Zone A", "Zone B", "Zone C", "Zone D"];
  const statusTabs = ["All", "Occupied", "Empty", "Reserved", "Maintenance"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get warehouse metadata
        const whRes = await api.get(`/warehouses/${warehouseId}`);
        if (whRes.data && whRes.data.success) {
          setWarehouse(whRes.data.data);
        }

        // Get actual locations from backend database
        const locsRes = await api.get(`/warehouses/${warehouseId}/locations`);
        if (locsRes.data && locsRes.data.success) {
          setLocations(locsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching storage locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [warehouseId]);

  const filtered = locations.filter((loc) => {
    const matchSearch =
      search === "" ||
      loc.locationCode.toLowerCase().includes(search.toLowerCase()) ||
      (loc.sku && loc.sku.toLowerCase().includes(search.toLowerCase())) ||
      (loc.product && loc.product.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "All" || loc.status === statusFilter;
    const matchZone = zoneFilter === "All" || loc.zone === zoneFilter;
    return matchSearch && matchStatus && matchZone;
  });

  const counts = { All: locations.length, Occupied: 0, Empty: 0, Reserved: 0, Maintenance: 0 };
  locations.forEach((l) => {
    if (counts[l.status] !== undefined) {
      counts[l.status]++;
    }
  });

  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "text-center py-8 font-['Inter:Regular',sans-serif] text-[14px] text-[#737686]", children: "Loading storage layout..." });
  }

  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-[20px] w-full", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("button", { onClick: onBack, className: "flex items-center gap-[6px] text-[#505f76] font-['Inter:Medium',sans-serif] font-medium text-[12px] hover:text-[#004ac6] transition-colors mb-[12px]", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { size: 14 }),
        " Back to Warehouse Details"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h1", { className: "font-['Hanken_Grotesk:Bold',sans-serif] font-bold text-[#131b2e] text-[24px] leading-[32px]", children: "Storage Locations" }),
          warehouse && /* @__PURE__ */ jsxs("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[13px] mt-[2px]", children: [
            warehouse.name,
            " · ",
            warehouse.code
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[8px]", children: [
          /* @__PURE__ */ jsx("button", { className: `p-[8px] rounded-[8px] border transition-colors ${viewMode === "grid" ? "bg-[#e9ebff] border-[#c3c6d7] text-[#004ac6]" : "bg-white border-[#c3c6d7] text-[#737686]"}`, onClick: () => setViewMode("grid"), children: /* @__PURE__ */ jsx(Grid3x3, { size: 16 }) }),
          /* @__PURE__ */ jsx("button", { className: `p-[8px] rounded-[8px] border transition-colors ${viewMode === "list" ? "bg-[#e9ebff] border-[#c3c6d7] text-[#004ac6]" : "bg-white border-[#c3c6d7] text-[#737686]"}`, onClick: () => setViewMode("list"), children: /* @__PURE__ */ jsx(List, { size: 16 }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#c3c6d7] rounded-[12px] p-[14px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[12px] flex-wrap", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
          /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-[10px] top-1/2 -translate-y-1/2 text-[#737686]" }),
          /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by location ID, SKU, or product...", className: "w-full pl-[32px] pr-[12px] py-[7px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[6px]", children: [
          /* @__PURE__ */ jsx(Filter, { size: 13, className: "text-[#737686]" }),
          /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#737686] text-[12px]", children: "Zone:" }),
          zones.map((z) => /* @__PURE__ */ jsx("button", { onClick: () => setZoneFilter(z), className: `px-[10px] py-[4px] rounded-[6px] text-[12px] font-['Inter:Medium',sans-serif] font-medium transition-colors ${zoneFilter === z ? "bg-[#004ac6] text-white" : "bg-[#f2f3ff] text-[#505f76] hover:bg-[#e9ebff]"}`, children: z }, z))
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-[4px] mt-[12px] border-t border-[#c3c6d7] pt-[12px]", children: statusTabs.map((s) => /* @__PURE__ */ jsxs("button", { onClick: () => setStatusFilter(s), className: `flex items-center gap-[6px] px-[12px] py-[5px] rounded-[8px] text-[12px] font-['Inter:Medium',sans-serif] font-medium transition-colors ${statusFilter === s ? "bg-[#004ac6] text-white" : "bg-[#f2f3ff] text-[#505f76] hover:bg-[#e9ebff]"}`, children: [
        s !== "All" && /* @__PURE__ */ jsx("div", { className: "w-[6px] h-[6px] rounded-full shrink-0", style: { backgroundColor: statusFilter === s ? "white" : STATUS_DOT[s] } }),
        s,
        " ",
        /* @__PURE__ */ jsxs("span", { className: "opacity-70", children: [
          "(",
          counts[s],
          ")"
        ] })
      ] }, s)) })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[12px]", children: [
      "Showing ",
      /* @__PURE__ */ jsx("span", { className: "text-[#131b2e] font-medium", children: filtered.length }),
      " locations"
    ] }),
    viewMode === "grid" ? /* @__PURE__ */ jsx("div", { className: "grid grid-cols-6 gap-[8px]", children: filtered.slice(0, 120).map((loc) => /* @__PURE__ */ jsxs("div", { className: `rounded-[8px] border p-[10px] cursor-pointer hover:shadow-md transition-all ${loc.status === "Occupied" ? "bg-[#f2f3ff] border-[#c3c6d7]" : loc.status === "Empty" ? "bg-[#f0fdf4] border-[#bbf7d0]" : loc.status === "Reserved" ? "bg-[#fffbeb] border-[#fde68a]" : "bg-[#fff1f2] border-[#fecdd3]"}`, children: [
      /* @__PURE__ */ jsx("p", { className: "font-['Liberation_Mono:Regular',monospace] text-[10px] text-[#131b2e] font-medium", children: loc.locationCode }),
      /* @__PURE__ */ jsxs("div", { className: "mt-[4px] flex items-center gap-[3px]", children: [
        /* @__PURE__ */ jsx("div", { className: "w-[5px] h-[5px] rounded-full shrink-0", style: { backgroundColor: STATUS_DOT[loc.status] } }),
        /* @__PURE__ */ jsx("p", { className: "text-[10px] font-['Inter:Regular',sans-serif]", style: { color: STATUS_DOT[loc.status] }, children: loc.status })
      ] }),
      loc.sku && /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[9px] mt-[2px] truncate", children: loc.sku }),
      loc.qty && /* @__PURE__ */ jsxs("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[10px]", children: [
        loc.qty,
        " units"
      ] })
    ] }, loc._id)) }) : /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#c3c6d7] rounded-[12px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] overflow-hidden", children: [
      /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-[#f8f9ff] border-b border-[#c3c6d7]", children: ["Location ID", "Zone", "Row", "Level", "SKU", "Product", "Qty", "Status"].map((h) => /* @__PURE__ */ jsx("th", { className: "px-[14px] py-[10px] text-left font-['Inter:Medium',sans-serif] font-medium text-[#737686] text-[11px] tracking-[0.5px] uppercase", children: h }, h)) }) }),
        /* @__PURE__ */ jsx("tbody", { children: filtered.slice(0, 50).map((loc, i) => /* @__PURE__ */ jsxs("tr", { className: `border-b border-[#c3c6d7] hover:bg-[#f8f9ff] transition-colors ${i === Math.min(filtered.length - 1, 49) ? "border-b-0" : ""}`, children: [
          /* @__PURE__ */ jsx("td", { className: "px-[14px] py-[11px] font-['Liberation_Mono:Regular',monospace] text-[12px] text-[#131b2e]", children: loc.locationCode }),
          /* @__PURE__ */ jsx("td", { className: "px-[14px] py-[11px] font-['Inter:Regular',sans-serif] text-[12px] text-[#505f76]", children: loc.zone }),
          /* @__PURE__ */ jsx("td", { className: "px-[14px] py-[11px] font-['Inter:Regular',sans-serif] text-[12px] text-[#505f76]", children: loc.row }),
          /* @__PURE__ */ jsx("td", { className: "px-[14px] py-[11px] font-['Inter:Regular',sans-serif] text-[12px] text-[#505f76]", children: loc.level }),
          /* @__PURE__ */ jsx("td", { className: "px-[14px] py-[11px] font-['Liberation_Mono:Regular',monospace] text-[11px] text-[#737686]", children: loc.sku ?? "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-[14px] py-[11px] font-['Inter:Regular',sans-serif] text-[12px] text-[#505f76] max-w-[160px] truncate", children: loc.product ?? "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-[14px] py-[11px] font-['Inter:Regular',sans-serif] text-[12px] text-[#505f76]", children: loc.qty ?? "—" }),
          /* @__PURE__ */ jsx("td", { className: "px-[14px] py-[11px]", children: /* @__PURE__ */ jsx("span", { className: `px-[7px] py-[2px] rounded-[4px] text-[11px] font-['Inter:Medium',sans-serif] font-medium ${STATUS_STYLES[loc.status]}`, children: loc.status }) })
        ] }, loc._id)) })
      ] }),
      filtered.length > 50 && /* @__PURE__ */ jsx("div", { className: "px-[14px] py-[12px] border-t border-[#c3c6d7] bg-[#f8f9ff]", children: /* @__PURE__ */ jsxs("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[12px]", children: [
        "Showing 50 of ",
        filtered.length,
        " locations"
      ] }) })
    ] })
  ] });
}

export {
  StorageLocations as default
};
