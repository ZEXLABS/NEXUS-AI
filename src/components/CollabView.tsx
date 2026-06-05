import React, { useState } from "react";
import { Users, UserPlus, Radio, Wifi, WifiOff, MessageSquare } from "lucide-react";
import { TeamMember } from "../types";

export default function CollabView() {
  const [newUsername, setNewUsername] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([
    { id: "m1", username: "Alex_Chen", status: "WORKING_ON_ALPHA", isOnline: true },
    { id: "m2", username: "Sarah_Jenkins", status: "OFFLINE", isOnline: false },
    { id: "m3", username: "Marcus_Reed", status: "IN_MEETING", isOnline: true },
    { id: "m4", username: "Data Synthesis Bot", status: "IDLE", isOnline: true }
  ]);

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const fresh: TeamMember = {
      id: `member-${Date.now()}`,
      username: newUsername.replace(/\s+/g, "_"),
      status: "WORKING_ON_ALPHA",
      isOnline: true
    };

    setMembers([...members, fresh]);
    setNewUsername("");
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto pb-24 font-sans bg-[#030706]">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight uppercase">
          TEAM <span className="text-nexus-green nexus-glow-text text-nexus-green">COLLABORATION</span>
        </h1>
        <p className="text-gray-400 text-sm md:text-base leading-relaxed">
          Synced active directories for operator terminal clusters. Connect with team members and AI synthesized bots.
        </p>
      </div>

      {/* Adding/inviting a member inline form block */}
      <form onSubmit={handleInviteMember} className="p-4 bg-[#080f0d] border border-nexus-border rounded-lg space-y-3 max-w-md">
        <span className="font-mono text-[10px] text-[#00ff88]/60 tracking-widest font-black block uppercase pl-1">
          REGISTER_NEW_OPERATOR // CODES
        </span>
        <div className="flex items-center space-x-2 bg-[#030706] border border-nexus-border focus-within:border-nexus-green/40 p-1 rounded">
          <UserPlus className="w-4 h-4 text-gray-500 ml-2" />
          <input 
            id="collab-name-input"
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="e.g. operator_gamma"
            className="flex-grow bg-transparent text-xs border-none focus:outline-none text-white font-mono placeholder-gray-600 pl-1 py-1"
            required
          />
        </div>
        <button 
          id="collab-add-operator-btn"
          type="submit"
          className="bg-[#0c1c16] hover:bg-[#00331b] border border-nexus-green/20 hover:border-nexus-green text-nexus-green font-mono text-[11px] font-bold w-full py-2 rounded transition-all cursor-pointer"
        >
          GENERATE_INVITATION_LINK
        </button>
      </form>

      {/* Roster database matched visually with high-tech tags */}
      <div className="space-y-3">
        <span className="font-mono text-[11px] text-gray-550 block font-bold uppercase tracking-wider pl-1">
          ACTIVE_CLUSTER_ROSTER : ({members.length})
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {members.map((member) => (
            <div 
              key={member.id}
              className={`p-4 rounded-lg border bg-[#080f0d] flex items-center justify-between shadow transition-all ${
                member.isOnline ? "border-nexus-green/30" : "border-nexus-border opacity-65"
              }`}
            >
              <div className="flex items-center space-x-3.5">
                {/* Visual Avatar frame with network status pips */}
                <div className="relative">
                  <div className="w-10 h-10 rounded border border-nexus-green/25 overflow-hidden bg-[#0c1c16] flex items-center justify-center font-mono font-bold text-nexus-green">
                    {member.username.substring(0, 2).toUpperCase()}
                  </div>
                  <span className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-nexus-bg ${
                    member.isOnline ? "bg-nexus-green animate-pulse" : "bg-gray-600"
                  }`}></span>
                </div>

                <div className="space-y-0.5">
                  <h4 className="font-display font-bold text-sm text-white flex items-center space-x-1.5 leading-none">
                    <span>{member.username}</span>
                  </h4>
                  <span className="font-mono text-[9px] text-[#00ff88]/60 uppercase tracking-widest block font-extrabold mt-0.5">
                    {member.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className={`flex items-center space-x-1 px-2.5 py-1.5 rounded border ${
                  member.isOnline 
                    ? "bg-[#0b1c15] text-nexus-green border-nexus-green/20" 
                    : "bg-[#141414] text-gray-500 border-gray-800"
                }`}>
                  {member.isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
                  <span className="text-[10px]">{member.isOnline ? "ONLINE" : "SILENT"}</span>
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
