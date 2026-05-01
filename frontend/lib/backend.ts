const BACKEND_URL = process.env.BACKEND_URL!
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY!

const headers = () => ({
  "x-internal-key": INTERNAL_API_KEY,
})

export type ProcessResult = {
  title: string
  full_text: string
  thumbnail_url: string | null
  summary: string
  category: string
  tags: string[]
}

export async function processContent(payload: {
  type: string
  url?: string
  title?: string
  text?: string
}): Promise<ProcessResult> {
  const res = await fetch(`${BACKEND_URL}/contents/process`, {
    method: "POST",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json.detail ?? "백엔드 오류")
  }
  return res.json()
}

export async function processFile(file: File): Promise<ProcessResult> {
  const fd = new FormData()
  fd.append("file", file)
  const res = await fetch(`${BACKEND_URL}/contents/process-file`, {
    method: "POST",
    headers: headers(),
    body: fd,
  })
  if (!res.ok) {
    const json = await res.json().catch(() => ({}))
    throw new Error(json.detail ?? "백엔드 오류")
  }
  return res.json()
}
