"use client"

import { useState } from "react"
import { Search, Plus, Ticket, Clock, CheckCircle, XCircle, ChevronUp, ChevronDown, MessageSquare } from "lucide-react"
import { Link } from "react-router-dom"

const mockTickets = [
  { id: "TKT-001", subject: "Login issues with new system", category: "Technical", status: "open", priority: "high", created: "2024-01-15", updated: "2024-01-15", replies: 3, votes: 5 },
  { id: "TKT-002", subject: "Password reset not working", category: "Account", status: "in-progress", priority: "medium", created: "2024-01-14", updated: "2024-01-16", replies: 1, votes: 2 },
  { id: "TKT-003", subject: "Feature request: Dark mode", category: "Feature Request", status: "resolved", priority: "low", created: "2024-01-10", updated: "2024-01-12", replies: 8, votes: 12 },
  { id: "TKT-004", subject: "Application crashes on startup", category: "Bug Report", status: "closed", priority: "urgent", created: "2024-01-08", updated: "2024-01-09", replies: 15, votes: 8 },
]

const statusConfig = {
  open: { label: "Open", icon: <Clock size={16} />, className: "status-open" },
  "in-progress": { label: "In Progress", icon: <Clock size={16} />, className: "status-in-progress" },
  resolved: { label: "Resolved", icon: <CheckCircle size={16} />, className: "status-resolved" },
  closed: { label: "Closed", icon: <XCircle size={16} />, className: "status-closed" },
}

const priorityConfig = {
  low: { label: "Low", className: "priority-low" },
  medium: { label: "Medium", className: "priority-medium" },
  high: { label: "High", className: "priority-high" },
  urgent: { label: "Urgent", className: "priority-urgent" },
}

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("updated")
  const [sortOrder, setSortOrder] = useState("desc")

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    let aValue, bValue
    switch (sortBy) {
      case "replies":
        aValue = a.replies
        bValue = b.replies
        break
      case "votes":
        aValue = a.votes
        bValue = b.votes
        break
      case "created":
        aValue = new Date(a.created).getTime()
        bValue = new Date(b.created).getTime()
        break
      default:
        aValue = new Date(a.updated).getTime()
        bValue = new Date(b.updated).getTime()
    }
    return sortOrder === "asc" ? aValue - bValue : bValue - aValue
  })

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const stats = {
    total: mockTickets.length,
    open: mockTickets.filter(t => t.status === "open").length,
    inProgress: mockTickets.filter(t => t.status === "in-progress").length,
    resolved: mockTickets.filter(t => t.status === "resolved").length,
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: "bold" }}>Dashboard</h1>
          <p style={{ color: "#888" }}>Manage your support tickets</p>
        </div>
        <Link to="/createticket" style={{ background: "#52796f", color: "#000", padding: "8px 16px", borderRadius: 6, textDecoration: "none", display: "flex", alignItems: "center" }}>
          <Plus style={{ marginRight: 8 }} size={18} />
          Create Ticket
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16, boxShadow: "0 1px 4px #0001" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#555" }}>Total Tickets</span>
            <Ticket color="#52796f" size={18} />
          </div>
          <div style={{ fontSize: 24, fontWeight: "bold", marginTop: 8, color: "#000" }}>{stats.total}</div>
        </div>
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16, boxShadow: "0 1px 4px #0001" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#555" }}>Open</span>
            <Clock color="#2563eb" size={18} />
          </div>
          <div style={{ fontSize: 24, fontWeight: "bold", color: "#2563eb", marginTop: 8 }}>{stats.open}</div>
        </div>
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16, boxShadow: "0 1px 4px #0001" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#555" }}>In Progress</span>
            <Clock color="#eab308" size={18} />
          </div>
          <div style={{ fontSize: 24, fontWeight: "bold", color: "#eab308", marginTop: 8 }}>{stats.inProgress}</div>
        </div>
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: 16, boxShadow: "0 1px 4px #0001" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#555" }}>Resolved</span>
            <CheckCircle color="#22c55e" size={18} />
          </div>
          <div style={{ fontSize: 24, fontWeight: "bold", color: "#22c55e", marginTop: 8 }}>{stats.resolved}</div>
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 1px 4px #0001", padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: "bold" }}>My Tickets</h2>
          <p style={{ color: "#888" }}>View and manage your support tickets</p>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search style={{ position: "absolute", left: 12, top: 12, color: "#aaa" }} size={16} />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: "8px 8px 8px 36px", borderRadius: 6, border: "1px solid #ddd", width: "100%" }}
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: 8, borderRadius: 6, border: "1px solid #ddd" }}>
            <option value="all">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Account">Account</option>
            <option value="Feature Request">Feature Request</option>
            <option value="Bug Report">Bug Report</option>
          </select>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ background: "#fff", color: "#000" }}>
                <th style={{ padding: 8, textAlign: "left" }}>Ticket ID</th>
                <th style={{ padding: 8, textAlign: "left" }}>Subject</th>
                <th style={{ padding: 8, textAlign: "left" }}>Category</th>
                <th style={{ padding: 8, textAlign: "left" }}>Status</th>
                <th style={{ padding: 8, textAlign: "left" }}>Priority</th>
                <th style={{ padding: 8, textAlign: "left", cursor: "pointer" }} onClick={() => toggleSort("replies")}>
                  Replies {sortBy === "replies" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </th>
                <th style={{ padding: 8, textAlign: "left", cursor: "pointer" }} onClick={() => toggleSort("votes")}>
                  Votes {sortBy === "votes" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </th>
                <th style={{ padding: 8, textAlign: "left", cursor: "pointer" }} onClick={() => toggleSort("updated")}>
                  Updated {sortBy === "updated" && (sortOrder === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTickets.map(ticket => (
                <tr key={ticket.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>
                    <Link to={`/tickets/${ticket.id}`} style={{ color: "#000", textDecoration: "none", fontWeight: 500 }}>{ticket.id}</Link>
                  </td>
                  <td style={{ padding: 8 }}>
                    <Link to={`/tickets/${ticket.id}`} style={{ color: "#222", textDecoration: "none" }}>{ticket.subject}</Link>
                  </td>
                  <td style={{ padding: 8 }}>
                    <span style={{ border: "1px solid #ddd", borderRadius: 4, padding: "2px 8px", fontSize: 12 }}>{ticket.category}</span>
                  </td>
                  <td style={{ padding: 8 }}>
                    <span style={{
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontSize: 12,
                      background: ticket.status === "open" ? "#dbeafe"
                        : ticket.status === "in-progress" ? "#fef9c3"
                        : ticket.status === "resolved" ? "#dcfce7"
                        : "#f1f5f9",
                      color: ticket.status === "open" ? "#2563eb"
                        : ticket.status === "in-progress" ? "#eab308"
                        : ticket.status === "resolved" ? "#22c55e"
                        : "#888",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4
                    }}>
                      {statusConfig[ticket.status].icon}
                      {statusConfig[ticket.status].label}
                    </span>
                  </td>
                  <td style={{ padding: 8 }}>
                    <span style={{
                      borderRadius: 4,
                      padding: "2px 8px",
                      fontSize: 12,
                      background: ticket.priority === "low" ? "#dcfce7"
                        : ticket.priority === "medium" ? "#fef9c3"
                        : ticket.priority === "high" ? "#fee2e2"
                        : "#fca5a5",
                      color: ticket.priority === "low" ? "#22c55e"
                        : ticket.priority === "medium" ? "#eab308"
                        : ticket.priority === "high" ? "#ef4444"
                        : "#b91c1c"
                    }}>
                      {priorityConfig[ticket.priority].label}
                    </span>
                  </td>
                  <td style={{ padding: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <MessageSquare size={14} />{ticket.replies}
                    </span>
                  </td>
                  <td style={{ padding: 8 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <ChevronUp size={14} color="#22c55e" />{ticket.votes}
                    </span>
                  </td>
                  <td style={{ padding: 8, color: "#888" }}>
                    {new Date(ticket.updated).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {sortedTickets.length === 0 && (
            <div style={{ textAlign: "center", padding: 32, color: "#888" }}>
              No tickets found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}