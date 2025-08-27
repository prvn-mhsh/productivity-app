
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderArchive, Upload } from 'lucide-react';

function DocumentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Upload, view, and download your important files.</p>
        </div>
        <Button>
          <Upload className="mr-2" />
          Upload File
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>My Files</CardTitle>
          <CardDescription>A list of all your uploaded documents.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-20">
            <FolderArchive className="mx-auto h-12 w-12" />
            <p className="mt-4 font-semibold">No documents yet.</p>
            <p>Click "Upload File" to get started.</p>
            <p className="text-sm mt-4">Note: File storage setup is required to enable uploads.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DocumentsPage;
