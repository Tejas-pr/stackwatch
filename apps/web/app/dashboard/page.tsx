"use client";

import { useEffect, useState } from "react";
import DashboardHeader from "../../components/dashboard/header";
import WebsiteList from "../../components/dashboard/website-list";
import AddWebsiteModal from "../../components/dashboard/add-website-model";
import { deleteWebsite, getDashboardDetails } from "../../lib/server";

export interface Website {
  id: string;
  name: string;
  url: string;
  status: "up" | "down";
  uptime: number;
  lastChecked: Date;
  responseTime: number;
  ticks: any;
}

export default function DashboardPage() {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [headerData, setHeaderData] = useState({
    totalSites: 0,
    averageUptime: 0,
    issues: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetch = async () => {
    const data = await getDashboardDetails();
    const dashboard = data.data;

    setWebsites(dashboard.websites);
    setHeaderData({
      totalSites: dashboard.totalSites,
      averageUptime: dashboard.averageUptime,
      issues: dashboard.issues,
    });
    setLoading(false);
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleAddWebsite = (
    website: Omit<Website, "id" | "status" | "lastChecked" | "responseTime">,
  ) => {
    const newWebsite: Website = {
      ...website,
      id: Date.now().toString(),
      status: "up",
      lastChecked: new Date(),
      responseTime: Math.floor(Math.random() * 300) + 50,
    };
    setWebsites([...websites, newWebsite]);
    setShowAddModal(false);
  };

  const handleDeleteWebsite = async (id: string) => {
    setWebsites(websites.filter((w) => w.id !== id));
    // const deleted = await deleteWebsite(id);
    // console.log(">>>>>>>>>>",deleted);
  };

  const handleRefresh = () => {
    fetch();
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader
          headerData={headerData}
          loading={loading}
          onRefresh={handleRefresh}
          onAddWebsite={() => setShowAddModal(true)}
        />
        <WebsiteList websites={websites} onDelete={handleDeleteWebsite} />
        <AddWebsiteModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      </div>
    </main>
  );
}
