"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileText, MoreVertical, Eye, Download, Trash } from "lucide-react"

// Mock data for demonstration
const mockDocuments = [
  {
    id: "1",
    title: "Project Proposal.pdf",
    uploadDate: "2025-04-10",
    size: "2.4 MB",
    status: "processed",
  },
  {
    id: "2",
    title: "Financial Report Q1.docx",
    uploadDate: "2025-04-09",
    size: "1.8 MB",
    status: "processed",
  },
  {
    id: "3",
    title: "Meeting Notes.txt",
    uploadDate: "2025-04-08",
    size: "0.3 MB",
    status: "processed",
  },
  {
    id: "4",
    title: "Research Paper.pdf",
    uploadDate: "2025-04-07",
    size: "5.2 MB",
    status: "processing",
  },
  {
    id: "5",
    title: "Product Roadmap.docx",
    uploadDate: "2025-04-06",
    size: "1.1 MB",
    status: "failed",
  },
]

export function DocumentList() {
  const [documents, setDocuments] = useState(mockDocuments)

  const handleDelete = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processed":
        return <Badge className="bg-green-500">Processed</Badge>
      case "processing":
        return <Badge className="bg-yellow-500">Processing</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>{doc.title}</span>
                  </div>
                </TableCell>
                <TableCell>{doc.uploadDate}</TableCell>
                <TableCell>{doc.size}</TableCell>
                <TableCell>{getStatusBadge(doc.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Download</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(doc.id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
