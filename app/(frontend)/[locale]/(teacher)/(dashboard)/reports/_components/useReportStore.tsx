// import { create } from "zustand";
// import { SessionInfoType } from "../[room_id]/page";

// type ReportStore = {
//     reports: SessionInfoType[];
//     setReports: (reports: SessionInfoType[]) => void;
//     addReport: (report: SessionInfoType) => void;
//     removeReport: (reportId: string) => void;
//     updateReport: (reportId: string, updatedReport: Partial<SessionInfoType>) => void;
//   };

// export const useReportStore = create<ReportStore>((set) => ({
//     reports: [],
//     setReports: (reports) => set({ reports }),
//     addReport: (report) => set((state) => ({ reports: [...state.reports, report] })),
//     removeReport: (reportId) => set((state) => ({ reports: state.reports.filter((report) => report.id !== reportId) })),
//     updateReport: (reportId: string, updatedReport: Partial<Report>) => 
//         set((state) => ({ 
//             reports: state.reports.map((report) => report.id === reportId ? { ...report, ...updatedReport } : report) 
//         })
//     ),
// }));