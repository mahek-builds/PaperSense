const API_BASE_URL = "https://mahek2bhatia-ai-research-analyst.hf.space";

type UploadApiResponse = {
  message?: string;
  chunks_added?: number;
  pages_read?: number;
  preview_text?: string;
  error?: string;
};

type QueryApiResponse = {
  answer?: string;
  error?: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || "Invalid JSON response from server.");
  }
}

export async function uploadPdf(file: File): Promise<{
  message: string;
  chunksAdded: number;
  pagesRead: number;
  previewText: string;
}> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  const data = await parseResponse<UploadApiResponse>(response);

  if (!response.ok || data.error) {
    throw new Error(data.error || `Upload failed with status ${response.status}`);
  }

  return {
    message: data.message || "Upload complete",
    chunksAdded: data.chunks_added ?? 0,
    pagesRead: data.pages_read ?? 0,
    previewText: data.preview_text || "",
  };
}

export async function queryDocument(question: string): Promise<{ answer: string }> {
  const response = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ question }),
  });

  const data = await parseResponse<QueryApiResponse>(response);

  if (!response.ok || data.error) {
    throw new Error(data.error || `Query failed with status ${response.status}`);
  }

  return { answer: data.answer || "No answer returned from API." };
}

export { API_BASE_URL };
