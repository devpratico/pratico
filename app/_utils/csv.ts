export function convertToCsvString(data: string[][]): string {
    return data.map(row => row.join(",")).join("\n");
};

export function downloadCSV(
    csvString: string,
    filename: string
) {
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
};