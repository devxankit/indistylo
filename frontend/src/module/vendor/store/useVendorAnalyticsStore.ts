import { create } from "zustand";
import { api } from "../../user/services/apiClient";

export interface AnalyticsSummary {
  revenue: { current: number; previous: number; change: number };
  bookings: { current: number; previous: number; change: number };
  customers: { current: number; previous: number; change: number };
  averageOrder: { current: number; previous: number; change: number };
}

export interface ChartData {
  revenueTrend: { day: string; revenue: number }[];
  bookingsTrend: { day: string; bookings: number }[];
}

export interface PerformanceMetrics {
  completionRate: number;
  customerSatisfaction: number;
  responseTime: number;
  retentionRate: number;
}

export interface TopService {
  service: string;
  bookings: number;
  revenue: number;
  percentage: number;
  fill: string;
}

interface VendorAnalyticsState {
  summary: AnalyticsSummary | null;
  charts: ChartData | null;
  performance: PerformanceMetrics | null;
  topServices: TopService[];
  loading: boolean;
  error: string | null;
  fetchAnalytics: (range?: string) => Promise<void>;
}

export const useVendorAnalyticsStore = create<VendorAnalyticsState>((set) => ({
  summary: null,
  charts: null,
  performance: null,
  topServices: [],
  loading: false,
  error: null,

  fetchAnalytics: async (range = "month") => {
    set({ loading: true, error: null });
    try {
      const response: any = await api.get(`/vendor/stats?range=${range}`);
      set({
        summary: response.summary,
        charts: response.charts,
        performance: response.performance,
        topServices: response.topServices || [],
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch analytics",
        loading: false,
      });
    }
  },
}));
