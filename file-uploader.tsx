"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, Check, AlertCircle } from "lucide-react"
import { uploadDocument } from "@/lib/actions"

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload")
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)
    setSuccess(false)

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            clearInterval(interval)
            return 95
          }
          return prev + 5
        })
      }, 100)

      const formData = new FormData()
      formData.append("file", file)

      await uploadDocument(formData)

      clearInterval(interval)
      setProgress(100)
      setSuccess(true)
      setFile(null)

      // Reset form after 2 seconds
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError("Failed to upload document. Please try again.")
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF, DOCX, TXT (MAX. 10MB)</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </label>
      </div>

      {file && (
        <div className="text-sm">
          Selected: <span className="font-medium">{file.name}</span> ({(file.size / 1024 / 1024).toFixed(2)} MB)
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-gray-500">Uploading... {progress}%</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-500">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-sm text-green-500">
          <Check className="h-4 w-4" />
          <span>Document uploaded successfully!</span>
        </div>
      )}

      <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
        {uploading ? "Uploading..." : "Upload Document"}
      </Button>
    </div>
  )
}
