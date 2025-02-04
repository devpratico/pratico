const convertToCSV = (data: Record<string, any>[]) => {
    if (!data.length) return "";

    const headers = Object.keys(data[0]).join(",");
    const rows = data.map(row => Object.values(row).join(","));

    return [headers, ...rows].join("\n");
};

export const downloadCSV = (
    data: Record<string, any>[],
    filename: string
) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
};