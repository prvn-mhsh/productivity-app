
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBudgetData } from '@/hooks/use-budget-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash2, StickyNote } from 'lucide-react';
import type { Note } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

type NoteFormValues = z.infer<typeof noteSchema>;

interface NotesPageProps {
  isFormOpen: boolean;
  onFormOpenChange: (open: boolean) => void;
  onNoteCreate: () => void;
}


function NotesPage({ isFormOpen, onFormOpenChange, onNoteCreate }: NotesPageProps) {
  const { notes, addNote, updateNote, deleteNote, loading } = useBudgetData();
  const { toast } = useToast();
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const isMobile = useIsMobile();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });
  
  const handleOpenForm = (note: Note | null = null) => {
    setEditingNote(note);
    if (note) {
      form.reset({ title: note.title, content: note.content });
    } else {
      form.reset({ title: '', content: '' });
    }
    onFormOpenChange(true);
  };

  const handleCloseForm = () => {
    onFormOpenChange(false);
    setEditingNote(null);
  }

  const onSubmit = (values: NoteFormValues) => {
    if (editingNote) {
      updateNote({ ...editingNote, ...values });
      toast({ title: 'Note Updated', description: 'Your note has been successfully updated.' });
    } else {
      addNote(values);
      toast({ title: 'Note Created', description: 'Your new note has been saved.' });
    }
    handleCloseForm();
  };

  const handleDelete = (noteId: string) => {
    deleteNote(noteId);
    toast({ title: 'Note Deleted', description: 'Your note has been deleted.' });
  }
  
  const NoteList = () => (
    <>
    {loading ? (
        <p>Loading...</p>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {notes.map((note) => (
            <Card key={note.id} className='flex flex-col'>
              <CardHeader>
                <CardTitle className='truncate'>{note.title}</CardTitle>
              </CardHeader>
              <CardContent className='flex-grow'>
                <p className="text-muted-foreground whitespace-pre-wrap line-clamp-4">{note.content}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleOpenForm(note)}>
                    <Edit className="mr-1 h-4 w-4" /> Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-1 h-4 w-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your note.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(note.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-20 flex flex-col items-center justify-center h-full">
          <StickyNote className="mx-auto h-12 w-12" />
          <p className="mt-4 font-semibold">No notes yet.</p>
          <p>Click the '+' button to get started.</p>
        </div>
      )}
    </>
  )

  return (
    <div className="flex flex-col gap-6 h-full">
      {isMobile ? (
         <ScrollArea className="h-full">
            <div className="p-1">
             <NoteList />
            </div>
        </ScrollArea>
      ) : (
        <NoteList />
      )}

      <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingNote ? 'Edit Note' : 'Create Note'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Note title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write your note here..." {...field} rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost" onClick={handleCloseForm}>Cancel</Button>
                </DialogClose>
                <Button type="submit">{editingNote ? 'Save Changes' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default NotesPage;
