
'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderArchive, Upload } from 'lucide-react';

function DocumentsPage() {
    const pageContent = (
         <div className="flex flex-col gap-6 h-full">
            <Card className='flex-grow'>
                <CardHeader>
                <CardTitle>My Files</CardTitle>
                <CardDescription>A list of all your uploaded documents.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-3/4">
                <div className="text-center text-muted-foreground py-20">
                    <FolderArchive className="mx-auto h-12 w-12" />
                    <p className="mt-4 font-semibold">No documents yet.</p>
                    <p>Click the '+' button to get started.</p>
                    <p className="text-sm mt-4">Note: File storage setup is required to enable uploads.</p>
                </div>
                </CardContent>
            </Card>
        </div>
    )
  return (
    <AppShell>
        {pageContent}
    </AppShell>
  );
}

export default DocumentsPage;
