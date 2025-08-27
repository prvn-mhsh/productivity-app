
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBudgetData } from '@/hooks/use-budget-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, BellRing } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const reminderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  eventTime: z.date({
    required_error: "A date and time is required.",
  }),
});

type ReminderFormValues = z.infer<typeof reminderSchema>;

function RemindersPage() {
  const { reminders, addReminder, loading } = useBudgetData();
  const { toast } = useToast();

  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      title: '',
    },
  });

  const onSubmit = (values: ReminderFormValues) => {
    addReminder({
        title: values.title,
        eventTime: values.eventTime.toISOString()
    });
    toast({
        title: "Reminder Set!",
        description: `You will be reminded about "${values.title}".`
    });
    form.reset();
  };

  return (
    <div className="flex flex-col gap-6">
       <div>
        <h1 className="text-3xl font-bold">Reminders</h1>
        <p className="text-muted-foreground">Schedule alerts for your tasks and events.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Pay rent" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventTime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date & Time</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Set Reminder</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
                <p>Loading...</p>
            ) : reminders.length > 0 ? (
              <ul className="space-y-4">
                {reminders.map((reminder) => (
                  <li key={reminder.id} className="flex items-center p-3 bg-secondary rounded-lg">
                    <BellRing className="w-5 h-5 mr-4 text-primary" />
                    <div className="flex-1">
                      <p className="font-semibold">{reminder.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(reminder.eventTime), "PPP, h:mm a")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
                <div className="text-center text-muted-foreground py-10">
                    <p>No upcoming reminders.</p>
                    <p>Add a new reminder to get started.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RemindersPage;
