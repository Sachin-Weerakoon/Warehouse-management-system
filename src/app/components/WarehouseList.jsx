import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus, Search, MapPin, Package, TrendingUp, ArrowRight, X } from "lucide-react";
import api from "../../services/api";

const STATUS_STYLES = {
  Active: "bg-[#e6f9ee] text-[#16a34a]",
  Maintenance: "bg-[#fff7e6] text-[#d97706]",
  Inactive: "bg-[#fee2e2] text-[#dc2626]"
};

function WarehouseList({ onSelectWarehouse, searchQuery, onSearchChange }) {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    code: "",
    address: "",
    city: "",
    manager: "",
    totalCapacity: ""
  });

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const res = await api.get("/warehouses");
      if (res.data && res.data.success) {
        setWarehouses(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleAddWarehouse = async () => {
    try {
      const res = await api.post("/warehouses", form);
      if (res.data && res.data.success) {
        setShowAddModal(false);
        setForm({
          name: "",
          code: "",
          address: "",
          city: "",
          manager: "",
          totalCapacity: ""
        });
        fetchWarehouses();
      }
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add warehouse");
    }
  };

  const totalCapacity = warehouses.reduce((s, w) => s + w.totalCapacity, 0);
  const totalUsed = warehouses.reduce((s, w) => s + w.usedCapacity, 0);
  const totalLocations = warehouses.reduce((s, w) => s + w.totalLocations, 0);
  const pendingTransfers = 12;

  const filtered = warehouses.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-[24px] w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[12px] text-[#737686] tracking-[0.12px] leading-[16px]", children: "Inventory / Warehouse" }),
        /* @__PURE__ */ jsx("h1", { className: "font-['Hanken_Grotesk:Bold',sans-serif] font-bold text-[#131b2e] text-[24px] leading-[32px] mt-[4px]", children: "Warehouse Management" })
      ] }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => setShowAddModal(true),
          className: "flex items-center gap-[8px] bg-[#2563eb] text-white px-[16px] py-[9px] rounded-[8px] font-['Inter:Medium',sans-serif] font-medium text-[13px] tracking-[0.13px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#1d4ed8] transition-colors",
          children: [
            /* @__PURE__ */ jsx(Plus, { size: 14, strokeWidth: 2.5 }),
            "Add Warehouse"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-[16px]", children: [
      { label: "Total Warehouses", value: warehouses.length.toString(), sub: `${warehouses.filter((w) => w.status === "Active").length} Active`, color: "#e9ebff", icon: /* @__PURE__ */ jsx(Package, { size: 20, color: "#004ac6" }) },
      { label: "Total Capacity", value: `${(totalCapacity / 1e3).toFixed(1)}K`, sub: "Pallet positions", color: "#e9ebff", icon: /* @__PURE__ */ jsx(Package, { size: 20, color: "#004ac6" }) },
      { label: "Capacity Used", value: totalCapacity > 0 ? `${Math.round(totalUsed / totalCapacity * 100)}%` : "0%", sub: `${totalUsed.toLocaleString()} / ${totalCapacity.toLocaleString()} units`, color: "#fff7e6", icon: /* @__PURE__ */ jsx(TrendingUp, { size: 20, color: "#d97706" }) },
      { label: "Storage Locations", value: totalLocations.toLocaleString(), sub: `${pendingTransfers} pending transfers`, color: "#e6f9ee", icon: /* @__PURE__ */ jsx(MapPin, { size: 20, color: "#16a34a" }) }
    ].map((card, i) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#c3c6d7] rounded-[12px] p-[20px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-[12px]", children: [
        /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#737686] text-[12px] tracking-[0.12px]", children: card.label }),
        /* @__PURE__ */ jsx("div", { className: "p-[8px] rounded-[8px]", style: { backgroundColor: card.color }, children: card.icon })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-['Hanken_Grotesk:Bold',sans-serif] font-bold text-[#131b2e] text-[28px] leading-[34px]", children: card.value }),
      /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[12px] mt-[4px]", children: card.sub })
    ] }, i)) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#c3c6d7] rounded-[12px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-[20px] py-[16px] border-b border-[#c3c6d7]", children: [
        /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#131b2e] text-[14px]", children: "All Warehouses" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-[10px] top-1/2 -translate-y-1/2 text-[#737686]" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              value: searchQuery,
              onChange: (e) => onSearchChange(e.target.value),
              placeholder: "Search warehouses...",
              className: "pl-[32px] pr-[12px] py-[7px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] w-[220px] bg-white"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
        /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-[#f8f9ff]", children: ["Warehouse", "Location", "Capacity", "Utilization", "Locations", "Manager", "Status", ""].map((h) => /* @__PURE__ */ jsx("th", { className: "px-[16px] py-[10px] text-left font-['Inter:Medium',sans-serif] font-medium text-[#737686] text-[11px] tracking-[0.5px] uppercase border-b border-[#c3c6d7]", children: h }, h)) }) }),
        /* @__PURE__ */ jsx("tbody", { children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "text-center py-4 font-['Inter:Regular',sans-serif] text-[13px] text-[#737686]", children: "Loading warehouses..." }) }) : filtered.map((w, idx) => {
          const pct = w.totalCapacity > 0 ? Math.round(w.usedCapacity / w.totalCapacity * 100) : 0;
          const barColor = pct >= 90 ? "#dc2626" : pct >= 70 ? "#d97706" : "#16a34a";
          return /* @__PURE__ */ jsxs(
            "tr",
            {
              className: `border-b border-[#c3c6d7] hover:bg-[#f8f9ff] transition-colors cursor-pointer ${idx === filtered.length - 1 ? "border-b-0" : ""}`,
              onClick: () => onSelectWarehouse(w._id),
              children: [
                /* @__PURE__ */ jsxs("td", { className: "px-[16px] py-[14px]", children: [
                  /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#131b2e] text-[13px]", children: w.name }),
                  /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[11px] mt-[1px]", children: w.code })
                ] }),
                /* @__PURE__ */ jsxs("td", { className: "px-[16px] py-[14px]", children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[4px]", children: [
                    /* @__PURE__ */ jsx(MapPin, { size: 12, className: "text-[#737686] shrink-0" }),
                    /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#505f76] text-[12px]", children: w.city })
                  ] }),
                  /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[11px] mt-[1px]", children: w.address })
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px]", children: /* @__PURE__ */ jsxs("p", { className: "font-['Inter:Regular',sans-serif] text-[#505f76] text-[12px]", children: [
                  w.totalCapacity.toLocaleString(),
                  " units"
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px] w-[140px]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[8px]", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex-1 h-[6px] bg-[#eaedff] rounded-full overflow-hidden", children: /* @__PURE__ */ jsx("div", { className: "h-full rounded-full transition-all", style: { width: `${pct}%`, backgroundColor: barColor } }) }),
                  /* @__PURE__ */ jsxs("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[12px] shrink-0", style: { color: barColor }, children: [
                    pct,
                    "%"
                  ] })
                ] }) }),
                /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px]", children: /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#505f76] text-[12px]", children: w.totalLocations }) }),
                /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px]", children: /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#505f76] text-[12px]", children: w.manager }) }),
                /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px]", children: /* @__PURE__ */ jsx("span", { className: `px-[8px] py-[3px] rounded-[4px] text-[11px] font-['Inter:Medium',sans-serif] font-medium ${STATUS_STYLES[w.status]}`, children: w.status }) }),
                /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px]", children: /* @__PURE__ */ jsxs("button", { className: "flex items-center gap-[4px] text-[#004ac6] font-['Inter:Medium',sans-serif] font-medium text-[12px] hover:text-[#2563eb] transition-colors", onClick: (e) => {
                  e.stopPropagation();
                  onSelectWarehouse(w._id);
                }, children: [
                  "View ",
                  /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
                ] }) })
              ]
            },
            w._id
          );
        }) })
      ] }) })
    ] }),
    showAddModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-[24px]", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[16px] shadow-xl w-full max-w-[520px] border border-[#c3c6d7]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-[24px] py-[18px] border-b border-[#c3c6d7]", children: [
        /* @__PURE__ */ jsx("p", { className: "font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold text-[#131b2e] text-[18px]", children: "Add New Warehouse" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowAddModal(false), className: "p-[6px] rounded-[8px] hover:bg-[#f2f3ff] transition-colors text-[#737686]", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-[24px] flex flex-col gap-[16px]", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-[12px]", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block", children: "Warehouse Name" }),
            /* @__PURE__ */ jsx("input", { value: form.name, onChange: (e) => setForm((f) => ({ ...f, name: e.target.value })), placeholder: "e.g. West Coast Facility", className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block", children: "Code" }),
            /* @__PURE__ */ jsx("input", { value: form.code, onChange: (e) => setForm((f) => ({ ...f, code: e.target.value })), placeholder: "e.g. WCF-006", className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-[12px]", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block", children: "Street Address" }),
            /* @__PURE__ */ jsx("input", { value: form.address, onChange: (e) => setForm((f) => ({ ...f, address: e.target.value })), placeholder: "e.g. 50 Ocean Boulevard", className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block", children: "City, State" }),
            /* @__PURE__ */ jsx("input", { value: form.city, onChange: (e) => setForm((f) => ({ ...f, city: e.target.value })), placeholder: "e.g. Geelong, VIC", className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-[12px]", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block", children: "Manager Name" }),
            /* @__PURE__ */ jsx("input", { value: form.manager, onChange: (e) => setForm((f) => ({ ...f, manager: e.target.value })), placeholder: "e.g. John Doe", className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block", children: "Capacity (Units)" }),
            /* @__PURE__ */ jsx("input", { type: "number", value: form.totalCapacity, onChange: (e) => setForm((f) => ({ ...f, totalCapacity: e.target.value })), placeholder: "5000", className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-[8px] px-[24px] py-[16px] border-t border-[#c3c6d7]", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setShowAddModal(false), className: "px-[16px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[13px] hover:bg-[#f2f3ff] transition-colors", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { onClick: handleAddWarehouse, className: "px-[16px] py-[8px] rounded-[8px] bg-[#2563eb] text-white font-['Inter:Medium',sans-serif] font-medium text-[13px] hover:bg-[#1d4ed8] transition-colors drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]", children: "Save Warehouse" })
      ] })
    ] }) })
  ] });
}

export {
  WarehouseList as default
};
