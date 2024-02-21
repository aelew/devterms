'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FlagIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Textarea } from '../ui/textarea';

interface ReportButtonProps {
  definitionId: string;
}

const formSchema = z.object({
  reason: z
    .string()
    .min(4, { message: 'Reason must be at least 4 characters.' })
});

export function DefinitionReportButton({ definitionId }: ReportButtonProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: ''
    }
  });

  const onReportSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center text-destructive hover:text-destructive/80">
        <FlagIcon className="mr-1.5 size-4" />
        Report
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report definition</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onReportSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              name="reason"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Why should this definition be removed?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Submit report</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
