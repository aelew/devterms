'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
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

interface SubmitDefinitionFormProps {
  isAuthenticated: boolean;
}

export const formSchema = z.object({
  term: z.string().min(1).max(64),
  definition: z.string().min(1).max(512),
  example: z.string().min(1).max(512)
});

export function SubmitDefinitionForm({
  isAuthenticated
}: SubmitDefinitionFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      term: '',
      definition: '',
      example: ''
    }
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
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
                  placeholder="Bob the Builder decided to stop pursuing a developer position because the job market was too competitive."
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
          <Button>Submit my definition</Button>
        ) : (
          <Link className={buttonVariants()} href="/login">
            Sign in to submit
          </Link>
        )}
      </form>
    </Form>
  );
}
