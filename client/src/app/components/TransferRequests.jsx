import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus, Search, ArrowRight, Clock, CheckCircle, XCircle, Package, X } from "lucide-react";
import api from "../../services/api";

const STATUS_STYLES = {
  Pending: { badge: "bg-[#fff7e6] text-[#d97706]", icon: /* @__PURE__ */ jsx(Clock, { size: 13, color: "#d97706" }) },
  "In Transit": { badge: "bg-[#e9ebff] text-[#004ac6]", icon: /* @__PURE__ */ jsx(ArrowRight, { size: 13, color: "#004ac6" }) },
  Completed: { badge: "bg-[#e6f9ee] text-[#16a34a]", icon: /* @__PURE__ */ jsx(CheckCircle, { size: 13, color: "#16a34a" }) },
  Cancelled: { badge: "bg-[#fee2e2] text-[#dc2626]", icon: /* @__PURE__ */ jsx(XCircle, { size: 13, color: "#dc2626" }) }
};

const PRIORITY_STYLES = {
  High: "text-[#dc2626] bg-[#fee2e2]",
  Normal: "text-[#505f76] bg-[#f2f3ff]",
  Low: "text-[#737686] bg-[#f8f9ff]"
};

function TransferRequests() {
  const [transfers, setTransfers] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    from: "",
    to: "",
    sku: "",
    product: "",
    qty: "",
    priority: "Normal",
    notes: ""
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const transfersRes = await api.get("/transfers");
      if (transfersRes.data && transfersRes.data.success) {
        setTransfers(transfersRes.data.data);
      }
      
      const warehousesRes = await api.get("/warehouses");
      if (warehousesRes.data && warehousesRes.data.success) {
        setWarehouses(warehousesRes.data.data);
      }
    } catch (error) {
      console.error("Error fetching transfers data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitRequest = async () => {
    try {
      const res = await api.post("/transfers", form);
      if (res.data && res.data.success) {
        setShowModal(false);
        setForm({
          from: "",
          to: "",
          sku: "",
          product: "",
          qty: "",
          priority: "Normal",
          notes: ""
        });
        fetchData();
      }
    } catch (error) {
      alert("Failed to submit request");
    }
  };

  const counts = { All: transfers.length, Pending: 0, "In Transit": 0, Completed: 0, Cancelled: 0 };
  transfers.forEach((t) => {
    if (counts[t.status] !== undefined) {
      counts[t.status]++;
    }
  });

  const filtered = transfers.filter((t) => {
    const matchSearch =
      search === "" ||
      t.transferNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.product.toLowerCase().includes(search.toLowerCase()) ||
      t.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-[24px] w-full", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-['Hanken_Grotesk:Bold',sans-serif] font-bold text-[#131b2e] text-[24px] leading-[32px]", children: "Transfer Requests" }),
        /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[13px] mt-[2px]", children: "Manage inter-warehouse inventory transfers" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: () => setShowModal(true), className: "flex items-center gap-[8px] bg-[#2563eb] text-white px-[16px] py-[9px] rounded-[8px] font-['Inter:Medium',sans-serif] font-medium text-[13px] tracking-[0.13px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] hover:bg-[#1d4ed8] transition-colors", children: [
        /* @__PURE__ */ jsx(Plus, { size: 14, strokeWidth: 2.5 }),
        "New Transfer Request"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-4 gap-[16px]", children: ["Pending", "In Transit", "Completed", "Cancelled"].map((s) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-[#c3c6d7] rounded-[12px] p-[18px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-[8px]", children: [
        /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#737686] text-[12px]", children: s }),
        STATUS_STYLES[s].icon
      ] }),
      /* @__PURE__ */ jsx("p", { className: "font-['Hanken_Grotesk:Bold',sans-serif] font-bold text-[#131b2e] text-[28px] leading-[34px]", children: counts[s] }),
      /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[11px] mt-[4px]", children: "requests" })
    ] }, s)) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white border border-[#c3c6d7] rounded-[12px] p-[14px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[12px] flex-wrap", children: [
      /* @__PURE__ */ jsxs("div", { className: "relative flex-1 min-w-[220px]", children: [
        /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-[10px] top-1/2 -translate-y-1/2 text-[#737686]" }),
        /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Search by ID, product, or SKU...", className: "w-full pl-[32px] pr-[12px] py-[7px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-[6px]", children: ["All", "Pending", "In Transit", "Completed", "Cancelled"].map((s) => /* @__PURE__ */ jsxs("button", { onClick: () => setStatusFilter(s), className: `px-[12px] py-[5px] rounded-[8px] text-[12px] font-['Inter:Medium',sans-serif] font-medium transition-colors ${statusFilter === s ? "bg-[#004ac6] text-white" : "bg-[#f2f3ff] text-[#505f76] hover:bg-[#e9ebff]"}`, children: [
        s,
        " (",
        counts[s],
        ")"
      ] }, s)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "bg-white border border-[#c3c6d7] rounded-[12px] drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] overflow-hidden", children: /* @__PURE__ */ jsxs("table", { className: "w-full", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { className: "bg-[#f8f9ff] border-b border-[#c3c6d7]", children: ["Request ID", "From → To", "Product", "Qty", "Priority", "Requested By", "Date", "Status"].map((h) => /* @__PURE__ */ jsx("th", { className: "px-[16px] py-[10px] text-left font-['Inter:Medium',sans-serif] font-medium text-[#737686] text-[11px] tracking-[0.5px] uppercase", children: h }, h)) }) }),
      /* @__PURE__ */ jsx("tbody", { children: loading ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: 8, className: "text-center py-4 font-['Inter:Regular',sans-serif] text-[13px] text-[#737686]", children: "Loading transfers..." }) }) : filtered.map((t, i) => /* @__PURE__ */ jsxs("tr", { className: `border-b border-[#c3c6d7] hover:bg-[#f8f9ff] transition-colors ${i === filtered.length - 1 ? "border-b-0" : ""}`, children: [
        /* @__PURE__ */ jsxs("td", { className: "px-[16px] py-[14px]", children: [
          /* @__PURE__ */ jsx("p", { className: "font-['Liberation_Mono:Regular',monospace] text-[12px] text-[#131b2e]", children: t.transferNumber }),
          t.notes && /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[10px] mt-[1px] max-w-[100px] truncate", children: t.notes })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[4px] max-w-[200px]", children: [
          /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#505f76] text-[11px] truncate", children: t.fromWarehouse.replace(" Warehouse", "").replace(" Center", "").replace(" Facility", "").replace(" Hub", "").replace(" Depot", "") }),
          /* @__PURE__ */ jsx(ArrowRight, { size: 10, className: "text-[#737686] shrink-0" }),
          /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#505f76] text-[11px] truncate", children: t.toWarehouse.replace(" Warehouse", "").replace(" Center", "").replace(" Facility", "").replace(" Hub", "").replace(" Depot", "") })
        ] }) }),
        /* @__PURE__ */ jsxs("td", { className: "px-[16px] py-[14px]", children: [
          /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#131b2e] text-[12px]", children: t.product }),
          /* @__PURE__ */ jsx("p", { className: "font-['Liberation_Mono:Regular',monospace] text-[10px] text-[#737686]", children: t.sku })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[4px]", children: [
          /* @__PURE__ */ jsx(Package, { size: 12, className: "text-[#737686]" }),
          /* @__PURE__ */ jsx("p", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#131b2e] text-[12px]", children: t.qty })
        ] }) }),
        /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px]", children: /* @__PURE__ */ jsx("span", { className: `px-[7px] py-[2px] rounded-[4px] text-[11px] font-['Inter:Medium',sans-serif] font-medium ${PRIORITY_STYLES[t.priority]}`, children: t.priority }) }),
        /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px]", children: /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#505f76] text-[12px]", children: t.requestedBy }) }),
        /* @__PURE__ */ jsxs("td", { className: "px-[16px] py-[14px]", children: [
          /* @__PURE__ */ jsx("p", { className: "font-['Inter:Regular',sans-serif] text-[#505f76] text-[12px]", children: t.date }),
          t.completedDate && /* @__PURE__ */ jsxs("p", { className: "font-['Inter:Regular',sans-serif] text-[#737686] text-[10px]", children: [
            "Done: ",
            t.completedDate
          ] })
        ] }),
        /* @__PURE__ */ jsx("td", { className: "px-[16px] py-[14px]", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-[5px]", children: [
          STATUS_STYLES[t.status].icon,
          /* @__PURE__ */ jsx("span", { className: `px-[7px] py-[2px] rounded-[4px] text-[11px] font-['Inter:Medium',sans-serif] font-medium ${STATUS_STYLES[t.status].badge}`, children: t.status })
        ] }) })
      ] }, t._id)) })
    ] }) }),
    showModal && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-[24px]", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-[16px] shadow-xl w-full max-w-[520px] border border-[#c3c6d7]", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-[24px] py-[18px] border-b border-[#c3c6d7]", children: [
        /* @__PURE__ */ jsx("p", { className: "font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold text-[#131b2e] text-[18px]", children: "New Transfer Request" }),
        /* @__PURE__ */ jsx("button", { onClick: () => setShowModal(false), className: "p-[6px] rounded-[8px] hover:bg-[#f2f3ff] transition-colors text-[#737686]", children: /* @__PURE__ */ jsx(X, { size: 16 }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-[24px] flex flex-col gap-[16px]", children: [
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-[12px]", children: ["from", "to"].map((field) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block capitalize", children: field === "from" ? "From Warehouse" : "To Warehouse" }),
          /* @__PURE__ */ jsxs("select", { value: form[field], onChange: (e) => setForm((f) => ({ ...f, [field]: e.target.value })), className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] bg-white focus:outline-none focus:border-[#004ac6]", children: [
            /* @__PURE__ */ jsx("option", { value: "", children: "Select warehouse..." }),
            warehouses.map((w) => /* @__PURE__ */ jsx("option", { value: w.name, children: w.name }, w._id))
          ] })
        ] }, field)) }),
        [{ key: "sku", label: "SKU", placeholder: "e.g. SKU-10045" }, { key: "product", label: "Product Name", placeholder: "e.g. Wireless Headphones" }].map(({ key, label, placeholder }) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block", children: label }),
          /* @__PURE__ */ jsx("input", { value: form[key], onChange: (e) => setForm((f) => ({ ...f, [key]: e.target.value })), placeholder, className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white" })
        ] }, key)),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-[12px]", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block", children: "Quantity" }),
            /* @__PURE__ */ jsx("input", { type: "number", value: form.qty, onChange: (e) => setForm((f) => ({ ...f, qty: e.target.value })), placeholder: "0", className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white" })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block", children: "Priority" }),
            /* @__PURE__ */ jsxs("select", { value: form.priority, onChange: (e) => setForm((f) => ({ ...f, priority: e.target.value })), className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] bg-white focus:outline-none focus:border-[#004ac6]", children: [
              /* @__PURE__ */ jsx("option", { children: "High" }),
              /* @__PURE__ */ jsx("option", { children: "Normal" }),
              /* @__PURE__ */ jsx("option", { children: "Low" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[12px] tracking-[0.12px] mb-[6px] block", children: "Notes (optional)" }),
          /* @__PURE__ */ jsx("textarea", { value: form.notes, onChange: (e) => setForm((f) => ({ ...f, notes: e.target.value })), placeholder: "Add any notes...", rows: 2, className: "w-full px-[12px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Regular',sans-serif] text-[12px] text-[#131b2e] placeholder:text-[#737686] focus:outline-none focus:border-[#004ac6] bg-white resize-none" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-[8px] px-[24px] py-[16px] border-t border-[#c3c6d7]", children: [
        /* @__PURE__ */ jsx("button", { onClick: () => setShowModal(false), className: "px-[16px] py-[8px] rounded-[8px] border border-[#c3c6d7] font-['Inter:Medium',sans-serif] font-medium text-[#505f76] text-[13px] hover:bg-[#f2f3ff] transition-colors", children: "Cancel" }),
        /* @__PURE__ */ jsx("button", { onClick: handleSubmitRequest, className: "px-[16px] py-[8px] rounded-[8px] bg-[#2563eb] text-white font-['Inter:Medium',sans-serif] font-medium text-[13px] hover:bg-[#1d4ed8] transition-colors drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]", children: "Submit Request" })
      ] })
    ] }) })
  ] });
}

export {
  TransferRequests as default
};
