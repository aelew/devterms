'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FlagIcon } from 'lucide-react';
import { usePlausible } from 'next-plausible';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { getActionErrorMessage } from '@/lib/utils';
import type { Events } from '@/types';
import { Textarea } from '../ui/textarea';
import { reportDefinition } from './_actions';
import { reportFormSchema } from './schema';

interface ReportButtonProps {
  definitionId: string;
}

export function DefinitionReportButton({ definitionId }: ReportButtonProps) {
  const plausible = usePlausible<Events>();

  const { execute, status } = useAction(reportDefinition, {
    onSuccess: (data) => {
      form.reset();
      toast.success(data.message);
      plausible('Report', { props: { 'Definition ID': definitionId } });
    },
    onError: (result) => {
      const message = getActionErrorMessage(result);
      toast.error(message);
    }
  });

  const form = useForm<z.infer<typeof reportFormSchema>>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      definitionId,
      reason: ''
    }
  });

  const onReportSubmit = (values: z.infer<typeof reportFormSchema>) => {
    execute(values);
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center text-destructive transition-color-transform hover:text-destructive/80 active:scale-95">
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
                      placeholder="What's wrong with this definition?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={status === 'executing'}>Submit report</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
