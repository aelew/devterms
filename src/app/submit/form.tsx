'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { getActionErrorMessage } from '@/lib/utils';
import { submitDefinition } from './_actions';
import { formSchema } from './schema';

interface SubmitDefinitionFormProps {
  isAuthenticated: boolean;
}

export function SubmitDefinitionForm({
  isAuthenticated
}: SubmitDefinitionFormProps) {
  const { execute, status } = useAction(submitDefinition, {
    onSuccess: (data) => {
      form.reset();
      toast.success(data.message);
    },
    onError: (result) => {
      const message = getActionErrorMessage(result);
      toast.error(message);
    }
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: '',
      definition: '',
      example: ''
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    execute(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          name="term"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Term</FormLabel>
              <FormControl>
                <Input
                  placeholder="developer"
                  disabled={!isAuthenticated}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The word or phrase you want to define.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="definition"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Definition</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="a person or company who builds something such as an idea, a design, or a product"
                  disabled={!isAuthenticated}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your definition should be clear to everyone, no inside jokes!
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="example"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Example</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Bob the Builder decided to stop pursuing a developer position because the job market was atrociously competitive."
                  disabled={!isAuthenticated}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                How would you use this term in a sentence?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isAuthenticated ? (
          <Button disabled={status === 'executing'}>
            Submit my definition
          </Button>
        ) : (
          <Link className={buttonVariants()} href="/login">
            Sign in to submit
          </Link>
        )}
      </form>
    </Form>
  );
}
