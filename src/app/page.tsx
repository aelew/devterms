import { SiGithub } from '@icons-pack/react-simple-icons';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { DefinitionCard } from './definition-card';

export default function Home() {
  return (
    <>
      <div className="flex flex-col-reverse gap-4 md:flex-row">
        <div className="flex flex-1 flex-col gap-4">
          <DefinitionCard
            term="developer"
            description="a person or company that creates new products, especially computer products such as software"
            example="Bob is a software developer working at Macrohard."
            upvotes={1293}
            downvotes={62}
            user={{ name: 'RandomPerson123' }}
            badges={['Word of the day']}
            createdAt={new Date(Date.now() - 19239123)}
          />
          <DefinitionCard
            term="developer"
            description="a person or company that creates new products, especially computer products such as software"
            example="Bob is a software developer working at Macrohard."
            upvotes={1293}
            downvotes={62}
            user={{ name: 'RandomPerson123' }}
            badges={[]}
            createdAt={new Date(Date.now() - 19239123)}
          />
          <DefinitionCard
            term="developer"
            description="a person or company that creates new products, especially computer products such as software"
            example="Bob is a software developer working at Macrohard."
            upvotes={1293}
            downvotes={62}
            user={{ name: 'RandomPerson123' }}
            badges={[]}
            createdAt={new Date(Date.now() - 19239123)}
          />
          <DefinitionCard
            term="developer"
            description="a person or company that creates new products, especially computer products such as software"
            example="Bob is a software developer working at Macrohard."
            upvotes={1293}
            downvotes={62}
            user={{ name: 'RandomPerson123' }}
            badges={[]}
            createdAt={new Date(Date.now() - 19239123)}
          />
        </div>
        <Card className="h-fit md:w-1/3">
          <CardHeader className="pb-4">
            <CardTitle>DevTerms</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground">
              A crowdsourced dictionary for developers by developers. Find
              definitions for all sorts of technical terms, programming jargon,
              and more!
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Link
              href="/submit"
              className={buttonVariants({
                className: 'w-full',
                variant: 'outline'
              })}
            >
              <PlusIcon className="mr-2 size-4" />
              Submit a definition
            </Link>
            <Button className="w-full" variant="outline">
              <span className="mr-2" aria-hidden>
                🍀
              </span>{' '}
              I&apos;m feeling lucky&hellip;
            </Button>
            <Link
              href="https://github.com/aelew/devterms"
              className={buttonVariants({
                className: 'w-full',
                variant: 'outline'
              })}
            >
              <SiGithub className="mr-2 size-4" />
              GitHub
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
