import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import {useSearchParams} from 'react-router-dom';
import {useDebouncedCallback} from "use-debounce";
import {parseIntOrUndefined} from "@/lib/utils.ts";
import {BlogsTable} from "@/pages/Administration/Blog/blog-data-table/blog-table.tsx";
import BlogService from "@/services/BlogService.tsx";

export function BlogPostList() {
  const [searchParams] = useSearchParams();
  const [blogPromise, setBlogPromise] = useState<any>();

  const fetchBlogs = useDebouncedCallback(
    () => {
      const query = {
        categoryId: parseIntOrUndefined(searchParams.get('categoryId')),
        search: searchParams.get('search'),
        page: parseIntOrUndefined(searchParams.get('page')),
        size: parseIntOrUndefined(searchParams.get('per_page')),
        sort: searchParams.get('sort') || 'postId,desc',
      };
      setBlogPromise(BlogService.getBlogs(query));
    }, 1000
  );

  useEffect(() => {
    fetchBlogs();
  }, [searchParams]);

  return (
    <main className="grid flex-1 orders-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Tabs defaultValue="all">
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                Blogs
              </CardTitle>
              <CardDescription>Manage blogs and view
                details.</CardDescription>
            </CardHeader>
            <CardContent>
              <BlogsTable blogPromise={blogPromise} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};