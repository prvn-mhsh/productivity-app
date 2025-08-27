
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
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
import { PlusCircle, Edit, Trash2, StickyNote } from 'lucide-react';
import type { Note } from '@/lib/types';

const noteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
});

type NoteFormValues = z.infer<typeof noteSchema>;

function NotesPage() {
  const { notes, addNote, updateNote, deleteNote, loading } = useBudgetData();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

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
    setIsFormOpen(true);
  };

  const onSubmit = (values: NoteFormValues) => {
    if (editingNote) {
      updateNote({ ...editingNote, ...values });
      toast({ title: 'Note Updated', description: 'Your note has been successfully updated.' });
    } else {
      addNote(values);
      toast({ title: 'Note Created', description: 'Your new note has been saved.' });
    }
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const handleDelete = (noteId: string) => {
    deleteNote(noteId);
    toast({ title: 'Note Deleted', description: 'Your note has been deleted.' });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Create, edit, and delete short textual notes.</p>
        </div>
        <Button onClick={() => handleOpenForm()}>
          <PlusCircle className="mr-2" />
          Create Note
        </Button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <Card key={note.id}>
              <CardHeader>
                <CardTitle>{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{note.content}</p>
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
        <div className="text-center text-muted-foreground py-20">
          <StickyNote className="mx-auto h-12 w-12" />
          <p className="mt-4 font-semibold">No notes yet.</p>
          <p>Click "Create Note" to get started.</p>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
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
                    <Button type="button" variant="ghost">Cancel</Button>
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
